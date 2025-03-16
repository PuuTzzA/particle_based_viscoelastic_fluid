const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

window.addEventListener("resize", e => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

class Particle {
    #position = [0, 0];
    #positionPrevious = [0, 0];
    #velocity = [0, 0];

    constructor(positionX, positionY, velocityX, velocityY) {
        this.#position = [positionX, positionY];
        this.#positionPrevious = [positionX, positionY];
        this.#velocity = [velocityX, velocityY];
    }

    get position() {
        return this.#position;
    }

    set position(newPosition) {
        this.#position = newPosition;
    }

    get positionPrevious() {
        return this.#positionPrevious;
    }

    set positionPrevious(newPosition) {
        this.#positionPrevious = newPosition;
    }

    get velocity() {
        return this.#velocity;
    }

    set velocity(newVelocity) {
        this.#velocity = newVelocity;
    }
}

class GraphicsSettings {
    constructor() {
        this.lineWidth = 0;
        this.lineColour = "rgba(255, 255, 255, 0)";
        this.particleSize = 3;
        this.minSpeed = 0;
        this.maxSpeed = 5000;
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

        return `hsla(${hue}, 100%, 50%, 1)`;
    }
}

export class Fluid {
    constructor() {
        this.particles = []
        this.gs = new GraphicsSettings();
        this.gravity = [0, 2000];
        this.influenceRadius = 40; // h
        this.restDensity = 2; // p0
        const n = 20000
        this.stiffness = 1 * n; // k
        this.nearStiffness = 0.5 * n; // kN

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        console.log(window.innerWidth, window.innerHeight)

        for (let i = 0; i < 200; i++) {
            this.particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, 0, 0));
        }
    }

    applyViscosity() {
    }

    adjustSprings() {
    }

    applySpringDisplacement() {
    }

    doubleDensityRelaxation(dt) {
        this.particles.forEach(particle => {
            let density = 0; // phi
            let densityNear = 0; // phiN

            let neighbours = [];

            this.particles.forEach(otherParticle => {
                if (otherParticle == particle) {
                    return;
                }

                const dx = otherParticle.position[0] - particle.position[0];
                const dy = otherParticle.position[1] - particle.position[1];
                const r = Math.sqrt(dx * dx + dy * dy);

                let q = r / this.influenceRadius;

                if (q < 1) {
                    neighbours.push(otherParticle);

                    q = 1 - q;
                    density += q * q
                    densityNear += q * q * q;
                }
            });

            const pressure = this.stiffness * (density - this.restDensity);
            const pressureNear = this.nearStiffness * densityNear;

            let deltaPosition = [0, 0];

            neighbours.forEach(neighbour => {
                const dx = neighbour.position[0] - particle.position[0];
                const dy = neighbour.position[1] - particle.position[1];
                const r = Math.sqrt(dx * dx + dy * dy);

                const q = r / this.influenceRadius;

                let unitvector = [neighbour.position[0] - particle.position[0], neighbour.position[1] - particle.position[1]];
                const norm = (Math.sqrt(unitvector[0] * unitvector[0] + unitvector[1] * unitvector[1]));
                if (norm == 0) {
                    unitvector = [0, 0];
                }
                else {
                    unitvector = [unitvector[0] / norm, unitvector[1] / norm];
                };

                const displacement = dt * dt * (pressure * (1 - q) + pressureNear * (1 - q) * (1 - q));

                neighbour.position[0] += (displacement * unitvector[0]) / 2;
                neighbour.position[1] += (displacement * unitvector[1]) / 2;

                deltaPosition[0] -= (displacement * unitvector[0]) / 2;
                deltaPosition[1] -= (displacement * unitvector[1]) / 2;
            });

            particle.position[0] += deltaPosition[0];
            particle.position[1] += deltaPosition[1];
        });
    }

    resolveCollisions() {
        this.particles.forEach(particle => {
            if (particle.position[0] < 0) {
                particle.position[0] = 0;
            }

            if (particle.position[0] > canvas.width) {
                particle.position[0] = canvas.width;
            }

            if (particle.position[1] < 0) {
                particle.position[1] = 0;
            }

            if (particle.position[1] > canvas.height) {
                particle.position[1] = canvas.height;
            }
        });

        let x = []
        this.particles.forEach(particle => {
            let dx = particle.position[0] - 0;
            let dy = particle.position[1] - canvas.height;


            if (Math.sqrt(dx * dx + dy * dy) < 0.01) {
                x.push(particle)
            }
        })
    }

    update(dt) {
        // apply gravity
        this.particles.forEach(particle => {
            particle.velocity[0] += dt * this.gravity[0];
            particle.velocity[1] += dt * this.gravity[1];

        });

        // modify velocities with pairwise viscosity impulses
        this.applyViscosity();

        this.particles.forEach(particle => {
            particle.positionPrevious = [...particle.position];

            particle.position[0] += dt * particle.velocity[0];
            particle.position[1] += dt * particle.velocity[1];
        });

        // add and remove springs, change rest lengths
        this.adjustSprings();

        // modify positions according to springs
        // double density relaxation and collisions
        this.applySpringDisplacement();
        this.doubleDensityRelaxation(dt);
        this.resolveCollisions();

        // calculate velocities
        this.particles.forEach(particle => {
            particle.velocity[0] = (particle.position[0] - particle.positionPrevious[0]) / dt;
            particle.velocity[1] = (particle.position[1] - particle.positionPrevious[1]) / dt;
        })
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = this.gs.getLineColour();
        ctx.lineWidth = this.gs.getLineWidth();

        this.particles.forEach(particle => {
            ctx.fillStyle = this.gs.getParticleColour(particle.velocity[0], particle.velocity[1]);

            ctx.beginPath();
            ctx.arc(particle.position[0], particle.position[1], this.gs.getParticleRadius(), 0, Math.PI * 2, true); // Outer circle
            ctx.stroke();
            ctx.fill();
        })
    }
}