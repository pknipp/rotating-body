![Rotating body](public/screenshot.png)
# Contents

[Heroku deployment](https://rotating-body.herokuapp.com)

[Introduction](#introduction)

[Moments of inertia]

[Euler angles]

[Physics](#physics)

[3-dimendional rendering](#3-dimensional-rendering)

[Miscellaneous](#miscellaneous)

# Introduction

I used this [skeleton](https://github.com/mars/create-react-app-buildpack#user-content-quick-start) for my front-end project.

# Physics

The [rotation](https://en.wikipedia.org/wiki/Euler%27s_equations_(rigid_body_dynamics)) of a
[rigid body](https://en.wikipedia.org/wiki/Rigid_body) is more complicated than most people think.

# 3-dimensional rendering

coordinate system
Perspective, translateX, translateY, rotate3d(axis, angle)
6 sides of box, each w/mid translated and rotated and colored
3-d vectors and 3x3 rotation matrices
z- and x-rotation matrices, eigenvector of rotation matrix, dot product
4 linalg functions: dot, mult1, transpose, mult2

shapes
principal axes of rotation and degeneracies
moments of inertia
Euler angles
Perturbation analysis and stabilities
Angular-velocity vector: components, rendering, and magnitude
Kinetic energy
transitions

# Miscellaneous

time-step
