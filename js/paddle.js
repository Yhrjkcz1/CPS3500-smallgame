class Paddle {
    constructor(canvas) {
        this.width = 120; // Increased from 90
        this.height = 15; // Increased from 10
        this.x = (canvas.width - this.width) / 2;
        this.y = canvas.height - this.height - 10; // Added offset from bottom
        this.speed = 10; // Increased from 7
        this.canvas = canvas;

        // Mouse control for paddle
        this.canvas.addEventListener("mousemove", (e) => this.moveWithMouse(e));
    }

    draw(ctx) {
        // Draw paddle body
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
        
        // Add paddle trail effect
        if (Math.random() < 0.3) {
            effectsSystem.createPaddleTrail(this.x, this.y, this.width, this.height);
        }
        
        // Add paddle glow effect
        ctx.beginPath();
        ctx.rect(this.x - 3, this.y - 3, this.width + 6, this.height + 6); // Scaled glow
        ctx.strokeStyle = "rgba(0, 149, 221, 0.3)";
        ctx.stroke();
        ctx.closePath();
    }

    // Mouse control for paddle
    moveWithMouse(e) {
        const relativeX = e.clientX - this.canvas.offsetLeft;
        if (relativeX > 0 && relativeX < this.canvas.width) {
            this.x = relativeX - this.width / 2;
            if (this.x < 0) this.x = 0;
            if (this.x > this.canvas.width - this.width) this.x = this.canvas.width - this.width;
        }
    }

    // Power-up effect: Extend paddle
    extend() {
        this.width = 180; // Increased from 120
        setTimeout(() => {
            this.width = 120; // Reset to new default
        }, 10000);
    }
}