// Utility function file - includes common methods and sound management

// Sound management system
const SoundManager = {
    sounds: {
        brickHit: "sound/碰撞音效.mp3",
        gameOver: "sound/游戏失败音效.mp3",
        levelComplete: "sound/游戏胜利音效.mp3", // Fixed case to lowercase .mp3
        powerupCollect: "sound/叮.mp3",
    },
    audioCache: {},
    isAudioUnlocked: false, // Track audio unlock state
    
    preloadSounds() {
        for (const key in this.sounds) {
            const audio = new Audio(this.sounds[key]);
            audio.load();
            this.audioCache[key] = audio;
        }
        console.log("Sound preloading completed");

        // Unlock audio on first user interaction
        const unlockAudio = () => {
            if (!SoundManager.isAudioUnlocked) { // Explicitly use SoundManager
                const silentAudio = new Audio("sound/叮.mp3"); // Use a real audio file
                silentAudio.volume = 0;
                silentAudio.play().then(() => {
                    SoundManager.isAudioUnlocked = true;
                    console.log("Audio unlocked successfully");
                    // Test playback of a sound immediately after unlock
                    SoundManager.play('powerupCollect');
                }).catch(e => console.error("Silent audio playback failed:", e));
            }
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("keydown", unlockAudio); // Add keydown for keyboard users
        };
        document.addEventListener("click", unlockAudio);
        document.addEventListener("keydown", unlockAudio); // Support keyboard interaction (e.g., pressing "R" or "P")
    },
    
    play(soundName) {
        if (!this.isAudioUnlocked) {
            console.log(`Audio not unlocked yet, skipping ${soundName}`);
            return;
        }
        if (this.sounds[soundName]) {
            let audio = this.audioCache[soundName];
            if (!audio) {
                audio = new Audio(this.sounds[soundName]);
                this.audioCache[soundName] = audio;
            } else {
                audio.currentTime = 0;
            }
            audio.play().catch(e => console.error(`Sound ${soundName} playback failed:`, e));
        } else {
            console.warn(`Sound not found: ${soundName}`);
        }
    },
    
    playCustom(src) {
        if (!this.isAudioUnlocked) {
            console.log(`Audio not unlocked, skipping custom sound ${src}`);
            return;
        }
        const audio = new Audio(src);
        audio.play().catch(e => console.error(`Custom sound playback failed:`, e));
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

// Initialize sound system after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    SoundManager.preloadSounds();
});

// Effects system - handles in-game visual effects
class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    // Create brick break effect
    createBrickParticles(x, y, width, height, color, count = 20) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + width / 2,
                y: y + height / 2,
                size: Math.random() * 8 + 3,
                color: color,
                speedX: (Math.random() - 0.5) * 7,
                speedY: (Math.random() - 0.5) * 7,
                life: 60,
                opacity: 1
            });
        }
    }

    // Create ball hit effect
    createBallHitEffect(x, y, color = '#FFFFFF') {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                size: Math.random() * 5 + 2,
                color: color,
                speedX: Math.cos(i * Math.PI / 4) * 4,
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
            size: Math.random() * 6 + 3,
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
            speedY: -2,
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
                p.speedY += 0.15;
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
                ctx.font = '24px Arial';
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