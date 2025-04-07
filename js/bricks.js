class Bricks {
    constructor(canvas, level) {
        this.rowCount = Math.min(3 + level, 5);
        this.columnCount = 7; // Reduced from 8 to fit 800px canvas
        this.width = 90;
        this.height = 25;
        this.padding = 15;
        this.offsetTop = 50;
        this.offsetLeft = 50; // Adjusted to center bricks
        this.bricks = [];

        // Calculate total width to ensure fit
        const totalWidth = this.columnCount * (this.width + this.padding) - this.padding;
        this.offsetLeft = (canvas.width - totalWidth) / 2; // Dynamically center bricks

        for (let c = 0; c < this.columnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.rowCount; r++) {
                const durability = getRandomInt(1, 3);
                this.bricks[c][r] = { x: 0, y: 0, status: durability, maxDurability: durability };
            }
        }
    }
    draw(ctx) {
        for (let c = 0; c < this.columnCount; c++) {
            for (let r = 0; r < this.rowCount; r++) {
                const b = this.bricks[c][r];
                if (b.status > 0) {
                    let brickX = c * (this.width + this.padding) + this.offsetLeft;
                    let brickY = r * (this.height + this.padding) + this.offsetTop;
                    b.x = brickX;
                    b.y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, this.width, this.height);
                    // Set color based on durability
                    ctx.fillStyle = b.status === 3 ? "#FF5555" : b.status === 2 ? "#FFAA55" : "#55AAFF";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    checkCollision(ball, paddle) { // ball parameter is now unused here
        let allDestroyed = true;
        for (let c = 0; c < this.columnCount; c++) {
            for (let r = 0; r < this.rowCount; r++) {
                let b = this.bricks[c][r];
                if (b.status > 0) {
                    allDestroyed = false;
                    // Check collision with each active ball
                    balls.forEach(ball => {
                        const ballLeft = ball.x - ball.radius;
                        const ballRight = ball.x + ball.radius;
                        const ballTop = ball.y - ball.radius;
                        const ballBottom = ball.y + ball.radius;
                        const brickLeft = b.x;
                        const brickRight = b.x + this.width;
                        const brickTop = b.y;
                        const brickBottom = b.y + this.height;

                        if (ballRight > brickLeft && 
                            ballLeft < brickRight && 
                            ballBottom > brickTop && 
                            ballTop < brickBottom) {
                            if (ballBottom > brickTop && ballTop < brickTop) {
                                ball.dy = -ball.dy;
                            } else if (ballRight > brickLeft && ballLeft < brickLeft) {
                                ball.dx = -ball.dx;
                            } else if (ballLeft < brickRight && ballRight > brickRight) {
                                ball.dx = -ball.dx;
                            } else if (ballTop < brickBottom && ballBottom > brickBottom) {
                                ball.dy = -ball.dy;
                            }
                            SoundManager.play('brickHit');
                            const brickColor = b.status === 3 ? "#FF5555" : b.status === 2 ? "#FFAA55" : "#55AAFF";
                            effectsSystem.createBrickParticles(b.x, b.y, this.width, this.height, brickColor);
                            const points = 10 * b.maxDurability;
                            effectsSystem.createScoreEffect(b.x + this.width/2, b.y, points);
                            b.status--;
                            if (b.status === 0) {
                                powerUpSystem.createPowerUp(b.x + this.width / 2, b.y + this.height, ball.canvas);
                            }
                            increaseScore(points);
                        }
                    });
                }
            }
        }
        return allDestroyed;
    }
}