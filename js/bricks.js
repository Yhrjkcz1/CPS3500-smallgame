class Bricks {
    constructor(canvas, level) {
        this.rowCount = 3 + level; // 关卡越高，行数越多
        this.columnCount = 5;
        this.width = 75;
        this.height = 20;
        this.padding = 10;
        this.offsetTop = 30;
        this.offsetLeft = 30;
        this.bricks = [];

        for (let c = 0; c < this.columnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.rowCount; r++) {
                const durability = getRandomInt(1, 3); // 耐久度1-3
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
                    // 根据耐久度设置颜色
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
                    if (ball.x > b.x && ball.x < b.x + this.width && 
                        ball.y > b.y && ball.y < b.y + this.height) {
                        ball.dy = -ball.dy;
                        b.status--;
                        playSound("assets/sounds/brick-hit.mp3"); // 砖块碰撞音效
                        increaseScore(10 * b.maxDurability); // 耐久度越高得分越高

                        // 随机掉落道具（10%概率）
                        if (Math.random() < 0.1) {
                            this.dropPowerUp(b.x, b.y, paddle, ball);
                        }
                    }
                }
            }
        }
        return allDestroyed; // 返回是否所有砖块被摧毁
    }

    dropPowerUp(x, y, paddle, ball) {
        const type = getRandomInt(1, 2); // 1: 加长挡板, 2: 加速小球
        if (type === 1) {
            paddle.extend();
        } else {
            ball.speedUp();
        }
    }
}