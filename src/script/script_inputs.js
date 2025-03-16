import { Fluid } from "./logic.js";

document.addEventListener("mousemove", (e) => {
})

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


let previous;
let Fluid1 = new Fluid();
Fluid1.draw();

function step(now) {
    if (!previous) { previous = now; };

    let delta = (now - previous) * 0.001; // seconds
    previous = now;

    delta = Math.max(0.01, delta);
    delta = Math.min(0.03, delta);

    if (delta == 0.01 || delta == 0.02){
        console.log("delta was adjusted")
    }
    Fluid1.update(delta);
    Fluid1.draw();

    requestAnimationFrame(step);
}

requestAnimationFrame(step);