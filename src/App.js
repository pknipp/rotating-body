import React from "react";
import Dot from "./Dot";

const App = () => {
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

    const nx = 1400;
    const ny = 700;
    const d = 20;
    const th1 = 0.2;
    const th2 = 0.4;
    const th3 = 0.6;

    const mat1 = zRot(th1);
    const mat2 = xRot(th2);
    const mat3 = zRot(th3);

    const xys = []
    for (let i = 0; i < 2; i++) {
        let x = (-1 + 2 * i) * (nx / 4);
        for (let j = 0; j < 2; j++) {
            let y = (-1 + 2 * j) * (ny / 4);
            xys.push([x, y, 0]);
        }
    }
    return (
        <div className="container" style={{height:`${ny}px`, width:`${nx}px`}}>
            {xys.map(xy => <Dot x={xy[0] + nx / 2} y={xy[1] + ny / 2} z={xy[2]} d={d} />)}
            {xys.map(xy => {
                let newXy = mult1(mat2, xy);
                return <Dot x={newXy[0] + nx / 2} y={newXy[1] + ny / 2} z={newXy[2]} d={d} dashed={true} />
            })}
        </div>
    )
}
export default App;
