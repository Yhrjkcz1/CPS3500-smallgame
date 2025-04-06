// 工具函数文件 - 包含通用方法和音效管理

// 音效管理系统
const SoundManager = {
    sounds: {
        brickHit: "sound/鸡你太美.mp3",
        gameOver: "sound/你干嘛.....哎呦.mp3",
        levelComplete: "sound/成功音效.MP3",
    },
    
    // 缓存已加载的音频对象
    audioCache: {},
    
    // 预加载所有音效
    preloadSounds() {
        for (const key in this.sounds) {
            const audio = new Audio(this.sounds[key]);
            audio.load();
            this.audioCache[key] = audio;
        }
        console.log("音效预加载完成");
        
        // 添加用户交互事件监听器，解决自动播放限制问题
        document.addEventListener('click', () => {
            console.log("用户交互已触发，音频现在可以播放");
            // 播放一个静音的音频来激活音频上下文
            const silentAudio = new Audio();
            silentAudio.volume = 0;
            silentAudio.play().catch(e => console.log("静音音频播放失败:", e));
        }, { once: true });
    },
    
    // 播放指定音效
    play(soundName) {
        if (this.sounds[soundName]) {
            // 使用缓存的音频对象或创建新的
            let audio = this.audioCache[soundName];
            if (!audio) {
                audio = new Audio(this.sounds[soundName]);
                this.audioCache[soundName] = audio;
            } else {
                // 重置音频以便重新播放
                audio.currentTime = 0;
            }
            
            audio.play().catch((e) => {
                console.log(`音效 ${soundName} 播放失败:`, e);
                // 如果播放失败，尝试创建新的音频对象
                const newAudio = new Audio(this.sounds[soundName]);
                newAudio.play().catch(e => console.log(`重试播放 ${soundName} 失败:`, e));
            });
        } else {
            console.warn(`未找到音效: ${soundName}`);
        }
    },
    
    // 播放自定义音效路径
    playCustom(src) {
        const audio = new Audio(src);
        audio.play().catch((e) => console.log(`音效播放失败:`, e));
    }
};

// 随机颜色生成
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// 向下兼容的播放音效函数
function playSound(src) {
    SoundManager.playCustom(src);
}

// 生成随机整数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 初始化音效系统
SoundManager.preloadSounds();