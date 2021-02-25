import React from "react";

const Dot = ({ x, y, d, dashed }) => {
    return (
        <div className="dot" style={{
            width:`${d}px`,
            height:`${d}px`,
            left: `${x - d / 2}px`,
            top: `${y - d / 2}px`,
            borderStyle: `${dashed ? "none" : "solid"}`
        }}/>
    )
}
export default Dot;
