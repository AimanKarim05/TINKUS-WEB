document.addEventListener('DOMContentLoaded', function () {
    const outputDiv = document.getElementById('output');
    const startBtn = document.getElementById('startBtn');
    const pingPongCanvas = document.getElementById('pingPongCanvas');
    const ctx = pingPongCanvas.getContext('2d');
    let recognition;
    let isPlayingPingPong = false;
    let isGameOver = false;

    // Paddle properties
    const paddleWidth = 10;
    const paddleHeight = 60;
    let paddleY = (pingPongCanvas.height - paddleHeight) / 2;
    let aiPaddleY = (pingPongCanvas.height - paddleHeight) / 2;

    // Ball properties
    const ballRadius = 8;
    let ballX = pingPongCanvas.width / 2;
    let ballY = pingPongCanvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 2;

    try {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
    } catch (e) {
        console.error('SpeechRecognition is not supported by this browser.');
    }

    if (recognition) {
        recognition.onresult = function (event) {
            const result = event.results[0][0].transcript;
            outputDiv.innerHTML = `<p>You: ${result}</p>`;

            if (isPlayingPingPong && !isGameOver) {
                handlePingPongInput(result.toLowerCase());
            } else {
                handleUserInput(result.toLowerCase());
            }
        };

        startBtn.addEventListener('click', function () {
            recognition.start();
        });
    }

    function handleUserInput(input) {
        let response;

        if (input.includes('let\'s play ping pong')) {
            response = 'Sure, let\'s play ping pong!';
            isPlayingPingPong = true;
            isGameOver = false;
            pingPongCanvas.style.display = 'block';
            initializePingPong();
            startPingPong();
        } else if (input.includes('hello')) {
            response = 'Hi there! How can I help you?';

        } else if (input.includes('how are you')) {
            response = "I don't have feelings, but thanks for asking!";

        } else if (input.includes('what is your name')) {
            response = 'I am Tinkus, your virtual assistant.';

        } else if (input.includes('how old are you')) {
            response = 'I was born in July 24th, 2023 but upgraded into the world of webs in December 20th, 2023.';

        } else if (input.includes('bye')) {
            response = 'Goodbye! Have a great day!';

        } else {
            response = 'I did not understand that. Can you please repeat?';
        }

        outputDiv.innerHTML += `<p>Tinkus: ${response}</p>`;
        speak(response);
    }

    function handlePingPongInput(input) {
        // Implement ping pong game logic based on user input
        // ...

        // For example, you can have logic to move the user's paddle
        // based on voice commands and update the ball position.
    }

    function initializePingPong() {
        // Set up the initial positions of paddles and the ball
        paddleY = (pingPongCanvas.height - paddleHeight) / 2;
        aiPaddleY = (pingPongCanvas.height - paddleHeight) / 2;
        ballX = pingPongCanvas.width / 2;
        ballY = pingPongCanvas.height / 2;
    }

    function startPingPong() {
        // Update the game state and redraw the canvas
        function update() {
            movePaddle();
            moveAiPaddle();
            moveBall();
            draw();
        }

        // Animation loop
        function gameLoop() {
            update();
            if (!isGameOver) {
                requestAnimationFrame(gameLoop);
            }
        }

        gameLoop();
    }

    function movePaddle() {
        // Move the paddle with the mouse
        document.addEventListener('mousemove', function (event) {
            const mouseY = event.clientY - pingPongCanvas.getBoundingClientRect().top - paddleHeight / 2;
            paddleY = Math.min(Math.max(mouseY, 0), pingPongCanvas.height - paddleHeight);
        });
    }

    function moveAiPaddle() {
        // Simple AI logic: AI paddle follows the ball's Y position
        aiPaddleY = ballY - paddleHeight / 2;
    }

    function moveBall() {
        // Move the ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Ball collisions with walls
        if (ballY + ballRadius > pingPongCanvas.height || ballY - ballRadius < 0) {
            ballSpeedY = -ballSpeedY;
        }

        // Ball collisions with paddles
        if (
            (ballX - ballRadius < paddleWidth && ballY > paddleY && ballY < paddleY + paddleHeight) ||
            (ballX + ballRadius > pingPongCanvas.width - paddleWidth && ballY > aiPaddleY && ballY < aiPaddleY + paddleHeight)
        ) {
            ballSpeedX = -ballSpeedX;
        }

        // Reset the ball if it goes out of bounds
        if (ballX - ballRadius < 0) {
            gameOver();
        } else if (ballX + ballRadius > pingPongCanvas.width) {
            gameOver();
        }
    }

    function gameOver() {
        isGameOver = true;
        pingPongCanvas.style.display = 'none'; // Hide the canvas
        outputDiv.innerHTML += "<p>Tinkus: Game over, I win!</p>";
        speak('Game over, I win!');
    }

    function draw() {
        // Draw the paddles and the ball on the canvas
        ctx.clearRect(0, 0, pingPongCanvas.width, pingPongCanvas.height);

        // Draw the paddles
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, paddleY, paddleWidth, paddleHeight);
        ctx.fillRect(pingPongCanvas.width - paddleWidth, aiPaddleY, paddleWidth, paddleHeight);

        // Draw the ball
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.closePath();
    }

    function speak(message) {
        const utterance = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(utterance);
    }
});
