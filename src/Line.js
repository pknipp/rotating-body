import React from "react";

const Line = ({ xi, yi, xf, yf, dashed }) => {
    // The following two lines represent the two sides of a right triangle.
    const dx = xf - xi;
    const dy = yf - yi;

    // Pythagorean theorem
    const r = Math.sqrt(dx * dx + dy * dy);
    // "TOA" part of "SOHCAHTOA"
    let angle = Math.atan2(dy, dx);
    return (
        <div className="line" style={{
            width:`${r}px`,
            left: `${xi - r / 2}px`,
            top: `${yi}px`,
            transform: `rotate(${angle * 180 / Math.PI}deg) translateX(${r / 2}px)`,
            borderTopStyle: `${dashed ? "dashed" : "dotted"}`,
        }}/>
    )
}
export default Line;
