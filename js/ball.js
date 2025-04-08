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

    move(paddle, bricks) {
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

        // Bottom collision (paddle or miss)
        if (this.y + this.radius + this.dy > paddle.y && // Ball bottom edge hits paddle top
            this.y + this.radius < paddle.y + paddle.height && // Ensure ball isn’t past paddle
            this.x > paddle.x && this.x < paddle.x + paddle.width) {
            this.dy = -this.dy;
            effectsSystem.createBallHitEffect(this.x, this.y, '#0095DD');
            return "active";
        } else if (this.y + this.radius > this.canvas.height) { // Ball fully below canvas
            return "lost";
        }

        // Check brick collision
        bricks.checkCollision(this, paddle);
        return "active";
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 45;
        this.dx = 3;
        this.dy = -3;
    }
}