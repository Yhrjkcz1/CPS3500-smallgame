// Effects System - Handles visual effects in the game

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    // Create brick shatter effect
    createBrickParticles(x, y, width, height, color, count = 15) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + width / 2,
                y: y + height / 2,
                size: Math.random() * 5 + 2,
                color: color,
                speedX: (Math.random() - 0.5) * 5,
                speedY: (Math.random() - 0.5) * 5,
                life: 60, // Particle lifespan (in frames)
                opacity: 1
            });
        }
    }

    // Create ball hit effect
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

    // Create paddle trail effect
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

    // Create score popup effect
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

    // Update all particles
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position
            if (!p.isText) {
                p.x += p.speedX;
                p.y += p.speedY;
                p.speedY += 0.1; // Gravity effect
            } else {
                p.y += p.speedY;
            }
            
            // Update lifespan
            p.life--;
            p.opacity = p.life / 60;
            
            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    // Draw all particles
    draw(ctx) {
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            
            if (p.isText) {
                // Draw text particle (score)
                ctx.font = '16px Arial';
                ctx.fillStyle = p.color;
                ctx.fillText(p.text, p.x, p.y);
            } else {
                // Draw regular particle
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

// Export effects system instance
const effectsSystem = new ParticleSystem();
