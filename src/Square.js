import React from "react";

const Square = ({ nx, ny }) => {
    return (
        <div className="square" style={{
            width :`${nx / 2}px`,
            height:`${nx / 2}px`,
            left: `${nx / 4}px`,
            top:  `${ny / 4}px`,
            // borderStyle: `${dashed ? "dashed" : "solid"}`
            borderStyle: "solid"
        }}/>
    )
}
export default Square;
