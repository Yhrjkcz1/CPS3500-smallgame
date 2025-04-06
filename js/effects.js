// 特效系统 - 处理游戏中的视觉效果

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    // 创建砖块破碎效果
    createBrickParticles(x, y, width, height, color, count = 15) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + width / 2,
                y: y + height / 2,
                size: Math.random() * 5 + 2,
                color: color,
                speedX: (Math.random() - 0.5) * 5,
                speedY: (Math.random() - 0.5) * 5,
                life: 60, // 粒子生命周期（帧数）
                opacity: 1
            });
        }
    }

    // 创建小球撞击效果
    createBallHitEffect(x, y, color = '#FFFFFF') {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                size: Math.random() * 3 + 1,
                color: color,
                speedX: Math.cos(i * Math.PI / 4) * 3,
                speedY: Math.sin(i * Math.PI / 4) * 3,
                life: 20,
                opacity: 1
            });
        }
    }

    // 创建挡板拖尾效果
    createPaddleTrail(x, y, width, height) {
        this.particles.push({
            x: x + Math.random() * width,
            y: y,
            size: Math.random() * 4 + 2,
            color: '#0095DD',
            speedX: 0,
            speedY: 0,
            life: 15,
            opacity: 0.7
        });
    }

    // 创建得分图标效果
    createScoreEffect(x, y, points) {
        this.particles.push({
            x: x,
            y: y,
            text: '+' + points,
            color: '#FFDD00',
            speedY: -1.5,
            life: 50,
            opacity: 1,
            isText: true
        });
    }

    // 更新所有粒子
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // 更新位置
            if (!p.isText) {
                p.x += p.speedX;
                p.y += p.speedY;
                p.speedY += 0.1; // 重力效果
            } else {
                p.y += p.speedY;
            }
            
            // 更新生命周期
            p.life--;
            p.opacity = p.life / 60;
            
            // 移除死亡粒子
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    // 绘制所有粒子
    draw(ctx) {
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            
            if (p.isText) {
                // 绘制文本粒子（得分）
                ctx.font = '16px Arial';
                ctx.fillStyle = p.color;
                ctx.fillText(p.text, p.x, p.y);
            } else {
                // 绘制普通粒子
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.closePath();
            }
            
            ctx.restore();
        }
    }
}

// 导出特效系统实例
const effectsSystem = new ParticleSystem();