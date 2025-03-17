import { Fluid } from "./logic.js";

document.getElementById("slider_1").addEventListener("input", e => {
    document.getElementById("slider_1_out").innerHTML = e.target.value;
    // console.log(e.target.value);
})

document.getElementById("slider_2").addEventListener("input", e => {
    document.getElementById("slider_2_out").innerHTML = e.target.value;
    // console.log(e.target.value);
})

document.getElementById("slider_3").addEventListener("input", e => {
    document.getElementById("slider_3_out").innerHTML = e.target.value;
    // console.log(e.target.value);
})

document.getElementById("slider_4").addEventListener("input", e => {
    document.getElementById("slider_4_out").innerHTML = e.target.value;
    // console.log(e.target.value);
})

document.getElementById("button_1").addEventListener("click", e => {
    // console.log("button_1");
    /*     console.log("Advanced");
    
        for (let i = 0; i < 1; i++) {
            Fluid1.update(22);
        }
    
        Fluid1.draw(); */
    Fluid1.particles.forEach(p => {
        console.log(p.position);
    })
})

document.addEventListener("mousemove", (e) => {
    Fluid1.mousePos = [e.clientX, e.clientY];
})

window.addEventListener("pointerdown", e => {
    Fluid1.mousePressed = true;
})

window.addEventListener("pointerup", e => {
    Fluid1.mousePressed = false;
})

const fps = document.getElementById("fps");
let newFps = 0;
let accumulatedFps = [];

let previous;
let Fluid1 = new Fluid(2000); // 5000 particles	
Fluid1.draw();

function step(now) {
    if (!previous) { previous = now; };

    let delta = (now - previous) * 0.001; // seconds
    previous = now;

    if (newFps > 0.5) {
        const average = array => array.reduce((a, b) => a + b) / array.length;

        fps.innerHTML = "" + Math.floor(average(accumulatedFps)) + "fps";
        newFps = 0;
        accumulatedFps = [];
    }
    accumulatedFps.push(1 / delta);
    newFps += delta;

    const minDelta = 0.01;
    const maxDelta = 0.05;
    delta = Math.max(minDelta, delta);
    delta = Math.min(maxDelta, delta);

    if (delta == minDelta || delta == maxDelta) {
        console.log("delta was adjusted")
    }

    //console.log(delta)
    Fluid1.update(delta);
    Fluid1.draw();

    requestAnimationFrame(step);
}

requestAnimationFrame(step);