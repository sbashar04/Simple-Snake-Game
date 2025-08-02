// Snake game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let gameActive = false;
let gameInterval;

const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
window.addEventListener('keydown', keyDown);

function gameLoop() {
    if (!gameActive) return;

    update();
    draw();
}

function update() {
    // Move snake
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
    }

    // Check self collision
    for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        placeFood();
    } else {
        snake.pop();
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#0f0';
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Draw food
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Ensure food is not placed on the snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            placeFood();
            break;
        }
    }
}

function keyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (velocity.y === 1) break;
            velocity = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (velocity.y === -1) break;
            velocity = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (velocity.x === 1) break;
            velocity = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (velocity.x === -1) break;
            velocity = { x: 1, y: 0 };
            break;
    }
}

function startGame() {
    if (!gameActive) {
        gameActive = true;
        snake = [{ x: 10, y: 10 }];
        velocity = { x: 1, y: 0 }; // Start moving right initially
        score = 0;
        scoreElement.textContent = score;
        gameOverElement.classList.add('hidden');
        placeFood();
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 100);
    }
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
}

function resetGame() {
    gameActive = false;
    clearInterval(gameInterval);
    snake = [{ x: 10, y: 10 }];
    velocity = { x: 0, y: 0 };
    score = 0;
    scoreElement.textContent = score;
    gameOverElement.classList.add('hidden');
    draw();
}

// Initial draw
draw();
