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
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("得分: " + score, 8, 20);
    ctx.fillText("生命: " + lives, canvas.width - 80, 20);
    ctx.fillText("关卡: " + level, canvas.width / 2 - 30, 20);
}

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
        lives += 1;
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