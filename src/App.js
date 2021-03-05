import React, { useState, useEffect } from "react";
import { EigenvalueDecomposition, Matrix } from "ml-matrix";
// import Dot from "./Dot";
import Input from "./Input";
// import Line from "./Line";
import Square from "./Square";

const App = () => {
    const nx = 700;
    const ny = 700;
    const nz = ny;
    const xyz = new Array(3).fill(0);
    const colors = ["red", "green", "blue"];
    const [h, setH] = useState(1);
    const [thsInput, setThsInput] = useState(["0.3", "0.2", "0"]);
    const [ths, setThs] = useState(thsInput.map(elem => Number(elem)));
    const [momsInput, setMomsInput] = useState(["1", "3", "2"]);
    const [moms, setMoms] = useState(momsInput.map(elem => Number(elem)));
    const [omsInput, setOmsInput] = useState(["", "", ""]);
    const [oms, setOms] = useState(omsInput.map(elem => Number(elem)));
    const [omfs, setOmfs] = useState([0, 0, 0]);
    const [Ls, setLs] = useState([0, 0, 0]);
    const [labLs, setLabLs] = useState([0, 0, 0]);
    const [om2, setOm2] = useState(0);
    const [omf2, setOmf2] = useState(0);
    const [L2, setL2] = useState(0);
    const [K, setK] = useState(0);
    const [mids0, setMids0] = useState([]);
    const [mids, setMids] = useState([]);
    const [running, setRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [angleVecs, setAngleVecs] = useState([[]]);
    const [d, setD] = useState([nx / 3, nx / 3, nx / 3]);

    // ODE-solver timestep in ms
    const dt = 50;

    // helpful linear algebra functions:
    const dotproduct = (vec1, vec2) => vec1.reduce((dot, comp, i) => dot + comp * vec2[i], 0);
    const mult1 = (mat, vec) => mat.reduce((prod, row, i) => [...prod, dotproduct(row, vec)], []);
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

    const rot = ths => mult2(mult2(zRot(ths[2]), xRot(ths[1])), zRot(ths[0]));
    const invRot=ths=> mult2(mult2(zRot(-ths[0]),xRot(-ths[1])), zRot(-ths[2]));
    const rotX = [[1, 0, 0], [0, 0, 1], [0,-1, 0]];
    const rotY = [[0, 0,-1], [0, 1, 0], [1, 0, 0]];
    const rotZ = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

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
        angle *= -Math.sign(dotproduct(axisVec, rVecCrossVec));
        return [angle, axisVec]
    }

    // consolidate following two event handlers?
    const handlerTh = e => {
        let xyOrZ = Number(e.target.name);
        let th =  e.target.value;
        let newThsInput = [...thsInput]
        let newThs = [...ths];
        if (th === '-' || th === '.' || th === '-.') {
            newThsInput[xyOrZ] = th;
        } else {
            if (isNaN(Number(th))) return;
            newThsInput[xyOrZ] = th;
            newThs[xyOrZ] = Number(th);
        }
        setThsInput(newThsInput);
        setThs(newThs);
        let newMids = JSON.parse(JSON.stringify(mids0));
        mids0.forEach((mid, i) => newMids[i] = mult1(rot(ths), mid));
        setMids(newMids);
    };

    const handlerMom = e => {
        let xyOrZ = Number(e.target.name);
        let mom = e.target.value;
        let newMomsInput = [...momsInput];
        let newMoms = [...moms];
        if (mom === '-' || mom === '.' || mom === '-.') {
            newMomsInput[xyOrZ] = mom;
        } else {
            if (isNaN(Number(mom))) return;
            newMomsInput[xyOrZ] = mom;
            newMoms[xyOrZ] = Number(mom);
        }
        setMomsInput(newMomsInput);
        setMoms(newMoms);
        // let factor = Math.sqrt(newMoms.reduce((momMax, mom) => Math.max(momMax, mom), 0));
        // setD(newMoms.map(mom => Math.round(nx * Math.sqrt(mom)/factor/3)));
    };

    useEffect(() => {
        let factor = Math.sqrt(moms.reduce((momMax, mom) => Math.max(momMax, mom), 0));
        let newD = moms.map(mom => Math.round(nx * Math.sqrt(mom)/factor/3));
        setD(newD);
        // replace this using reduce?
        const newMids0 = [];
        xyz.forEach((row, i) => {
            let mid1 = [...xyz];
            mid1[i] = newD[i];
            let mid2 = [...xyz];
            mid2[i] = -newD[i];
            newMids0.push(mid1, mid2);
        })
        setMids0(newMids0);
        setMids(newMids0.map((mid, i) => mult1(rot(ths), mid)));
        let mats = [rotY, rotX, rotZ].map(mat => mult2(rot(ths), mat));
        setAngleVecs(mats.map(mat => rotate(mat)));
    }, [moms, ths]);

    useEffect(() => {
        let interval = null;
        if (running) {
            interval = setInterval(() => {
                setTime(time + dt/1000);
                nextThs();
            }, dt);
        } else if (!running && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running, time]);

    const Fs = ths => {
        // Following was used for symmetric rotor.
        // let Fs = [oms[0], 0, oms[2]];
        let cs = [];
        let ss = [];
        for (const th of ths) {
            cs.push(Math.cos(th));
            ss.push(Math.sin(th));
        };
        let Fs = []
        Fs[0] = h * (cs[2] * cs[2] / moms[1] + ss[2] * ss[2] / moms[0]);
        Fs[1] = h * (1 / moms[0] - 1 / moms[1]) * ss[1] * ss[2] * cs[2];
        Fs[2] = h * (1 / moms[2] - cs[2] * cs[2] / moms[1] - ss[2] * ss[2] / moms[0]) * cs[1];
        let newOms = [];
        newOms[0] = Fs[0] * ss[1] * ss[2] + Fs[1] * cs[2];
        newOms[1] = Fs[0] * ss[1] * cs[2] - Fs[1] * ss[2];
        newOms[2] = Fs[0] * cs[1] + Fs[2];
        // newOms = newOms.map(elem => -elem);
        setOms(newOms);
        setOm2(newOms.reduce((om2, om) => om2 + om * om, 0));
        let newOmfs = [];
        newOmfs[0] = Fs[2] * ss[1] * ss[2] + Fs[1] * cs[0];
        newOmfs[1] =-Fs[2] * ss[1] * cs[2] + Fs[1] * ss[0];
        newOmfs[2] = Fs[2] * cs[1] + Fs[0];
        // newOms = newOms.map(elem => -elem);
        setOmfs(newOmfs);
        setOmf2(newOmfs.reduce((om2, om) => om2 + om * om, 0));
        let newLs = newOms.map((om, i) => moms[i] * om);
        setLs(newLs);
        setL2(newLs.reduce((L2, L) => L2 + L * L, 0));
        setLabLs(mult1(invRot(ths), newLs));
        setK(newLs.reduce((K, L, i) => K + L * oms[i], 0)/2);
        return Fs;
    }

    const nextFs = (intFs, m) => {
        let newThs = [...ths];
        for (let i = 0; i < 3; i++) ths[i] += intFs[i] * dt / 1000 / m;
        return Fs(ths);
    }

    const nextThs = _ => {
        let Fs1 = Fs(ths);
        let Fs2 = nextFs(Fs1, 2);
        let Fs3 = nextFs(Fs2, 2);
        let Fs4 = nextFs(Fs3, 1);
        let nextThs = [...ths];
        for (let i = 0; i < 3; i++) nextThs[i] += (Fs1[i] + Fs4[i] + 2 * (Fs2[i] + Fs3[i])) * dt/ 1000 / 6;
        setThs(nextThs);
    }

    return (
        <>
            <button onClick={() => setRunning(!running)}>{running ? "Stop" : "Start"}</button>
            <button onClick={() => setTime(0)}>Reset</button>
            Time = {time.toFixed(2)} s
            <table>
                <thead>
                    <tr>
                        <th>Quantity</th>
                        <th>x-comp</th>
                        <th>y-comp</th>
                        <th>z-comp</th>
                        <th>magnit.</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>angles (rad)</td>
                        <td><Input n={0} quantity={running || time ? ths[0] : thsInput[0]} handler={handlerTh} /></td>
                        <td><Input n={1} quantity={running || time ? ths[1] : thsInput[1]} handler={handlerTh} /></td>
                        <td><Input n={2} quantity={running || time ? ths[2] : thsInput[2]} handler={handlerTh} /></td>
                        <td> - </td>
                    </tr>
                    <tr>
                        <td>moments</td>
                        <td><Input n={0} quantity={momsInput[0]} handler={handlerMom} /></td>
                        <td><Input n={1} quantity={momsInput[1]} handler={handlerMom} /></td>
                        <td><Input n={2} quantity={momsInput[2]} handler={handlerMom} /></td>
                        <td> - </td>
                    </tr>
                    <tr>
                        <td>(body) omega</td>
                        <td>{Math.round(oms[0] * 1000) / 1000}</td>
                        <td>{Math.round(oms[1] * 1000) / 1000}</td>
                        <td>{Math.round(oms[2] * 1000) / 1000}</td>
                        <td>{Math.round(Math.sqrt(om2) * 1000) / 1000}</td>
                    </tr>
                    <tr>
                        <td>(fixed) omega</td>
                        <td>{Math.round(omfs[0] * 1000) / 1000}</td>
                        <td>{Math.round(omfs[1] * 1000) / 1000}</td>
                        <td>{Math.round(omfs[2] * 1000) / 1000}</td>
                        <td>{Math.round(Math.sqrt(omf2) * 1000) / 1000}</td>
                    </tr>
                    <tr>
                        <td>ang. mom</td>
                        <td>{Math.round(labLs[0] * 1000) / 1000}</td>
                        <td>{Math.round(labLs[1] * 1000) / 1000}</td>
                        <td>{Math.round(labLs[2] * 1000) / 1000}</td>
                        <td>{Math.round(1000 * Math.sqrt(L2) / 1000)}</td>
                    </tr>
                    <tr>
                        <td>KE</td><td></td><td></td><td></td><td>{Math.round(1000 * K) / 1000}</td>
                    </tr>
                </tbody>
            </table>
            <div className="container" style={{height:`${ny}px`, width:`${nx}px`}}>
                {angleVecs.map((angleVec, i) => (
                    <>
                        <Square key={`front${i}`} mids={mids} i={2 * i} nx={nx} ny={ny} d={d} angleVec={angleVec} color={colors[i]} />
                        <Square key={`back${i}`} mids={mids} i={2*i+ 1} nx={nx} ny={ny} d={d} angleVec={angleVec} color={colors[i]} />
                    </>
                ))}
            </div>
        </>
    )
}
export default App;
