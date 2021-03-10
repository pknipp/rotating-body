git push heroku master

TO DO:
render inputs in following order:
    L ( = [0, 0, Lz])
    moments of inertia (preceded by a dropdown w/"isotropic", "axisymmetric", and "asymmetric")
    Euler angles (precedece by dropdown for (along symmetry axis, near one of the principal axes)
Render lines which represent (fixed-frame) omega and principal axes (but not if degenerate).
Implement a lagrangian and/or hamiltonian version of this?
Implement a version which'll allow setting of initial omegas?
Tabulate things better.
Consider doing this with quaternions.
Insert meta-tags.
Put this in physics-sims project?
Incorporate this technology into "Asteroid Field" sim?
Insert slider for perspective (and size of screen?) and time-step and angular momentum (or z-component thereof?)
Adjust colors, transparency, edges (solid or dashed)
Insert info fields.
Correlate timestep with sizes of moments and of Lz.
Figure out what - if anything - gets broken if a moment equals zero or if I1 = I2 + i3.
