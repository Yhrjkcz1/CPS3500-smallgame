// 工具函数文件，未来可添加通用方法
// 示例：随机颜色生成
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
// 播放音效
function playSound(src) {
    const audio = new Audio(src);
    audio.play().catch((e) => console.log("音效播放失败:", e));
}

// 生成随机整数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}