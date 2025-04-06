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
        // 绘制小球主体
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
        
        // 绘制小球光晕效果
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 149, 221, 0.3)";
        ctx.stroke();
        ctx.closePath();
    }

    move(paddle, bricks, lives) {
        this.x += 0.8*this.dx;
        this.y += 0.8*this.dy;

        // 左右墙壁碰撞
        if (this.x + this.dx > this.canvas.width - this.radius || this.x + this.dx < this.radius) {
            this.dx = -this.dx;
            // 创建碰撞特效
            effectsSystem.createBallHitEffect(this.x, this.y);
        }

        // 上方墙壁碰撞
        if (this.y + this.dy < this.radius) {
            this.dy = -this.dy;
            // 创建碰撞特效
            effectsSystem.createBallHitEffect(this.x, this.y);
        }

        // 底部碰撞
        if (this.y + this.dy > this.canvas.height - this.radius) {
            if (this.x > paddle.x && this.x < paddle.x + paddle.width) {
                this.dy = -this.dy;
                // 创建碰撞特效
                effectsSystem.createBallHitEffect(this.x, this.y, '#0095DD');
            } else {
                lives--; // 掉落减命
                // 播放失败音效
                SoundManager.play('gameOver');
                if (lives <= 0) {
                    // 游戏结束
                    alert("Game Over!Score: " + score);
                    // 不再重新加载页面，只显示游戏结束信息
                    gameRunning = false; // 停止游戏循环
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
}