import React, { useState } from "react";

const Line = ({ nx, ny, r, angle, dashed, dt }) => {
    return (
        <div className="line" style={{
            width:`${r}px`,
            left: `${nx / 2 - r / 2}px`,
            top: `${ny / 2}px`,
            transform: `rotate(${angle * 180 / Math.PI}deg) translateX(${r / 2}px)`,
            borderTopStyle: `${dashed ? "dashed" : "solid"}`,
            zIndex: 1,
            transitionDuration: `${dt / 1000}s`
        }}/>
    )
}
export default Line;
