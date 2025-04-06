// Utility function file - includes common methods and sound management

// Sound management system
const SoundManager = {
    sounds: {
        brickHit: "sound/碰撞音效.mp3",
        gameOver: "sound/游戏失败音效.mp3",
        levelComplete: "sound/游戏胜利音效.MP3",
    },
    audioCache: {},
    
    // Preload all sound effects
    preloadSounds() {
        for (const key in this.sounds) {
            const audio = new Audio(this.sounds[key]);
            audio.load();
            this.audioCache[key] = audio;
        }
        console.log("Sound preloading completed");
        
        document.addEventListener('click', () => {
            console.log("User interaction triggered, audio can now play");
            const silentAudio = new Audio();
            silentAudio.volume = 0;
            silentAudio.play().catch(e => console.log("Silent audio playback failed:", e));
        }, { once: true });
    },
    
    // Play specified sound effect
    play(soundName) {
        if (this.sounds[soundName]) {
            let audio = this.audioCache[soundName];
            if (!audio) {
                audio = new Audio(this.sounds[soundName]);
                this.audioCache[soundName] = audio;
            } else {
                audio.currentTime = 0;
            }
            audio.play().catch((e) => {
                console.log(`Sound ${soundName} playback failed:`, e);
                const newAudio = new Audio(this.sounds[soundName]);
                newAudio.play().catch(e => console.log(`Retry ${soundName} failed:`, e));
            });
        } else {
            console.warn(`Sound not found: ${soundName}`);
        }
    },
    
    // Play custom sound effect path
    playCustom(src) {
        const audio = new Audio(src);
        audio.play().catch((e) => console.log(`Sound playback failed:`, e));
    }
};

// Random color generation
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Backward-compatible sound effect playback function
function playSound(src) {
    SoundManager.playCustom(src);
}

// Generate random integer
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize sound system
SoundManager.preloadSounds();

// Effects system - handles in-game visual effects
class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    // Create brick break effect
    createBrickParticles(x, y, width, height, color, count = 20) { // Increased count
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + width / 2,
                y: y + height / 2,
                size: Math.random() * 8 + 3, // Increased from 5+2
                color: color,
                speedX: (Math.random() - 0.5) * 7, // Increased speed
                speedY: (Math.random() - 0.5) * 7,
                life: 60,
                opacity: 1
            });
        }
    }

    // Create ball hit effect
    createBallHitEffect(x, y, color = '#FFFFFF') {
        for (let i = 0; i < 10; i++) { // Increased from 8
            this.particles.push({
                x: x,
                y: y,
                size: Math.random() * 5 + 2, // Increased from 3+1
                color: color,
                speedX: Math.cos(i * Math.PI / 4) * 4, // Increased speed
                speedY: Math.sin(i * Math.PI / 4) * 4,
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
            size: Math.random() * 6 + 3, // Increased from 4+2
            color: '#0095DD',
            speedX: 0,
            speedY: 0,
            life: 15,
            opacity: 0.7
        });
    }

    // Create score icon effect
    createScoreEffect(x, y, points) {
        this.particles.push({
            x: x,
            y: y,
            text: '+' + points,
            color: '#FFDD00',
            speedY: -2, // Increased from -1.5
            life: 50,
            opacity: 1,
            isText: true
        });
    }

    // Update all particles
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            if (!p.isText) {
                p.x += p.speedX;
                p.y += p.speedY;
                p.speedY += 0.15; // Slightly increased gravity
            } else {
                p.y += p.speedY;
            }
            p.life--;
            p.opacity = p.life / 60;
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
                ctx.font = '24px Arial'; // Increased from 16px
                ctx.fillStyle = p.color;
                ctx.fillText(p.text, p.x, p.y);
            } else {
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

const effectsSystem = new ParticleSystem();