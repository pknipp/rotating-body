import React from "react";

const Square = ({ nx, ny, ths }) => {
    return (
        <div className="square" style={{
            width :`${nx / 2}px`,
            height:`${nx / 2}px`,
            left: `${(nx / 4) * (1 - 0 * Math.sin(ths[0]))}px`,
            top:  `${(ny / 4) * (1 - 0 * Math.sin(ths[1] * Math.cos(ths[0])))}px`,
            // borderStyle: `${dashed ? "dashed" : "solid"}`
            borderStyle: "solid",
            transform: `rotate(${-ths[0]}rad) rotateX(${-ths[1]}rad) rotate(${-ths[2]}rad)`
        }}/>
    )
}
export default Square;
