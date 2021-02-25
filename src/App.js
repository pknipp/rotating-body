import React, { useState } from "react";
import Dot from "./Dot";
import Slider from "./Slider";

const App = () => {
    const getSet = {th0: useState(0), th1: useState(0), th2: useState(0)};
    // const {th1, th2, th3} =
    const sliderHandler = e => getSet[e.target.name][1](Number(e.target.value));
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
        // console.log("arr = ", arr);
        console.log("vec = ", vec);
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


    const nx = 1400;
    const ny = 700;
    const d = 50;

    // const mat0 = zRot(th0);
    // const mat1 = xRot(th1);
    // const mat2 = zRot(th2);

    const xyzs = []
    for (let i = 0; i < 2; i++) {
        let x = (-1 + 2 * i) * (nx / 4);
        for (let j = 0; j < 2; j++) {
            let y = (-1 + 2 * j) * (ny / 4);
            xyzs.push([x, y, 0]);
        }
    }
    return (
        <>
        <Slider name={"th0"} maxVal={2 * Math.PI} stepSize={0.1} quantity={getSet.th0[0]} handler={sliderHandler} />
        <Slider name={"th1"} maxVal={2 * Math.PI} stepSize={0.1} quantity={getSet.th1[0]} handler={sliderHandler} />
        <Slider name={"th2"} maxVal={2 * Math.PI} stepSize={0.1} quantity={getSet.th2[0]} handler={sliderHandler} />
        <div className="container" style={{height:`${ny}px`, width:`${nx}px`}}>
            {xyzs.map(xyz => <Dot x={xyz[0] + nx / 2} y={xyz[1] + ny / 2} z={xyz[2]} d={d} />)}
            {xyzs.map(xyz => {
                // console.log("Inside return says that xyz = ", xyz);
                let newXyz = mult1(mult2(mult2(zRot(getSet.th0[0]), xRot(getSet.th1[0])),zRot(getSet.th2[0])), xyz);
                // let newXy = mult1(zRot(getSet.th0[0]), xy);
                return <Dot x={newXyz[0] + nx / 2} y={newXyz[1] + ny / 2} z={newXyz[2]} d={d} dashed={true} />
            })}
        </div>
        </>
    )
}
export default App;
