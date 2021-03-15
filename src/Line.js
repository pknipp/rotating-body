import React, { useState } from "react";

const Line = ({ npx, r, angle, dashed, dt }) => {
    return (
        <div className="line" style={{
            width:`${r}px`,
            left: `${npx / 2 - r / 2}px`,
            top: `${npx / 2}px`,
            transform: `rotate(${angle * 180 / Math.PI}deg) translateX(${r / 2}px)`,
            borderTopStyle: `${dashed ? "dashed" : "solid"}`,
            zIndex: 1,
            transitionDuration: `${dt / 1000}s`
        }}/>
    )
}
export default Line;
