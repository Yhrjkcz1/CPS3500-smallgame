class Ball {
    constructor(canvas) {
        this.radius = 15;
        this.x = canvas.width / 2;
        this.y = canvas.height - 45;
        this.dx = 3;
        this.dy = -3;
        this.canvas = canvas;
    }

    draw(ctx) {
        // Draw ball body
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
        
        // Draw ball glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 149, 221, 0.3)";
        ctx.stroke();
        ctx.closePath();
    }

    move(paddle, bricks) { // Remove lives parameter
        this.x += 0.8 * this.dx;
        this.y += 0.8 * this.dy;

        // Left and right wall collision
        if (this.x + this.dx > this.canvas.width - this.radius || this.x + this.dx < this.radius) {
            this.dx = -this.dx;
            effectsSystem.createBallHitEffect(this.x, this.y);
        }

        // Top wall collision
        if (this.y + this.dy < this.radius) {
            this.dy = -this.dy;
            effectsSystem.createBallHitEffect(this.x, this.y);
        }

        // Bottom collision
        if (this.y + this.dy > this.canvas.height - this.radius) {
            if (this.x > paddle.x && this.x < paddle.x + paddle.width && 
                this.y <= paddle.y + paddle.height) {
                this.dy = -this.dy;
                effectsSystem.createBallHitEffect(this.x, this.y, '#0095DD');
                return "active"; // Ball is still in play
            } else {
                SoundManager.play('gameOver');
                return "lost"; // Ball is out of play
            }
        }

        // Check brick collision
        bricks.checkCollision(this, paddle);
        return "active"; // Ball is still in play
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 45;
        this.dx = 3;
        this.dy = -3;
    }
}