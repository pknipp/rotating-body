import React, { useState } from "react";
import Dot from "./Dot";
import Slider from "./Slider";

const App = () => {
    const getSet = [useState(0), useState(0), useState(0)];
    const sliderHandler = e => {
        console.log(e.target.name);
        getSet[Number(e.target.name)][1](Number(e.target.value));
    }
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
    const d = 50;

    const xyzs = []
    for (let i = 0; i < 2; i++) {
        let x = (-1 + 2 * i) * (nx / 4);
        for (let j = 0; j < 2; j++) {
            let y = (-1 + 2 * j) * (ny / 4);
            for (let k = 0; k < 2; k++) {
                let z = (-1 + 2 * k) * (nz / 4)
                xyzs.push([x, y, z]);
            }
        }
    }
    let newXyzs = xyzs.map(xyz => mult1(mult2(mult2(zRot(getSet[0][0]), xRot(getSet[1][0])),zRot(getSet[2][0])), xyz));
    let zMin = Infinity;
    let iMin = -1;
    newXyzs.forEach((xyz, i) => {
        if (xyz[2] < zMin) {
            iMin = i;
            zMin = xyz[2];
        }
    });
    newXyzs[iMin][3] = true;
    return (
        <>
        <Slider n={0} maxVal={2 * Math.PI} stepSize={0.1} quantity={getSet[0][0]} handler={sliderHandler} />
        <Slider n={1} maxVal={2 * Math.PI} stepSize={0.1} quantity={getSet[1][0]} handler={sliderHandler} />
        <Slider n={2} maxVal={2 * Math.PI} stepSize={0.1} quantity={getSet[2][0]} handler={sliderHandler} />
        <div className="container" style={{height:`${ny}px`, width:`${nx}px`}}>
            {   xyzs.map(xyz => <Dot x={xyz[0] + nx / 2} y={xyz[1] + ny / 2} d={d} dashed={true} />)}
            {newXyzs.map(newXyz => <Dot x={newXyz[0] + nx / 2} y={newXyz[1] + ny / 2} d={d} dashed={newXyz[3]} />)}
        </div>
        </>
    )
}
export default App;
