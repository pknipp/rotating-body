import React, { useState, useEffect } from "react";
import Dot from "./Dot";
import Input from "./Input";
import Line from "./Line";

const App = () => {
    const [h, setH] = useState(1);
    const [ths, setThs] = useState([0, 0, 0]);
    const [moms, setMoms] = useState([1, 1, 1]);
    const [oms, setOms] = useState([0, 0, 0]);
    const [om2, setOm2] = useState(0);
    const [torques, setTorques] = useState([0, 0, 0]);
    const [xyzs0, setXyzs0] = useState([]);
    const [xyzs, setXyzs] = useState([]);
    const [running, setRunning] = useState(false);
    const [time, setTime] = useState(0);
    const handlerTh = e => {
        let xyOrZ = Number(e.target.name);
        let th =  Number(e.target.value);
        let newThs = [...ths];
        newThs[xyOrZ] = th;
        setThs(newThs);
        // newGetSetTh[xyOrZ][0] = th;
        let newXyzs = JSON.parse(JSON.stringify(xyzs0));
        xyzs0.forEach((xyz, i) => {
            newXyzs[i][0] = mult1(mult2(mult2(zRot(newThs[2]), xRot(newThs[1])),zRot(newThs[0])), xyz[0]);
        });
        setXyzs(newXyzs);
    };
    const handlerMom = e => {
        let xyOrZ = Number(e.target.name);
        let mom = Number(e.target.value);
        let newMoms = [...moms];
        newMoms[xyOrZ] = mom;
        setMoms(newMoms);
    };

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
    const dt = 20;

    useEffect(() => {
        const firstXyzs = []
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
        setXyzs(firstXyzs);
    }, []);

    useEffect(() => {
        let interval = null;
        if (running) {
            interval = setInterval(() => {
                setTime(time + dt/1000);
                nextThs();
                let newXyzs = JSON.parse(JSON.stringify(xyzs0));
                xyzs0.forEach((xyz, i) => {
                    newXyzs[i][0] = mult1(mult2(mult2(zRot(ths[2]), xRot(ths[1])),zRot(ths[0])), xyz[0]);
                });
                setXyzs(newXyzs);
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
        Fs[1] = h * (1 / moms[0] - 1 / moms[1   ]) * ss[1] * ss[2] * cs[2];
        Fs[2] = h * (1 / moms[2] - cs[2] * cs[2] / moms[1] - ss[2] * ss[2] / moms[0]) * cs[1];
        let newOms = [];
        newOms[0] = Fs[0] * ss[1] * ss[2] + Fs[1] * cs[2];
        newOms[1] = Fs[0] * ss[1] * cs[2] - Fs[1] * ss[2];
        newOms[2] = Fs[0] * cs[1] + Fs[2];
        // newOms = newOms.map(elem => -elem);
        setOms(newOms);
        setOm2(newOms.reduce((om2, om) => om2 + om * om, 0));
        let newTorques = [];
        newTorques[0] = moms[0] * Fs[0] - (moms[1] - moms[2]) * oms[1] * oms[2];
        newTorques[1] = moms[1] * Fs[1] - (moms[2] - moms[0]) * oms[2] * oms[0];
        newTorques[2] = moms[2] * Fs[2] - (moms[0] - moms[1]) * oms[0] * oms[1];
        setTorques(newTorques);
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
            <div>
                <span>
                    Initial angles:
                    <Input n={0} quantity={ths[0]} handler={handlerTh} />
                    <Input n={1} quantity={ths[1]} handler={handlerTh} />
                    <Input n={2} quantity={ths[2]} handler={handlerTh} />
                </span>
            </div>
            <div>
                <span>
                    Moments of inertia:
                    <Input n={0} quantity={moms[0]} handler={handlerMom} />
                    <Input n={1} quantity={moms[1]} handler={handlerMom} />
                    <Input n={2} quantity={moms[2]} handler={handlerMom} />
                </span>
            </div>
            <div>{oms[0]}</div>
            <div>{oms[1]}</div>
            <div>{oms[2]}</div>
            <div>{om2}</div>
            <div className="container" style={{height:`${ny}px`, width:`${nx}px`}}>
                {xyzs.map((xyz, index) => (
                    <Dot
                        key={index}
                        x={xyz[0][0] + nx / 2}
                        y={xyz[0][1] + ny / 2}
                        d={d}
                        // dashed={newXyz[2]}
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
                        />
                    ))

                })}
                <Line xi={nx / 2} yi={ny / 2} xf = {nx * oms[0] + nx / 2} yf = {nx * oms[1] + ny / 2} />
            </div>
        </>
    )
}
export default App;
