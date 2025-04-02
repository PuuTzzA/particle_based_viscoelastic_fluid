# Particle Based Viscoelastic Fluid

Based on this paper: [Particle-based Viscoelastic Fluid Simulation](https://dl.acm.org/doi/abs/10.1145/1073368.1073400)

Explore it yourself: [sandbox](https://puutzza.github.io/particle_based_viscoelastic_fluid/)

## Parameters

* **Rest Density:** The density the fluid tries to hold
* **Stiffness:** Force with which particles try to reach the rest density
* **Near Stiffness:** Force with which near particles avoid touching
* **Linear Viscosity:** Linear viscosity factor, for high viscous fluids
* **Quadratic Viscosity:** Quadratic viscosity factor
* **Spring Stiffness:** Force with which springs try to reach rest length
* **Plasticity:** How easy springs adjust their rest lengths: 0 = elastic, max = plastic
* **Gravity:** Gravitational acceleration
