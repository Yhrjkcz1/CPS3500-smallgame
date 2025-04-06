const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 初始化游戏对象
let paddle = new Paddle(canvas);
let ball = new Ball(canvas);
let level = 1; // 当前关卡
let bricks = new Bricks(canvas, level);
let lives = 3; // 生命值
let score = 0; // 得分
let gameRunning = true;

// 绘制UI
function drawUI() {
    // 设置字体样式
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#0095DD";

    // 分数（🏆）
    ctx.fillText("🏆 Score: " + score, 10, 25);

    // 生命（❤️）
    ctx.fillText("❤️ Lives: " + lives, canvas.width - 120, 25);

    // 关卡（📶）
    ctx.fillText("📶 Level: " + level, canvas.width / 2 - 40, 25);


}

document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        gameRunning = !gameRunning;
        if (gameRunning) {
            draw(); // 如果恢复运行，就重新调用绘图循环
        }
    }
}
);




// 主绘制循环
function draw() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bricks.draw(ctx);
    paddle.draw(ctx);
    ball.draw(ctx);
    drawUI();

    lives = ball.move(paddle, bricks, lives); // 更新生命值
    const allDestroyed = bricks.checkCollision(ball, paddle);

    // 胜利条件
    if (allDestroyed) {
        level++;
        bricks = new Bricks(canvas, level); // 进入下一关
        ball.reset();
        paddle = new Paddle(canvas); // 重置挡板
        alert("恭喜！进入第" + level + "关");
    }

    requestAnimationFrame(draw);
}

// 增加得分
function increaseScore(points) {
    score += points;
}

// 启动游戏
draw();