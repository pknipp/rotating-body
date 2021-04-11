![Rotating body](public/screenshot.png)
# Contents

[Heroku deployment](https://rotating-body.herokuapp.com)

[Physics](#physics)

[Linear algebra](#linear-algebra)

[3-d rendering](#3-d-rendering)

[Miscellaneous](#miscellaneous)

I used this [skeleton](https://github.com/mars/create-react-app-buildpack#user-content-quick-start) for my front-end project, which uses JavaScript for the calculations and ReactJS (with functional components and hooks) to render the results.

# Physics

[return to "Contents"](#contents)

[go to next section ("Linear algebra")](#linear-algebra)

Just as the position of an object is specified by the values of three numbers (the *x*-, *y*-, and *z*- coordinates of the [center of mass](https://en.wikipedia.org/wiki/Center_of_mass)), the angular orientation of a [rigid body](https://en.wikipedia.org/wiki/Rigid_body) is specified by three numbers: the [Euler angles](https://en.wikipedia.org/wiki/Euler_angles), commonly designated by the Greek letters &phi;, &theta;, and &psi;.  In the absence of any [forces](https://en.wikipedia.org/wiki/Force), the [translational motion](https://en.wikipedia.org/wiki/Translation_(geometry)) of an object is quite simple: the values of *x*, *y*, and *z* each change at a constant rates.  These (independent) rates are the Cartesian components of the object's [velocity](https://en.wikipedia.org/wiki/Velocity).  In a similar manner the [rotation](https://en.wikipedia.org/wiki/Rotation) of a rigid body involves the rates of change of the Euler angles.  Unlike for translational motion, however, these rates of change are not constant, even when there is no [torque](https://en.wikipedia.org/wiki/Torque).  [Rigid-body rotation](https://en.wikipedia.org/wiki/Rigid_body_dynamics) is much more complicated than [rotation about a fixed axis](https://en.wikipedia.org/wiki/Rotation_around_a_fixed_axis), examples of the latter being the motion of a globe or of a hinged door.

Of fundamental importance in rotations is the [inertia matrix](https://en.wikipedia.org/wiki/Moment_of_inertia#Motion_in_space_of_a_rigid_body,_and_the_inertia_matrix).  This 3 x 3 matrix is usually expressed in terms of three quantities: the [moment of inertia](https://en.wikipedia.org/wiki/Moment_of_inertia) for rotation about each of the body's three [principal axes](https://en.wikipedia.org/wiki/Moment_of_inertia#Principal_axes).  The three principal axes are mutually perpendicular and - for symmetric objects - point along the object's axes of symmetry.
In my app the object is a [rectangular cuboid](https://en.wikipedia.org/wiki/Parallelepiped), an example of such a symmetric structure.  For these shapes the moment of inertia equal [*m*(*a*<sup>2</sup> + *b*<sup>2</sup>)/12](https://en.wikipedia.org/wiki/List_of_moments_of_inertia#List_of_3D_inertia_tensors), in which *m* is the mass, and *a* and *b* are the dimensions of the cuboid face which is perpendicular to the particular axis.  However in my app the user specifies the moments of inertia, not the face sizes, so I need to invert that formula in order to obtain cuboid dimensions <tt>d</tt> which I can use for rendering the cuboid.  To invert the formulas I set *m*/12 = 1 (to simplify the arithmetic) and arrive at the result that the length of any cuboid axis equals the square root of the difference between half the sum of the (three) moments of inertia minus the moment for rotation about that particular axis. Below are the lines of code from my <tt>calcD</tt> helper function in the <tt>App</tt> component.
```
let sumMom = moms[0] + moms[1] + moms[2];
let newD = moms.map(mom => Math.max(0.000001, Math.sqrt((sumMom / 2 - mom))));
```
Because singularities occur if any cuboid dimension equals zero (as would be the case for a flat shape cut from sheet metal of infinitessimal thickness), I manually prevent this thru the use of <tt>Math.max</tt>.  Note that one physical constraint which must be satisfied by the moments of inertia is that no single moment of inertia may exceed the sum of the other two.  The line of code below (from the input handler <tt>handlerMom</tt>) makes - and sets in state - a determination of whether or not that constraint has been violated for the moments of inertia <tt>moms</tt>
```
setAreLegalMoms(newMoms.reduce((legal, mom, i, moms) => (legal && mom <= (moms[(i+1)%3] + moms[(i+2)%3])), true));
```
If such a violation occurs, the user is warned accordingly:
```
{areLegalMoms ? null :
    <div className="message">
        No single moment of inertia should  exceed the sum of the other two.
    </div>
}
```

The [formula](https://ocw.mit.edu/courses/aeronautics-and-astronautics/16-07-dynamics-fall-2009/lecture-notes/MIT16_07F09_Lec29.pdf) (found on p. 7 of the linked reference) for the rate of change of the Euler angles is a nonlinear function of the angles themselves.  The code for this function is below, in which <tt>ths</tt> is the three-component array with the instantaneous values of the radian measure of the Euler angles, <tt>moms</tt> is the three-component array of the moments of inertia, and <tt>Lz</tt> is the *z*-component of the [angular momentum](https://en.wikipedia.org/wiki/Angular_momentum#Solid_bodies).  (The other two components of the angular momentum are zero.)
```
const Fs = ths => {
    let cs = [];
    let ss = [];
    for (const th of ths) {
        cs.push(Math.cos(th));
        ss.push(Math.sin(th));
    };
    let Fs = []
    Fs[0] = Lz * (cs[2] * cs[2] / moms[1] + ss[2] * ss[2] / moms[0]);
    Fs[1] = Lz * (1 / moms[0] - 1 / moms[1]) * ss[1] * ss[2] * cs[2];
    Fs[2] = Lz * (1 / moms[2] - cs[2] * cs[2] / moms[1] - ss[2] * ss[2] / moms[0]) * cs[1];
    // many unrelated lines removed for the sake of brevity
    return Fs;
}
```
This constitutes a system of three nonlinear first-order differential equations,
which I solve using a [4th-order Runge-Kutta method](https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods#Derivation_of_the_Runge%E2%80%93Kutta_fourth-order_method).
```
useEffect(() => {
    if (!running) return;
    let Fs1 = Fs(ths);
    let Fs2 = nextFs(Fs1, 2);
    let Fs3 = nextFs(Fs2, 2);
    let Fs4 = nextFs(Fs3, 1);
    setThs([...ths].map((th, i) => th + (Fs1[i] + Fs4[i] + 2 * (Fs2[i] + Fs3[i])) * dt/ 1000 / 6));
}, [time, running]);
```
Because this method is 4th-order, the algorithm's time complexity is proportional to the inverse of the fourth root of the simulation's desired accuracy for <tt>ths</tt>.  Put differently, the accuracy of its calculation of <tt>ths</tt> is proportional to the fourth power of the user-specified timestep <tt>dt</tt>.

# Linear algebra

[return to "Contents"](#contents)

[return to previous section ("Physics")](#physics)

[go to next section ("Rendering")](#3-d-rendering)

The instantaneous value of the cuboid's rotation is characterized by a 3 x 3 "total" [rotation matrix](https://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations), which itself is the product of three simpler rotation matrices], each parametrized by one of the three Euler angles.  Below are the simpler rotation matrices, first for rotation about the *z*-axis (used twice) and second for rotation about the *x*-axis (used once).:
```
const zRot = th => {
    let [c, s] = [Math.cos(th), Math.sin(th)];
    return [[c, s, 0], [-s, c, 0], [0, 0, 1]];
}
const xRot = th => {
    let [c, s] = [Math.cos(th), Math.sin(th)];
    return [[1, 0, 0], [0, c, s], [0, -s, c]];
}
```
For subsequent steps are needed four helper functions for operations of linear algebra: scalar multiplication (also known as "dot product") of two vectors, multiplication of one matrix and one vector, transposition of a matrix, and multiplication of two matrices.  Below are my codes for these, each accomplished with one or two list comprehensions.
```
const dotproduct = (vec1, vec2) => vec1.reduce((dot, comp, i) => dot + comp * vec2[i], 0);
const mult1 = (mat, vec) => mat.map(row => dotproduct(row, vec));
const transpose = mat => mat[0].map((blah, i) => mat.map(row => row[i]));
const mult2 = (mat1, mat2) => mat1.map(x => transpose(mat2).map(y => dotproduct(x, y)));
```
Below is the calculation of the total rotation matrix, which I will henceforth simply call the "rotation matrix" and symbolize by <tt>mat</tt>.
```
const invRot=ths=> mult2(mult2(zRot(-ths[0]),xRot(-ths[1])), zRot(-ths[2]));
```
Any rotation matrix such as <tt>mat</tt> may be characterized by two things: an axis (of rotation) and an angle, and I must obtain these two things to render the rotated cuboid using the css function <tt>rotate3d()</tt>.  The absolute value of the angle can be obtained easily from the trace of <tt>mat</tt>, as seen in the following lines from the helper function <tt>rotate</tt>.
```
let trace = mat[0][0] + mat[1][1] + mat[2][2];
let angle = Math.acos((trace - 1) / 2);
```
It is less straightforward to calculate the rotation axis, which is any non-null vector that is parallel to the eigenvector of <tt>mat</tt> whose eigenvalue equals 1.  To find this eigenvector I use the <tt>ml-matrix</tt> package.
```
import { EigenvalueDecomposition, Matrix } from "ml-matrix";
```
The following line is another from the helper function <tt>rotate</tt>.
```
let vectors = new EigenvalueDecomposition(new Matrix(mat)).eigenvectorMatrix.transpose().data;
```
The <tt>vectors</tt> array contains the three eigenvectors of <tt>mat</tt>, but I only need the eigenvector whose eigenvalue equals 1, ie the vector <tt>vec</tt> with the property that <tt>mat&middot;vec</tt> = <tt>vec</tt>.  This is accomplished by the following lines in <tt>rotate</tt>.
```
let dVectors = vectors.map(vector => mult1(mat, vector).map((comp, i) => comp - vector[i]));
let mags = dVectors.map(dVector => dVector.reduce((mag, comp) => mag + comp * comp, 0));
let min = mags.reduce((min, mag, i) => mag < min[1] ? [i, mag] : min, [-1, Infinity]);
let axisVec = vectors[min[0]];
```
Recall that the earlier formula used for the rotation <tt>angle</tt> only provides its absolute value.  In order to determine whether to multiply its absolute value by -1 I need to (1) define a vector (<tt>Vec</tt>) which is perpendicular to the rotation axis, (2) rotate that vector by multiplying it by the rotation matrix <tt>mat</tt>, (3) evaluate the cross-product of those two vectors, which'll then point either parallel to or antiparallel to the rotation axis, and (4) determine the dot product of that cross-product with the rotation-axis vector.  The dot product will be either +/-1, ie the factor by which I'll need to multiply <tt>angle</tt>.
```
let vec = vectors[(min[0] + 1) % 3];
let rVec = mult1(mat, vec);
// cross product of rVec with vec
let rVecCrossVec = [rVec[1] * vec[2] - rVec[2] * vec[1],
                    rVec[2] * vec[0] - rVec[0] * vec[2],
                    rVec[0] * vec[1] - rVec[1] * vec[0]];
angle *= Math.sign(dotproduct(axisVec, rVecCrossVec));
```
# 3-d Rendering

[return to "Contents"](#contents)

[return to previous section ("Linear algebra")](#linear-algebra)

[go to next section ("Miscellaneous")](#miscellaneous)

The coordinate system used for this project has *x* pointing to the right and *y* pointing down.  In order to maintain a right-handed coordinate system, I choose the *z*-axis to point *in*to the screen.  Hence a positive value for the angular momentum means that the object will rotate clockwise.
In order to render the rotation within this coordinate system I followed this [example](https://3dtransforms.desandro.com/box).

The <tt>App</tt> component contains the following lines of code to render the rotating cuboid.
```
<div className="container" style={{
        height:`${npx}px`,
        width:`${npx}px`,
        perspective:`${perspective}px`
}}>
    <Dot x={npx/2} y={npx/2} d={10} />
    <Line npx={npx} r={omfLat * npx / 2} angle={omfAng} dt={dt} time={time} />
    <Body npx={npx} angleVec={angleVec} d={d} dt={dt} mids={mids0} degeneracies={degeneracies} running={running} />
</div>
```
The extent of the cuboid's [graphical perspective](https://en.wikipedia.org/wiki/Perspective_(graphical)#:~:text=Perspective%20works%20by%20representing%20the,seen%20directly%20onto%20the%20windowpane.) is achieved straightforwardly via the parent div's <tt>perspective</tt> property, which takes a value set by the user.  This value is manifest by how far away parallel lines seem to converge together (at a "vanishing point").
The parent div is positionned relatively so that absolute positionning can be used by each of its three child components: <tt>Dot</tt>, <tt>Line</tt>, and <tt>Body</tt>.  The <tt>Dot</tt> component simply depicts the cuboid's [center of mass](https://en.wikipedia.org/wiki/Center_of_mass), and I'll describe the other two in turn.

The <tt>Line</tt> component depicts the cuboid's instantaneous angular-velocity vector.  (Of course it only represents the the *x*- and *y*-components of the vector.)  The code below is taken from <tt>Fs</tt>,  shown earlier to calculate the derivatives of the Euler angles.  This helper function is also convenient for calculating the body's angular velocity (typically symbolized by the Greek letter &omega;).  The letters <tt>Omf</tt> stand for "omega in the fixed frame".  The user is in a fixed frame of reference, I want to calculate &omega; in the same frame.
```
let newOmfs = [];
    newOmfs[0] = Fs[2] * ss[1] * ss[0] + Fs[1] * cs[0];
    newOmfs[1] =-Fs[2] * ss[1] * cs[0] + Fs[1] * ss[0];
    newOmfs[2] = Fs[2] * cs[1] + Fs[0];
    setOmfs(newOmfs);
    let newOmf = Math.sqrt(newOmfs.reduce((om2, om) => om2 + om * om, 0));
    setOmf(newOmf);
    setomfLat(Math.sqrt(newOmfs[0] * newOmfs[0] + newOmfs[1] * newOmfs[1]) / newOmf);
    let newOmfAng = Math.atan2(omfs[1], omfs[0]);
```
The <tt>Lat</tt> suffix signifies the magnitude of &omega;'s lateral components, which is used (along with the angular direction of the vector, calculated trigonometrically above) for rendering the angular velocity as a line segment emanating from the cuboid's center of mass.

Below is <tt>App</tt>'s call to the <tt>Line</tt> component.
```
<Line npx={npx} r={omfLat * npx / 2} angle={omfAng} dt={dt} time={time} />
```
Below is the relevant code in the <tt>Line</tt> component, which uses props and the CSS functions <tt>rotate</tt> and <tt>translateX</tt> to compute the instantaneous value of the CSS <tt>transform</tt> property when rendering the lateral components of &omega; as a rotated line segment.
```
const Line = ({ npx, r, angle, dashed, dt }) => {
    return (
        <div className="line" style={{
            width:`${r}px`,
            left: `${npx / 2 - r / 2}px`,
            transform: `rotate(${angle * 180 / Math.PI}deg) translateX(${r / 2}px)`,
        }}/>
    )
}
```

The <tt>Body</tt> component contains - first and foremost - a parent div whose opening tag is below.
```
<div className="body"
    style={{
        translateX(${npx/2}px)
        translateY(${npx/2}px)
        transform: `rotate3d(${axisVec[0]}, ${axisVec[1]}, ${-axisVec[2]}, ${angle}rad)`
    }}
>
```
The <tt>translateX</tt> and <tt>translateY</tt> functions are needed simply to center the <tt>Body</tt> component in its parent div.
The <tt>rotate3d</tt> function takes four arguments, the first three of which are the components of the vector which specify the rotation axis.  I negate the last of those three components because CSS inexplicably uses a [left-handed coordinate system](https://en.wikipedia.org/wiki/Cartesian_coordinate_system#In_three_dimensions), whereas all physics is done with a [right-handed](https://en.wikipedia.org/wiki/Cartesian_coordinate_system#In_three_dimensions) one.  The fourth argument of <tt>rotate3d</tt> is the radian measure of the angle about which the cuboid is rotated, relative to its initial orientation.
The rotation of this parent div then controls the orientations of the twelve (= 6 + 6) children divs.  The first six divs depict the cuboid's three pairs of parallel faces, with respective pairs colored red, green, and blue.  The last six divs depict the three principal axes of rotation.
I'll cover these sequentially.

 The three pairs of the cuboid's parallel faces are each initially perpendicular to the *z*- (red), *x*- (green), and *y*-axes (blue) respectively of the fixed frame.  The values of the <tt>width</tt> and <tt>height</tt> properties reflect the pixel-dimensions of the particular face of the cuboid.  The values of the <tt>left</tt> and <tt>top</tt> properties are then set in order to center the particular face properly within the parent div.  The value of the <tt>transform</tt> property is then set by the appropriate <tt>translate#</tt> and <tt>rotate#</tt> function in order to rotate and translate the face into its appropriate start position and orientation.  Subsequent rotation is controlled by the <tt>transform</tt> property of the parent div within the <tt>Body</tt> component, utilizing the <tt>rotate3d</tt> function shown earlier.
```
<div className="side"
    style={{
        width:`${2 * d[0]}px`, height:`${2 * d[1]}px`,
        left: `${-d[0]}px`, top: `${-d[1]}px`,
        transform: `translateZ(${d[2]}px)`, background: "rgba(100,30,30,0.8)",
    }}
/>
<div className="side"
    style={{
        width:`${2*d[0]}px`, height:`${2*d[1]}px`,
        left: `${-d[0]}px`, top: `${-d[1]}px`,
        transform: `translateZ(${-d[2]}px)`, background: "rgba(100,30,30,0.8)",
    }}
/>
<div className="side"
    style={{
        width:`${2 * d[2]}px`, height:`${2*d[1]}px`,
        left: `${-d[2]}px`, top: `${-d[1]}px`,
        transform: `rotateY(90deg) translateZ(${d[0]}px)`, background: "rgba(40,100,40,0.8)",
    }}
/>
<div className="side"
    style={{
        width:`${2*d[2]}px`, height:`${2*d[1]}px`,
        left: `${-d[2]}px`, top: `${-d[1]}px`,
        transform: `rotateY(-90deg) translateZ(${d[0]}px)`, background: "rgba(40,100,40,0.8)",
    }}
/>
<div className="side"
    style={{
        width:`${2*d[0]}px`, height:`${2*d[2]}px`,
        left: `${-d[0]}px`, top: `${-d[2]}px`,
        transform: `rotateX(90deg) translateZ(${d[1]}px)`, background: "rgba(50,50,100,0.8)",
    }}
/>
<div className="side"
    style={{
        width:`${2*d[0]}px`, height:`${2*d[2]}px`,
        left: `${-d[0]}px`, top: `${-d[2]}px`,
        transform: `rotateX(-90deg) translateZ(${d[1]}px)`, background: "rgba(50,50,100,0.8)",
    }}
/>
```
The six remaining children depict the cuboid's principal axes in an analogous manner.
```
{degeneracies[0] ? null
    :<>
        <div className="line" style={{
            left: `${-dmin}px`, width: `${2 * dmin}px`
        }} />
        <div className="line" style={{
            transform: `rotateX(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`
        }} />
    </>
}
{degeneracies[1] ? null
    :<>
        <div className="line" style={{
            transform: `rotateZ(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`
        }} />
        <div className="line" style={{
            transform: `rotateZ(90deg) rotateX(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`
        }} />
    </>
}
{degeneracies[2] ? null
    :<>
        <div className="line" style={{
            transform: `rotateY(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`
        }} />
        <div className="line" style={{
            transform: `rotateY(90deg) rotateX(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`
        }} />
    </>
}
```
However an axis will not render if it is "degenerate" with another, by which I mean if the two axes have identical moments of inertia.  In this case it is not appropriate to speak in terms of separate principal axes, so it's best not to render them at all.  The code below determines whether or not a particular principal axis is degenerate with another.
```
let newDegeneracies = newMoms.map((momI, i) => {
    return newMoms.reduce((degenerate, momJ, j) => {
        return degenerate || (momJ === momI && i !== j);
    }, false);
})
```

Perturbation analysis and stabilities
Kinetic energy
transitions

# Miscellaneous

[return to "Contents"](#contents)

[return to previous section ("3-d rendering")](#3-d-rendering)

time-step
Perturbation analysis and stabilities
Kinetic energy
transitions
