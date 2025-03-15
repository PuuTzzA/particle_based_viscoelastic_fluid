const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

window.addEventListener("resize", e => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

class Particle {
    constructor(positionX, positionY, velocityX, velocityY) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    get posX() {
        console.log("hllt")
        return this.positionX;
    }

    get posYy() {
        return this.positionY;
    }

    get velX() {
        return this.velocityX;
    }

    get velY() {
        return this.velocityY;
    }
}

class GraphicsSettings {
    constructor() {
        this.lineWidth = 5;
        this.lineColour = "rgb(100, 100, 100)";
        this.particleSize = 10;
        this.minSpeed = 0;
        this.maxSpeed = 30;
        this.velocityRange = [170, 0]; // "colorramp" [hue_for_min_speed, hue_for_max_speed]
    }

    getLineWidth() {
        return this.lineWidth;
    }

    getLineColour() {
        return this.lineColour;
    }

    getParticleRadius() {
        return this.particleSize;
    }

    getParticleColour(velocityX, velocityY) {
        let magnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        magnitude = Math.min(this.maxSpeed, Math.max(this.minSpeed, magnitude));

        let hue = this.velocityRange[0] + (this.velocityRange[1] - this.velocityRange[0]) * (magnitude - this.minSpeed) / (this.maxSpeed - this.minSpeed);

        return `hsl(${hue}, 100%, 50%)`;
    }
}

class Fluid {
    constructor() {
        this.particles = []
        this.gs = new GraphicsSettings();

        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 20, Math.random() * 20));
        }
    }

    update() {
        this.particles.forEach(particle => {
            particle.positionX += particle.velocityX;
            particle.positionY += particle.velocityY;

            if (particle.positionX > canvas.width) {
                particle.positionX = 0;
            }

            if (particle.positionY > canvas.height) {
                particle.positionY = 0;
            }
        })
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = this.gs.getLineColour();
        ctx.lineWidth = this.gs.getLineWidth();

        this.particles.forEach(particle => {
            ctx.fillStyle = this.gs.getParticleColour(particle.velocityX, particle.velocityY);

            ctx.beginPath();
            ctx.arc(particle.positionX, particle.positionY, this.gs.getParticleRadius(), 0, Math.PI * 2, true); // Outer circle
            ctx.stroke();
            ctx.fill();
        })
    }
}

let previous;
let Fluid1 = new Fluid();

function step(now) {
    if (!previous) { previous = now; };

    const delta = now - previous; // milliseconds
    previous = now;

    Fluid1.update();
    Fluid1.draw();

    requestAnimationFrame(step);
}

requestAnimationFrame(step);