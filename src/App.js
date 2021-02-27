import React, { useState, useEffect } from "react";
import Dot from "./Dot";
import Input from "./Input";
import Line from "./Line";

const App = () => {
    const [h, setH] = useState(1);
    const [thsInput, setThsInput] = useState(["", "", ""]);
    const [ths, setThs] = useState([0, 0, 0]);
    const [omsInput, setOmsInput] = useState(["", "", ""]);
    const [oms, setOms] = useState([0, 0, 0]);
    const [xyzs0, setXyzs0] = useState([]);
    const [xyzs, setXyzs] = useState([]);
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
            newXyzs[i][0] = mult1(mult2(mult2(zRot(newThs[0]), xRot(newThs[1])),zRot(newThs[2])), xyz[0]);
        });
        setXyzs(newXyzs);
    };
    const handlerOm = e => {
        let xyOrZ = Number(e.target.name);
        let om = e.target.value;
        let newOms = [...oms];
        let newOmsInput = [...omsInput];
        if (om === '-' || om === '.' || om === '-.') {
            newOmsInput[xyOrZ] = om;
        } else {
            if (isNaN(Number(om))) return;
            newOmsInput[xyOrZ] = om;
            newOms[xyOrZ] = Number(om);
        }
        setOmsInput(newOmsInput);
        setOms(newOms);
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
                    newXyzs[i][0] = mult1(mult2(mult2(zRot(ths[0]), xRot(ths[1])),zRot(ths[2])), xyz[0]);
                });
                console.log("bottom of useEffect")
                setXyzs(newXyzs);
            }, dt);
        } else if (!running && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running, time, xyzs0]);

    const Fs = ths => {
        console.log("top of Fs")
        let Fs = [oms[0], 0, oms[2]];
        return Fs;
    }

    const nextFs = (intFs, m) => {
        console.log("top of nextFs");
        let newThs = [...ths];
        for (let i = 0; i < 3; i++) ths[i] += intFs[i] * dt / 1000 / m;
        return Fs(ths);
    }

    const nextThs = _ => {
        console.log("top of nextThs")
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
                <Input n={0} quantity={thsInput[0]} handler={handlerTh} />
                <Input n={1} quantity={thsInput[1]} handler={handlerTh} />
                <Input n={2} quantity={thsInput[2]} handler={handlerTh} />
            </span>
        </div>
        <div>
            <span>
                Angular speeds:
                <Input n={0} quantity={omsInput[0]} handler={handlerOm} />
                <Input n={1} quantity={omsInput[1]} handler={handlerOm} />
                <Input n={2} quantity={omsInput[2]} handler={handlerOm} />
            </span>
        </div>
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
        </div>
        </>
    )
}
export default App;
