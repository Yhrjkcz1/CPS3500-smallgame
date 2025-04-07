const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Initialize game objects
let paddle = new Paddle(canvas);
let balls = [new Ball(canvas)];
let level = 1;
let bricks = new Bricks(canvas, level);
let lives = 3;
let score = 0;
let gameRunning = true;
let paused = false;
let animationFrameId;

// Draw UI
function drawUI() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 30);
    ctx.fillText("Lives: " + lives, canvas.width - 120, 30);
    ctx.fillText("Level: " + level, canvas.width / 2 - 40, 30);
}

// Main draw loop
function draw() {
    if (!gameRunning || paused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bricks.draw(ctx);
    paddle.draw(ctx);
    balls.forEach(ball => ball.draw(ctx));
    effectsSystem.update();
    effectsSystem.draw(ctx);
    powerUpSystem.update(paddle, balls);
    powerUpSystem.draw(ctx);
    drawUI();

    // Move all balls and filter out lost ones
    const ballStatuses = balls.map(ball => ball.move(paddle, bricks));
    balls = balls.filter((_, index) => ballStatuses[index] === "active");

    // Check if all balls are lost
    if (balls.length === 0) {
        lives--;
        if (lives <= 0) {
            alert("Game Over! Score: " + score);
            gameRunning = false;
        } else {
            balls = [new Ball(canvas)]; // Reset with one ball
        }
    }

    const allDestroyed = bricks.checkCollision(balls[0], paddle); // Check with first ball
    if (allDestroyed) {
        level++;
        SoundManager.play('levelComplete');
        bricks = new Bricks(canvas, level);
        balls = [new Ball(canvas)]; // Reset to one ball
        paddle = new Paddle(canvas);
        lives += 1;
        alert("Congratulations! Level " + level);
    }

    requestAnimationFrame(draw);
}

// Increase score
function increaseScore(points) {
    score += points;
}

// Restart game
function restartGame() {
    paddle = new Paddle(canvas);
    balls = [new Ball(canvas)];
    level = 1;
    bricks = new Bricks(canvas, level);
    lives = 3;
    score = 0;
    gameRunning = true;
    paused = false;
    document.getElementById("pauseBtn").textContent = "Pause";
    draw();
}

// Button event listeners
document.getElementById("restartBtn").addEventListener("click", restartGame);
document.getElementById("pauseBtn").addEventListener("click", () => {
    paused = !paused;
    document.getElementById("pauseBtn").textContent = paused ? "Resume" : "Pause";
    if (!paused) draw();
});

// Start game
draw();