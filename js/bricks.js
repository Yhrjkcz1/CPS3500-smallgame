class Bricks {
    constructor(canvas, level) {
        this.rowCount = Math.min(3 + level, 5); // 关卡越高，行数越多，但最多5行
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
                    
                    // 使用V2版本的AABB碰撞检测（考虑小球半径）
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
                        
                        // 播放砖块碰撞音效
                        SoundManager.play('brickHit');
                        
                        // 创建砖块碰撞特效
                        const brickColor = b.status === 3 ? "#FF5555" : b.status === 2 ? "#FFAA55" : "#55AAFF";
                        effectsSystem.createBrickParticles(b.x, b.y, this.width, this.height, brickColor);
                        
                        // 创建得分特效
                        const points = 10 * b.maxDurability;
                        effectsSystem.createScoreEffect(b.x + this.width/2, b.y, points);
                        
                        b.status--;
                        increaseScore(points); // 耐久度越高得分越高
                    }
                }
            }
        }
        return allDestroyed; // 返回是否所有砖块被摧毁
    }
}