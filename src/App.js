import React, { useState, useEffect } from "react";
import { EigenvalueDecomposition, Matrix } from "ml-matrix";
import Dot from "./Dot";
import Input from "./Input";
import Line from "./Line";
import ToggleInfo from "./ToggleInfo";
import Body from "./Body";
import info from "./info.png";
import cancel from "./cancel.jpeg";

const App = () => {
    const allTypes = [[''], ['generic'], ['parallel', 'transverse'], ['longest',    'intermediate',    'shortest']];
    // following is solely needed for list comprehensions
    const [xyz] = useState(new Array(3).fill(0));
    const [npx, setNpx] = useState(700);
    const [LzInput, setLzInput] = useState("4");
    const [Lz, setLz] = useState(Number(LzInput));
    const [thsInput, setThsInput] = useState(["0.2", "0.3", "0.4"]);
    const [ths, setThs] = useState(thsInput.map(elem => Number(elem)));
    const [momsInput, setMomsInput] = useState(["2", "3", "4"]);
    const [firstMoms, setFirstMoms] = useState(momsInput.map(elem => Number(elem)));
    const [moms, setMoms] = useState(momsInput.map(elem => Number(elem)));
    const [oms, setOms] = useState([]);
    const [omfs, setOmfs] = useState([0, 0, 0]);
    const [omfLat, setomfLat] = useState(0);
    const [omfAng, setOmfAng] = useState(null);
    const [, setLs] = useState([0, 0, 0]);
    // const [labLs, setLabLs] = useState([0, 0, 0]);
    // const [om2, setOm2] = useState(0);
    const [omf, setOmf] = useState(0);
    // const [L2, setL2] = useState(0);
    const [K, setK] = useState(0);
    const [mids0, setMids0] = useState([]);
    const [mids, setMids] = useState([]);
    const [running, setRunning] = useState(false);
    const [time, setTime] = useState(0);
    // const [angleVecs, setAngleVecs] = useState([[]]);
    const [angleVec, setAngleVec] = useState([]);
    const [d, setD] = useState([npx / 3, npx / 3, npx / 3]);
    const [areLegalMoms, setAreLegalMoms] = useState(true);
    const [degeneracies, setDegeneracies] = useState(new Array(3).fill(false));
    const [shape, setShape] = useState(3);
    const [types, setTypes] = useState(allTypes[shape]);
    const [zAxis, setZAxis] = useState(0);
    const [legalOrder, setLegalOrder] = useState(true);
    const [isotropic, setIsotropic] = useState(false);
    const [logDt, setLogDt] = useState(7);
    const [dt, setDt] = useState(2 ** logDt);
    const [showInfo, setShowInfo] = useState({});
    const [perspective, setPerspective] = useState(npx);

    // helpful linear algebra functions:
    const dotproduct = (vec1, vec2) => vec1.reduce((dot, comp, i) => dot + comp * vec2[i], 0);
    const mult1 = (mat, vec) => mat.map(row => dotproduct(row, vec));
    const transpose = mat => mat[0].map((blah, i) => mat.map(row => row[i]));
    const mult2 = (mat1, mat2) => mat1.map(x => transpose(mat2).map(y => dotproduct(x, y)));

    const zRot = th => {
        let [c, s] = [Math.cos(th), Math.sin(th)];
        return [[c, s, 0], [-s, c, 0], [0, 0, 1]];
    }
    const xRot = th => {
        let [c, s] = [Math.cos(th), Math.sin(th)];
        return [[1, 0, 0], [0, c, s], [0, -s, c]];
    }

    // const rot = ths => mult2(mult2(zRot(ths[2]), xRot(ths[1])), zRot(ths[0]));
    const invRot=ths=> mult2(mult2(zRot(-ths[0]),xRot(-ths[1])), zRot(-ths[2]));

    useEffect(() => {
        let sumMom = moms[0] + moms[1] + moms[2];
        let newD = moms.map(mom => Math.max(0.000001, Math.sqrt((sumMom / 2 - mom))));
        let dMax = newD.reduce((max, d) => Math.max(d, max));
        newD = newD.map(d => npx * d / dMax / 4);
        setD(newD);
        // replace this using reduce or forEach?
        const newMids0 = [];
        xyz.forEach((row, i) => {
            let mid1 = [...xyz];
            mid1[i] = newD[i];
            let mid2 = [...xyz];
            mid2[i] = -newD[i];
            newMids0.push(mid1, mid2);
        })
        setMids0(newMids0);
    }, [moms, xyz]);

    const rotationStuff = () => {
        setMids(mids0.map((mid, i) => mult1(invRot(ths), mid)));
        let newAngleVec = rotate(invRot(ths));
        let dot = angleVec[1] ? newAngleVec[1].reduce((dot, comp, i) => dot + comp * angleVec[1][i], 0) : null;
        if (dot < 0) {
            newAngleVec[1] = newAngleVec[1].map(comp => -comp);
            newAngleVec[0] *= -1;
        }
        let nAng = (newAngleVec[0] - angleVec[0]) / 2 / Math.PI;
        if (Math.abs(Math.round(nAng) - nAng) < 0.1) newAngleVec[0] -= Math.round(nAng) * 2 * Math.PI;
        setAngleVec(newAngleVec);
    }
    useEffect(() => rotationStuff(), [mids0, ths]);

    const rotate = mat => {
        let trace = mat[0][0] + mat[1][1] + mat[2][2];
        let angle = Math.acos((trace - 1) / 2);
        let vectors = new EigenvalueDecomposition(new Matrix(mat)).eigenvectorMatrix.transpose().data;
        // Determine which eigenvector has eigenvalue = 1 (ie, is rotation axis)
        let dVectors = vectors.map(vector => mult1(mat, vector).map((comp, i) => comp - vector[i]));
        let mags = dVectors.map(dVector => dVector.reduce((mag, comp) => mag + comp * comp, 0));
        let min = mags.reduce((min, mag, i) => mag < min[1] ? [i, mag] : min, [-1, Infinity]);
        let axisVec = vectors[min[0]];
        let vec = vectors[(min[0] + 1) % 3];
        let rVec = mult1(mat, vec);
        // rewrite this using a double loop or double list-comprehension?
        let rVecCrossVec = [rVec[1] * vec[2] - rVec[2] * vec[1],
                            rVec[2] * vec[0] - rVec[0] * vec[2],
                            rVec[0] * vec[1] - rVec[1] * vec[0]];
        angle *= Math.sign(dotproduct(axisVec, rVecCrossVec));
        return [angle, axisVec];
    }

    // consolidate aspects of following event handlers?
    const handlerLz = e => {
        let newLz =  e.target.value;
        if (['', '-', '.', '-.'].includes(newLz)) return setLzInput(newLz);
        if (isNaN(Number(newLz))) return;
        setLzInput(newLz);
        setLz(Number(newLz));
    };

    const handlerTh = e => {
        let xyOrZ = Number(e.target.name);
        let th =  e.target.value;
        let newThsInput = [...thsInput]
        let newThs = [...ths];
        if (['', '-','.', '-.'].includes(th)) {
            newThsInput[xyOrZ] = th;
        } else {
            if (isNaN(Number(th))) return;
            newThsInput[xyOrZ] = th;
            newThs[xyOrZ] = Number(th);
        }
        setThsInput(newThsInput);
        setThs(newThs);
        let newMids = [];
        mids0.forEach(mid => newMids.push(mult1(invRot(ths), mid)));
        setMids(newMids);
    };

    const handlerMom = e => {
        // let xyOrZ = Number(e.target.name);
        let newIsotropic = false;
        let name = Number(e.target.name);
        let mom = e.target.value;
        let newMomsInput = [...momsInput];
        let newMoms = [...firstMoms];
        if (['', '.'].includes(mom)) {
            newMomsInput[name] = mom;
        } else {
            let newMom = Number(mom);
            if (isNaN(newMom)) return;
            newMomsInput[name] = mom;
            newMoms[name] = newMom;
            if (shape === 1) {
                newMoms[1] = newMom;
                newMoms[2] = newMom;
            }
            if (shape === 2) {
                if (name === 1) newMoms[2] = newMom;
                if (newMoms[0] === newMoms[1]) newIsotropic = true;
            }
            if (shape === 3) setLegalOrder(newMoms.reduce((legal, mom, i, moms) => (!i || (legal && mom > moms[i - 1])), true))
            setAreLegalMoms(newMoms.reduce((legal, mom, i, moms) => (legal && mom <= (moms[(i+1)%3] + moms[(i+2)%3])), true));
        }
        setIsotropic(newIsotropic);
        setMomsInput(newMomsInput);
        setFirstMoms(newMoms);
        setMoms(newMoms);
    };

    useEffect(() => {
        let interval;
        if (running) interval = setInterval(() => setTime(time + dt/1000), dt);
        if (!running && time !== 0) clearInterval(interval);
        return () => clearInterval(interval);
    }, [running, time]);

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
        let newOms = [];
        newOms[0] = Fs[0] * ss[1] * ss[2] + Fs[1] * cs[2];
        newOms[1] = Fs[0] * ss[1] * cs[2] - Fs[1] * ss[2];
        newOms[2] = Fs[0] * cs[1] + Fs[2];
        setOms(newOms);
        // setOm2(newOms.reduce((om2, om) => om2 + om * om, 0));
        let newOmfs = [];
        newOmfs[0] = Fs[2] * ss[1] * ss[0] + Fs[1] * cs[0];
        newOmfs[1] =-Fs[2] * ss[1] * cs[0] + Fs[1] * ss[0];
        newOmfs[2] = Fs[2] * cs[1] + Fs[0];
        setOmfs(newOmfs);
        let newOmf = Math.sqrt(newOmfs.reduce((om2, om) => om2 + om * om, 0));
        setOmf(newOmf);
        setomfLat(Math.sqrt(newOmfs[0] * newOmfs[0] + newOmfs[1] * newOmfs[1]) / newOmf);
        let newOmfAng = Math.atan2(omfs[1], omfs[0]);
        let nAng = (newOmfAng - omfAng) / 2 / Math.PI;
        if (Math.abs(Math.round(nAng) - nAng) < 0.2) newOmfAng -= Math.round(nAng) * 2 * Math.PI;
        setOmfAng(newOmfAng);
        let newLs = newOms.map((om, i) => moms[i] * om);
        setLs(newLs);
        // setL2(newLs.reduce((L2, L) => L2 + L * L, 0));
        // setLabLs(mult1(invRot(ths), newLs));
        setK(newLs.reduce((K, L, i) => K + L * oms[i], 0)/2);
        // setK(Lz * (Fs[0] * cs[1] + Fs[2]));
        return Fs;
    }

    const nextFs = (intFs, m) => Fs(ths.map((th, i) => th + intFs[i] * dt / 1000 / m));

    // With each "tick", calculate the next set of 3 Euler angles
    useEffect(() => {
        if (!running) return;
        let Fs1 = Fs(ths);
        let Fs2 = nextFs(Fs1, 2);
        let Fs3 = nextFs(Fs2, 2);
        let Fs4 = nextFs(Fs3, 1);
        setThs([...ths].map((th, i) => th + (Fs1[i] + Fs4[i] + 2 * (Fs2[i] + Fs3[i])) * dt/ 1000 / 6));
    }, [time, running]);

    const handleToggle = e => {
        let name = e.currentTarget.name;
        let newShowInfo = {...showInfo};
        newShowInfo[name] = !showInfo[name];
        setShowInfo(newShowInfo);
      }

    let text = {
        timestep: `This controls the extent of the approximation used when computing derivatives with respect to time.  Shorter timesteps make the results more accurate but may make the simulation run slowly.`,
        momentum: `Roughly speaking the angular momentum is the product of the body's mass, its width (away from the rotation axis), and how fast it spins.  The coordinate system for this simulation has x to the right, y down, and z into the screen.  Accordingly the z component of the angular momentum is positive for clockwise motion and negative for counterclockwise. If you want to see the body spin faster, increase its angular momentum.`,
        shape: `An object has three moments of inertia: one for rotation about each of its three axes.  (Note that the axes are mutually perpendicular and are indicated in the figure.) An object is said to be "isotropic" if its three moments are all equal, as is the case for either a sphere or a cube. An object is "axisymmetric" if two out of the three moments are equal, as is the case either for an object which has "rotational symmetry" such as a cup, or a for box for which four of the six faces are the same shape.  An object is asymmetric if all three of its moments of inertia are different.`,
        moment: `The moment of inertia quantifies an object's resistance to instantaneous changes of its rate of rotation, just as an object's mass (or "translational inertia") quantifies an object's resistance to instantaneous changes of its speed.  The moment of inertia about a particular axis is small if the object is "skinny" along that axis.`,
        choose: `When one of the body's principal axes is exactly parallel to the z-axis (which - in turn - is parallel to the angular momentum vector), the rotational motion is constant, as you can easily confirm with this simulation.  However when the principal axis is close to - but does not coincide with - the z-axis the result is precession, which can be either stable or unstable.`,
        euler: `Three angular parameters are required in order to specify the orientation of a rigid object which is free to rotate about its center of mass.  In aviation these variables are called "pitch", "roll", and "yaw", but in general these are usually chosen as the Euler angles, typically represented by the Greek letters "phi", "theta", and "psi" as used below.  For this simulation, the middle angle (between the body axis and the z-axis) is the most important, because it relates directly to precession of the body's axes.  The easiest way for you to learn more about these angles is by seeing the effects of their adjustment upon the body's appearance.`,
        omega: `The body's angular velocity (or "angular frequency") is a vector which points in the same general direction as the body's angular-momentum vector, and these two vectors are exactly parallel if the angular momentum points exactly parallel to one of the body's principal axes of rotation.  The diagram on the right will use a dot to represent the angular velocity if/when it is ever parallel to the z-axis, because the vector will then be directed either into or out of the screen.`,
        energy: `The body's rotational kinetic energy equals 0.5 times the "dot product" of the angular momentum and the angular velocity.  It is a non-negative quantity and should be constant in this simulation.  If it seems NOT to be constant, you should probably lower the value of the time-step.`,
      }

    return (
        <>
            <div className="top"><p align="center"><h1>Free-body rotation</h1></p></div>
            {`The motion of a rigid body consists of two simultaneous processes: (1) "translation" of the center of mass and (2) rotation around the center of mass.  The trajectory of the first process is either a straight line (in outer space), a parabola (near the surface of a gravitating body like the earth), or a conic section such as a circle, ellipse, or hyperbola (at a greater distance from a gravitating body).  This simulation considers the second process: the torque-free rotation of an object.  Except for the simple case of a body shaped as either a sphere or cube, this rotation is not as simple as that of a globe which spins at a constant rate about its fixed axis.  Free rotation is governed by "Euler's torque-free equations", a system of three nonlinear differential equations which generally can only be solved numerically as I do in this simulation. Almost every control/input/output below has a place where you can click`}
            '<img src={info} alt="Show information." />/<img src={cancel} alt="Hide information." />'
            {`in order to toggle the display of information about the particular item. Enjoy!`}
            <div className="bottom">
                <div className="left">
                {!zAxis ? null :
                    <>
                        <p align="center"><h3>Controls</h3></p>
                        <button onClick={() => setRunning(!running)}>{running ? "Stop" : "Start"}</button>
                        <button onClick={() => setTime(0)}>Reset</button>
                        Time = {time.toFixed(1)} s
                        <div>
                            <ToggleInfo onClick={handleToggle} name="timestep" toggle={showInfo.timestep} />
                            Time-step (presently {dt} ms):&nbsp;&nbsp;&nbsp;
                            1 ms
                            <input
                                type="range" min="0" max="11" value={logDt} onChange={e => {
                                    let newLogDt = Number(e.target.value);
                                    setLogDt(newLogDt);
                                    setDt(2 ** newLogDt);
                                }}
                            />
                            2 s
                        </div>
                        <div><i>{showInfo.timestep ? text.timestep : null}</i></div>
                    </>
                }
                <>
                    <div>
                        Window size:&nbsp;&nbsp;&nbsp;
                        small
                        <input
                            type="range" min="400" max="1000" step="50" value={npx}
                                onChange={e => setNpx(Number(e.target.value))}
                        />
                        large
                    </div>
                    <div>
                        Perspective:&nbsp;&nbsp;&nbsp;
                        lots
                        <input
                            type="range" min={npx / 2} max={3 * npx} value={perspective}
                                onChange={e => setPerspective(Number(e.target.value))}
                        />
                        little
                    </div>
                </>

                <p align="center"><h3>Inputs</h3></p>
                <div>
                    <ToggleInfo onClick={handleToggle} name="momentum" toggle={showInfo.momentum} />
                    <i>z</i>-component of angular momentum: &nbsp;&nbsp;&nbsp;
                    <Input quantity={running || time ? Lz : LzInput} handler={handlerLz}/> kg m/s
                </div>
                <div>(The other two components are zero.)</div>
                <div><i>{showInfo.momentum ? text.momentum : null}</i></div>

                <div>
                    <ToggleInfo onClick={handleToggle} name="shape" toggle={showInfo.shape} />
                    Shape of box&nbsp;&nbsp;&nbsp;
                    <select value={shape} onChange={e => {
                        let newShape = Number(e.target.value);
                        setShape(newShape);
                        setZAxis(newShape === 1 ? 1 : 0);
                        setRunning(false);
                        setTime(0);
                        setDegeneracies([[false, false, false], [true, true, true], [false, true, true],    [false,    false, false]][newShape]);
                        let newMoms = [...moms];
                        if (newShape === 1) newMoms = newMoms.map((mom, i, moms) => moms[0])
                        if (newShape === 2) {
                            newMoms[1] = newMoms[1] === newMoms[0] ? Math.round(newMoms[0] + 0.6) : newMoms[1]  ;
                            newMoms[2] = newMoms[1];
                        }
                        if (newShape === 3) {
                            newMoms.sort((a, b) => a - b);
                            newMoms[1] = newMoms[1] === newMoms[0] ? Math.round(newMoms[0] + 0.6) : newMoms[1]  ;
                            newMoms[2] = newMoms[2] <= newMoms[1] ? Math.round(newMoms[1] + 0.6) : newMoms[2];
                        }
                        setMomsInput(newMoms.map(mom => String(mom)));
                        setFirstMoms(newMoms);
                        setMoms(newMoms);
                        setTypes([[''], ['generic'], ['parallel', 'transverse'], ['longest',    'intermediate',    'shortest']][newShape]);
                    }}>
                        {["choose shape", 'isotropic', 'axisymmetric', 'asymmetric'].map((option, i) => (
                        <option key={i} title={"more info"} value={i}> {option} </option>
                        ))}
                    </select>
                </div>
                <div><i>{showInfo.shape ? text.shape : null}</i></div>


                {!shape ? null :
                    <>
                        <div>
                            <ToggleInfo onClick={handleToggle} name="moment" toggle={showInfo.moment} />
                            Moment{`${shape === 1 ? '' : "s"}`} of inertia: (in kg m<sup>2</sup>)
                        </div>
                        <div><i>{showInfo.moment ? text.moment : null}</i></div>
                        {xyz.filter((blah, i) => i < shape).map((blah, i) => (
                            <div>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Input key={i} name={i} quantity={momsInput[i]} handler={handlerMom} />
                                {types[i]} axis
                            </div>
                        ))}
                        {legalOrder ? null : <div className="message">
                                For an asymmetric body the moments of inertia should increase, going from   long    axis to short axis.
                        </div>}
                        {areLegalMoms ? null : <div className="message">No single moment of inertia should  exceed the sum of the other two.</div>}
                        {!isotropic ? null : <div className="message">This is considered "isotropic" not    "axisymmetric".</div>}

                        {shape < 1 ? null :
                            <>
                                <div>
                                    <ToggleInfo onClick={handleToggle} name="choose" toggle={showInfo.choose}   />
                                    Choose <i>z</i>-axis to be near ...&nbsp;&nbsp;&nbsp;
                                {/* </div>
                                <div> */}
                                    <select value={zAxis} onChange={e => {
                                        let newZAxis = Number(e.target.value);
                                        let newMoms = [...moms];
                                        newMoms[2] = firstMoms[newZAxis - 1];
                                        newMoms[0] = firstMoms[newZAxis % 3];
                                        newMoms[1] = firstMoms[(newZAxis + 1) % 3];
                                        setMoms(newMoms);
                                        setZAxis(newZAxis);
                                        setRunning(false);
                                        setTime(0);
                                        // setOms([0, 0, 0]);
                                        setOmfs([0, 0, 0]);
                                        // set as "true" for all axes for which moments of inertia are degenerate
                                        let newDegeneracies = newMoms.map((momI, i) => {
                                            return newMoms.reduce((degenerate, momJ, j) => {
                                                return degenerate || (momJ === momI && i !== j);
                                            }, false);
                                        })
                                        setDegeneracies(newDegeneracies);
                                    }}>
                                        {["which", ...types].map((option, i) => (
                                            <option key={i} value={i}>{option} </option>
                                        ))}
                                    </select> axis
                                </div>
                                <i>{showInfo.choose ? text.choose : null}</i>

                                <p align="center"><h3>{zAxis && time ? "Data" : null}</h3></p>
                                {!zAxis ? null :
                                    <>
                                        <div>
                                            <ToggleInfo onClick={handleToggle} name="euler" toggle={showInfo.   euler} />
                                            Euler angles (in radians):
                                        </div>
                                        <div><i>{showInfo.euler ? text.euler : null}</i></div>
                                        <div>
                                            between {types[zAxis - 1]} axis and <i>z</i>-axis: &nbsp;&nbsp;&nbsp;
                                            {/* </div>
                                            <div> */}
                                            &theta; =
                                            <Input
                                                key={"ang1"} name={1} handler= {handlerTh}
                                                quantity={running || time ? ths[1] : thsInput[1]}
                                            />
                                        </div>
                                        <div>
                                            Remaining two angles: &nbsp;&nbsp;&nbsp;
                                        {/* </div>
                                        <div> */}
                                            &phi; =
                                            <Input
                                                key={"ang0"} name={0} handler={handlerTh}
                                                quantity={running || time ? ths[0] : thsInput[0]}
                                            />
                                            &nbsp;&nbsp;&nbsp;
                                            &psi; =
                                            <Input
                                                key={"ang0"} name={2} handler={handlerTh}
                                                quantity={running || time ? ths[2] : thsInput[2]}
                                            />
                                        </div>
                                    </>
                                }
                            </>
                        }

                        {!(running || time) ? null :
                            <>
                                <div>
                                    <ToggleInfo onClick={handleToggle} name="omega" toggle={showInfo.omega} />
                                    Lab-frame angular velocity &omega; (in rad/sec)
                                    <div>(also displayed as a segment in figure):</div>
                                </div>
                                <div><i>{showInfo.omega ? text.omega : null}</i></div>
                                <div>components = [
                                    {Math.round(omfs[0] * 100) / 100},&nbsp;
                                    {Math.round(omfs[1] * 100) / 100},&nbsp;
                                    {Math.round(omfs[2] * 100) / 100}
                                    ]
                                </div>
                                <div>magnitude = {Math.round(omf * 100) / 100}</div>

                                <div>
                                    <ToggleInfo onClick={handleToggle} name="energy" toggle={showInfo.energy}   />
                                    kinetic energy = {Math.round(1000 * K) / 1000} joules
                                </div>
                                <div><i>{showInfo.energy ? text.energy : null}</i></div>
                            </>
                        }
                    </>
                }
            </div>
            <div className="container" style={{height:`${npx}px`, width:`${npx}px`, perspective:`${perspective}px`}}>
                <Line npx={npx} r={omfLat * npx / 2} angle={omfAng} dt={dt} time={time} />
                <Body npx={npx} angleVec={angleVec} d={d} dt={dt} mids={mids0} degeneracies={degeneracies} running={running} />
                <Dot x={npx/2} y={npx/2} d={10} />
            </div>
            </div>
        </>
    )
}
export default App;
