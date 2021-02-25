import React, { useState, useEffect } from "react";
import Dot from "./Dot";
import Input from "./Input";
import Line from "./Line";

const App = () => {
    const getSetTh = [useState(0.1), useState(0.2), useState(0.3)];
    const getSetOm = [useState(0.4), useState(0.5), useState(0.6)];
    const [xyzs0, setXyzs0] = useState([]);
    const [xyzs, setXyzs] = useState([]);
    const [running, setRunning] = useState(false);
    const [time, setTime] = useState(0);
    const handlerTh = e => getSetTh[Number(e.target.name)][1](Number(e.target.value));
    const handlerOm = e => getSetOm[Number(e.target.name)][1](Number(e.target.value));

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

    const nx = 1200;
    const ny = 700;
    const nz = ny;
    const d = 20;
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
        let newXyzs = JSON.parse(JSON.stringify(firstXyzs));
        firstXyzs.forEach((xyz, i) => {
            newXyzs[i][0] = mult1(mult2(mult2(zRot(getSetTh[0][0]), xRot(getSetTh[1][0])),zRot(getSetTh[2][0])), xyz[0]);
        });
        setXyzs(newXyzs);
    }, []);

    // let newXyzs = xyzs.map(xyz => {
    //     xyz[0] = mult1(mult2(mult2(zRot(getSetTh[0][0]), xRot(getSetTh[1][0])),zRot(getSetTh[2][0])), xyz[0]);
    //     return xyz;
    // });
    // let zMin = Infinity;
    // let iMin = -1;
    // newXyzs.forEach((xyz, i) => {
    //     if (xyz[0][2] < zMin) {
    //         iMin = i;
    //         zMin = xyz[0][2];
    //     }
    // });
    // console.log(iMin, zMin);
    // newXyzs[iMin][2] = true;

    useEffect(() => {
        let interval = null;
        if (running) {
            interval = setInterval(() => {
                setTime(time + 0.1);
                getSetTh[0][1](getSetTh[0][0] + getSetOm[0][0] * 0.1);
                getSetTh[2][1](getSetTh[2][0] + getSetOm[2][0] * 0.1);
                let newXyzs = JSON.parse(JSON.stringify(xyzs0));
                xyzs0.forEach((xyz, i) => {
                    newXyzs[i][0] = mult1(mult2(mult2(zRot(getSetTh[0][0]), xRot(getSetTh[1][0])),zRot(getSetTh[2][0])), xyz[0]);
                });
                // console.log(newXyzs[0][0])
                setXyzs(newXyzs);
            }, 100);
        } else if (!running && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
      }, [running, time, xyzs0]);

    const toggle = () => setRunning(!running);
    // debugger;

    return (
        <>
        <button onClick={toggle}>{running ? "Stop" : "Start"}</button>
        <button onClick={() => setTime(0)}>Reset</button>
        Time = {time.toFixed(2)} s
        <div>
            <span>
                Initial angles:
                <Input n={0} quantity={getSetTh[0][0]} handler={handlerTh} />
                <Input n={1} quantity={getSetTh[1][0]} handler={handlerTh} />
                <Input n={2} quantity={getSetTh[2][0]} handler={handlerTh} />
            </span>
        </div>
        <div>
            <span>
                Angular speeds:
                <Input n={0} quantity={getSetOm[0][0]} handler={handlerOm} />
                <Input n={1} quantity={getSetOm[1][0]} handler={handlerOm} />
                <Input n={2} quantity={getSetOm[2][0]} handler={handlerOm} />
            </span>
        </div>
        <div className="container" style={{height:`${ny}px`, width:`${nx}px`}}>
            {/* {   xyzs.map(xyz => <Dot x={xyz[0] + nx / 2} y={xyz[1] + ny / 2} d={d} dashed={true} />)} */}
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
                    // console.log(d);
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
