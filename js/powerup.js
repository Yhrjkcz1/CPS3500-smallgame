// Power-up class to handle dropping items
class PowerUp {
    constructor(x, y, type, canvas) {
        this.x = x;
        this.y = y;
        this.type = type; // "split", "extend", etc.
        this.width = 30;
        this.height = 30;
        this.speedY = 2;
        this.canvas = canvas;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.type === "split" ? "#FF00FF" : "#00FF00"; // Magenta for split, green for extend
        ctx.fill();
        ctx.closePath();
    }

    move(paddle) {
        this.y += this.speedY;
        // Check collision with paddle
        if (this.y + this.height > paddle.y && 
            this.y < paddle.y + paddle.height && 
            this.x + this.width > paddle.x && 
            this.x < paddle.x + paddle.width) {
            return true; // Power-up collected
        }
        return this.y > this.canvas.height; // Power-up missed
    }

    applyEffect(ball, paddle, ballsArray) {
        switch (this.type) {
            case "split":
                const newBall = new Ball(this.canvas);
                newBall.x = ball.x;
                newBall.y = ball.y;
                newBall.dx = -ball.dx; // Opposite direction
                newBall.dy = ball.dy;
                ballsArray.push(newBall);
                break;
            case "extend":
                paddle.extend();
                break;
        }
    }
}

// Power-up manager
class PowerUpSystem {
    constructor() {
        this.powerUps = [];
    }

    createPowerUp(x, y, canvas) {
        if (Math.random() < 0.2) { // 20% drop chance
            const types = ["split", "extend"];
            const type = types[Math.floor(Math.random() * types.length)];
            this.powerUps.push(new PowerUp(x, y, type, canvas));
        }
    }

    update(paddle, ballsArray) {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            if (powerUp.move(paddle)) {
                if (this.powerUps[i].y <= this.powerUps[i].canvas.height) {
                    powerUp.applyEffect(ballsArray[0], paddle, ballsArray); // Apply to first ball
                }
                this.powerUps.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.powerUps.forEach(powerUp => powerUp.draw(ctx));
    }
}

const powerUpSystem = new PowerUpSystem();