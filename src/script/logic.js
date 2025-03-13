const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

let y = 0;

function updateCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.fillStyle = "red";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(75, y, 50, 0, Math.PI * 2, true); // Outer circle
    ctx.stroke();
    ctx.fill();
}

updateCanvas();

window.addEventListener("resize", e => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    updateCanvas();
})


let start;

function step(timestamp) {
    if (start === undefined) {
        start = timestamp;
    }
    const elapsed = timestamp - start;
    
    y += 10;
    if (y > canvas.height) {
        y = 0;
    }
    updateCanvas();

    requestAnimationFrame(step);
}

requestAnimationFrame(step);