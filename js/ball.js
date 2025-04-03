class Ball {
    constructor(canvas) {
        this.radius = 10;
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.dx = 2;
        this.dy = -2;
        this.canvas = canvas;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    move(paddle, bricks, lives) {
        this.x += this.dx;
        this.y += this.dy;

        // 左右墙壁碰撞
        if (this.x + this.dx > this.canvas.width - this.radius || this.x + this.dx < this.radius) {
            this.dx = -this.dx;
        }

        // 上方墙壁碰撞
        if (this.y + this.dy < this.radius) {
            this.dy = -this.dy;
        }

        // 底部碰撞
        if (this.y + this.dy > this.canvas.height - this.radius) {
            if (this.x > paddle.x && this.x < paddle.x + paddle.width) {
                this.dy = -this.dy;
                playSound("assets/sounds/paddle-hit.mp3"); // 挡板碰撞音效
            } else {
                lives--; // 掉落减命
                if (lives <= 0) {
                    playSound("assets/sounds/game-over.mp3"); // 游戏结束音效
                    alert("游戏结束！得分: " + score);
                    document.location.reload();
                } else {
                    this.reset(); // 重置小球位置
                }
            }
        }

        // 检查砖块碰撞
        bricks.checkCollision(this, paddle);
        return lives; // 返回更新后的生命值
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 30;
        this.dx = 2;
        this.dy = -2;
    }

    // 道具效果：加速小球
    speedUp() {
        this.dx *= 1.5; // 加速50%
        this.dy *= 1.5;
        setTimeout(() => {
            this.dx /= 1.5; // 10秒后恢复
            this.dy /= 1.5;
        }, 10000);
    }
}