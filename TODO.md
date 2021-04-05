PAK's recipe (after creating a local repo):
    first time:
        at heroku: create app
		from CLI: heroku git:remote -a APP-NAME
    every time thereafter (from CLI): git push heroku master

John's header code for the generation of meta tags:
  <meta charset="utf-8" />
  <meta property="og:title" content="goAlgo" />
  <meta property="og:image" content="./screen.png" />
  <meta property="og:description" content="A dynamic visualizer for sorting and pathfinding algorithms." />
  <meta property="og:url" content="https://jpa-goalgo.herokuapp.com/" />

TO DO:
DEF:
Put padding to right of buttons (and elsewhere?).
Have y&z point up and out, respectively.
Adjust colors, transparency, edges (solid or dashed)
Figure out what - if anything - gets broken if a moment equals zero
Make length of omfs less than those of axes, so that they both appear for axisymmetric case.

MAYBE:
Implement a lagrangian and/or hamiltonian version of this?
Implement a version which'll allow setting of initial omegas?
Consider doing this with quaternions.
Implement A/B switches for choices of y-direction and z-direction?
Implement A/B switch for toggling between body frame and lab frame?
Put this in physics-sims project?
Incorporate this technology into "Asteroid Field" sim?
Figure out a logical way to display omega in body frame?
Figure out what - if anything - gets broken if I1 = I2 + i3.
