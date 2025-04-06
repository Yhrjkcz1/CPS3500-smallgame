class Bricks {
    constructor(canvas, level) {
        this.rowCount = Math.min(2 + level,5);     // 关卡越高，行数越多
        this.columnCount = 5;
        this.width = 75;
        this.height = 20;
        this.padding = 20;
        this.offsetTop = 30;
        this.offsetLeft = 15;
        this.bricks = [];

        // 生成随机颜色的砖块矩阵
        for (let c = 0; c < this.columnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.rowCount; r++) {
                // 每个砖块独立生成随机颜色值（1-3）
                const color = getRandomInt(1, 3);
                this.bricks[c][r] = { 
                    x: 0, y: 0,
                    status: color,     // 当前颜色
                };
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
                    // 设置颜色值
                    ctx.fillStyle = b.status === 3 ? "#FF5555" : //红色
                                   b.status === 2 ? "#FFAA55" : //橙色
                                   "#55AAFF"; //蓝色
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
    
                    // 正确的 AABB 检测（考虑小球半径）
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
    
                        // 碰撞响应（根据碰撞面调整反弹方向）
                        if (ballBottom > brickTop && ballTop < brickTop) {
                            ball.dy = -ball.dy; // 顶部碰撞（常见情况）
                        } else if (ballRight > brickLeft && ballLeft < brickLeft) {
                            ball.dx = -ball.dx; // 左侧碰撞
                        } else if (ballLeft < brickRight && ballRight > brickRight) {
                            ball.dx = -ball.dx; // 右侧碰撞
                        } else if (ballTop < brickBottom && ballBottom > brickBottom) {
                            ball.dy = -ball.dy; // 底部碰撞
                        }
                        
                        increaseScore(10 * b.status);
                        b.status=0;
                    }
                }
            }
        }
        return allDestroyed;
    }
    
}