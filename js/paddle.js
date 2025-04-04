class Paddle {
    constructor(canvas) {
        this.width = 75;
        this.height = 10;
        this.x = (canvas.width - this.width) / 2;
        this.y = canvas.height - this.height;
        this.speed = 7;
        this.canvas = canvas;

        // 鼠标控制
        this.canvas.addEventListener("mousemove", (e) => this.moveWithMouse(e));
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    // 鼠标控制挡板
    moveWithMouse(e) {
        const relativeX = e.clientX - this.canvas.offsetLeft;
        if (relativeX > 0 && relativeX < this.canvas.width) {
            this.x = relativeX - this.width / 2; // 挡板中心跟随鼠标
            if (this.x < 0) this.x = 0; // 限制左边界
            if (this.x > this.canvas.width - this.width) this.x = this.canvas.width - this.width; // 限制右边界
        }
    }

    // 道具效果：加长挡板
    extend() {
        this.width = 120; // 加长到120px
        setTimeout(() => {
            this.width = 75; // 10秒后恢复
        }, 10000);
    }
}