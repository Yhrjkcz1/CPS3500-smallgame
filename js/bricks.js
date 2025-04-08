class Bricks {
    constructor(canvas, level) {
        this.rowCount = Math.min(3 + level, 5); // Max 5 rows
        this.columnCount = 7; // Adjusted to fit canvas
        this.width = 90;
        this.height = 25;
        this.padding = 15;
        this.offsetTop = 50;
        this.bricks = [];

        // Calculate total width and center bricks
        const totalWidth = this.columnCount * (this.width + this.padding) - this.padding;
        this.offsetLeft = (canvas.width - totalWidth) / 2;

        // Randomly generate bricks with 60% spawn chance
        const spawnChance = 0.6; // Adjust this (0.0 to 1.0) for density
        for (let c = 0; c < this.columnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.rowCount; r++) {
                if (Math.random() < spawnChance) {
                    const durability = getRandomInt(1, 3);
                    this.bricks[c][r] = { x: 0, y: 0, status: durability, maxDurability: durability };
                } else {
                    this.bricks[c][r] = { x: 0, y: 0, status: 0, maxDurability: 0 }; // Empty spot
                }
            }
        }

        // Ensure at least one brick exists to avoid empty levels
        if (!this.hasBricks()) {
            const c = Math.floor(Math.random() * this.columnCount);
            const r = Math.floor(Math.random() * this.rowCount);
            const durability = getRandomInt(1, 3);
            this.bricks[c][r] = { x: 0, y: 0, status: durability, maxDurability: durability };
        }
    }

    // Helper to check if any bricks exist
    hasBricks() {
        for (let c = 0; c < this.columnCount; c++) {
            for (let r = 0; r < this.rowCount; r++) {
                if (this.bricks[c][r].status > 0) return true;
            }
        }
        return false;
    }

    draw(ctx) {
        for (let c = 0; c < this.columnCount; c++) {
            for (let r = 0; r < this.rowCount; r++) {
                const b = this.bricks[c][r];
                if (b.status > 0) { // Only draw if brick exists
                    let brickX = c * (this.width + this.padding) + this.offsetLeft;
                    let brickY = r * (this.height + this.padding) + this.offsetTop;
                    b.x = brickX;
                    b.y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, this.width, this.height);
                    ctx.fillStyle = b.status === 3 ? "#FF5555" : b.status === 2 ? "#FFAA55" : "#55AAFF";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    checkCollision(ball, paddle) {
        let allDestroyed = true;
        for (let c = 0; c < this.columnCount; c++) {
            for (let r = 0; r < this.rowCount; r++) {
                let b = this.bricks[c][r];
                if (b.status > 0) {
                    allDestroyed = false;
                    balls.forEach(ball => {
                        const ballLeft = ball.x - ball.radius;
                        const ballRight = ball.x + ball.radius;
                        const ballTop = ball.y - ball.radius;
                        const ballBottom = ball.y + ball.radius;
                        const brickLeft = b.x;
                        const brickRight = b.x + this.width;
                        const brickTop = b.y;
                        const brickBottom = b.y + this.height;

                        if (ballRight > brickLeft && ballLeft < brickRight && 
                            ballBottom > brickTop && ballTop < brickBottom) {
                            const leftPen = ballRight - brickLeft;
                            const rightPen = brickRight - ballLeft;
                            const topPen = ballBottom - brickTop;
                            const bottomPen = brickBottom - ballTop;
                            const minPen = Math.min(leftPen, rightPen, topPen, bottomPen);

                            if (minPen === leftPen) ball.dx = -Math.abs(ball.dx);
                            else if (minPen === rightPen) ball.dx = Math.abs(ball.dx);
                            else if (minPen === topPen) ball.dy = -Math.abs(ball.dy);
                            else if (minPen === bottomPen) ball.dy = Math.abs(ball.dy);

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