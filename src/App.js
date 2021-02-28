import React, { useState, useEffect } from "react";
import Dot from "./Dot";
import Input from "./Input";
import Line from "./Line";
import Square from "./Square";

const App = () => {
    const [h, setH] = useState(1);
    const [thsInput, setThsInput] = useState(["0", "0", "0"]);
    const [ths, setThs] = useState([0, 0, 0]);
    const [momsInput, setMomsInput] = useState(["1", "1", "2"]);
    const [moms, setMoms] = useState(null);
    const [omsInput, setOmsInput] = useState(["", "", ""]);
    const [oms, setOms] = useState([0, 0, 0]);
    const [omfs, setOmfs] = useState([0, 0, 0]);
    const [Ls, setLs] = useState([0, 0, 0]);
    const [om2, setOm2] = useState(0);
    const [omf2, setOmf2] = useState(0);
    const [L2, setL2] = useState(0);
    const [K, setK] = useState(0);
    // const [torques, setTorques] = useState([0, 0, 0]);
    const [xyzs0, setXyzs0] = useState([]);
    const [mids0, setMids0] = useState([]);
    const [xyzs, setXyzs] = useState([]);
    const [mids, setMids] = useState([]);
    const [running, setRunning] = useState(false);
    const [time, setTime] = useState(0);

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
        let newXyzs = JSON.parse(JSON.stringify(xyzs0));
        xyzs0.forEach((xyz, i) => {
            newXyzs[i][0] = mult1(mult2(mult2(zRot(newThs[2]), xRot(newThs[1])),zRot(newThs[0])), xyz[0]);
        });
        setXyzs(newXyzs);
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
    };

    // matrix multiplication: arr1 * arr2
    const mult2 = (arr1, arr2) => {
        let arr3 = [];
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                let elem = 0;
                for (let k = 0; k < 3; k++) elem += arr1[i][k] * arr2[k][j];
                row.push(elem);
            }
            arr3.push(row);
        }
        return arr3;
    }
    // matrix multiplication: arr * vec
    const mult1 = (arr, vec) => {
        let vec2 = [];
        for (let i = 0; i < 3; i++) {
            let elem = 0;
            for (let j = 0; j < 3; j++) elem += arr[i][j] * vec[j];
            vec2.push(elem);
        }
        return vec2;
    }
    const zRot = th => {
        let [c, s] = [Math.cos(th), Math.sin(th)];
        return [[c, s, 0], [-s, c, 0], [0, 0, 1]];
    }
    const xRot = th => {
        let [c, s] = [Math.cos(th), Math.sin(th)];
        return [[1, 0, 0], [0, c, s], [0, -s, c]];
    }

    const nx = 700;
    const ny = 700;
    const nz = ny;
    const d = 20;

    // ODE-solver timestep, in ms
    const dt = 50;

    useEffect(() => {
        setMoms(momsInput.map(mom => Number(mom)));
        const firstXyzs = [];
        for (let i = 0; i < 2; i++) {
            let x = (-1 + 2 * i) * (nx / 4);
            for (let j = 0; j < 2; j++) {
                let y = (-1 + 2 * j) * (ny / 4);
                for (let k = 0; k < 2; k++) {
                    let z = (-1 + 2 * k) * (nz / 4)
                    firstXyzs.push([[x, y, z], [i, j, k]]);
                }
            }
        }
        setXyzs0(firstXyzs);
        const firstMids = [];
        for (let i = -1; i < 2; i += 2) {
            firstMids.push([0, 0, i * nx / 4]);
            firstMids.push([0, i * nx / 4, 0]);
            firstMids.push([i * nx / 4, 0, 0]);
        }
        setMids0(firstMids);
        let newThs = thsInput.map(th => Number(th));
        setThs(newThs);
        let newXyzs = JSON.parse(JSON.stringify(firstXyzs));
        firstXyzs.forEach((xyz, i) => {
            newXyzs[i][0] = mult1(mult2(mult2(zRot(newThs[2]), xRot(newThs[1])),zRot(newThs[0])), xyz[0]);
        });
        setXyzs(newXyzs);
        let newMids = JSON.parse(JSON.stringify(firstMids));
        firstMids.forEach((mid, i) => {
            newMids[i] = mult1(mult2(mult2(zRot(newThs[2]), xRot(newThs[1])),zRot(newThs[0])), mid);
        });
        setMids(newMids);
    }, []);

    useEffect(() => {
        let interval = null;
        if (running) {
            interval = setInterval(() => {
                setTime(time + dt/1000);
                nextThs();
                let newXyzs = JSON.parse(JSON.stringify(xyzs0));
                let iMin = 0;
                let zMin = newXyzs[iMin][0][2];
                xyzs0.forEach((xyz, i) => {
                    newXyzs[i][0] = mult1(mult2(mult2(zRot(ths[2]), xRot(ths[1])),zRot(ths[0])), xyz[0]);
                    newXyzs[i][2] = false;
                    if (newXyzs[i][0][2] < zMin) {
                        iMin = i;
                        zMin = newXyzs[i][0][2];
                    }
                });
                newXyzs[iMin][2] = true;
                setXyzs(newXyzs);
                let newMids = JSON.parse(JSON.stringify(mids0));
                mids0.forEach((mid, i) => {
                    newMids[i] = mult1(mult2(mult2(zRot(ths[2]), xRot(ths[1])),zRot(ths[0])), mid);
                });
                setMids(newMids);
            }, dt);
        } else if (!running && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running, time, xyzs0]);

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
                        <td><Input n={0} quantity={running ? ths[0] : thsInput[0]} handler={handlerTh} /></td>
                        <td><Input n={1} quantity={running ? ths[1] : thsInput[1]} handler={handlerTh} /></td>
                        <td><Input n={2} quantity={running ? ths[2] : thsInput[2]} handler={handlerTh} /></td>
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
                        <td>{Math.round(Ls[0] * 1000) / 1000}</td>
                        <td>{Math.round(Ls[1] * 1000) / 1000}</td>
                        <td>{Math.round(Ls[2] * 1000) / 1000}</td>
                        <td>{Math.round(1000 * Math.sqrt(L2) / 1000)}</td>
                    </tr>
                    <tr>
                        <td>KE</td><td></td><td></td><td></td><td>{Math.round(1000 * K) / 1000}</td>
                    </tr>
                </tbody>
            </table>
            <div className="container" style={{height:`${ny}px`, width:`${nx}px`}}>
                {/* <Square className="square" mids={mids[5]} nx={nx} ny={ny} ths={ths} /> */}
                {xyzs.map((xyz, index) => (
                    <Dot
                        key={index}
                        x={xyz[0][0] + nx / 2}
                        y={xyz[0][1] + ny / 2}
                        d={d}
                        dashed={xyz[2]}
                    />
                ))}
                {mids.map((mid, index) => (
                    <Dot
                        key={index}
                        x={mid[0] + nx / 2}
                        y={mid[1] + ny / 2}
                        d={d}
                        // dashed={xyz[2]}
                    />
                ))}
                {xyzs.map((xyz0, index0) => {
                    return xyzs.filter(xyz1 => {
                        let d = [];
                        for (let i = 0; i < 3; i++) d.push(Math.abs(xyz0[1][i] - xyz1[1][i]));
                        // replace the following via the use of d.reduce((neighbor, di) => ?
                        let neighbor = false;
                        for (let i = 0; i < 3; i++) {
                            neighbor = neighbor || (d[i] === 1 && !d[(i + 1) % 3] && !d[(i + 2) % 3]);
                        }
                        return neighbor;
                    }).map((xyz1, index1) => (
                        <Line
                            key={String(index0) + String(index1)}
                            xi={xyz0[0][0] + nx / 2}
                            yi={xyz0[0][1] + ny / 2}
                            xf={xyz1[0][0] + nx / 2}
                            yf={xyz1[0][1] + ny / 2}
                            dashed={xyz0[2] || xyz1[2]}
                        />
                    ))

                })}
                <Line xi={nx / 2} yi={ny / 2} xf = {nx * oms[0] + nx / 2} yf = {nx * oms[1] + ny / 2} />
                <Line xi={nx / 2} yi={ny / 2} xf = {nx * omfs[0] + nx / 2} yf = {nx * omfs[1] + ny / 2} dashed={true} />
            </div>
        </>
    )
}
export default App;
