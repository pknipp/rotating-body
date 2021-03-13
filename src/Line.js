import React, { useState } from "react";

const Line = ({ xi, yi, xf, yf, dashed, dt }) => {
    const [angle, setAngle] = useState(0);
    // The following two lines represent the two sides of a right triangle.
    const dx = xf - xi;
    const dy = yf - yi;

    // Pythagorean theorem
    const r = Math.sqrt(dx * dx + dy * dy);
    // "TOA" part of "SOHCAHTOA"
    let newAngle = Math.atan2(dy, dx);
    let nAng = (newAngle - angle) / 2 / Math.PI;
    if (Math.abs(Math.round(nAng) - nAng) < 0.1) newAngle -= Math.round(nAng) * 2 * Math.PI;
    setAngle(newAngle);
    // return null;
    return (
        <div className="line" style={{
            width:`${r}px`,
            left: `${xi - r / 2}px`,
            top: `${yi}px`,
            transform: `rotate(${newAngle * 180 / Math.PI}deg) translateX(${r / 2}px)`,
            borderTopStyle: `${dashed ? "dashed" : "solid"}`,
            zIndex: 1,
            transitionDuration: `${dt / 1000}s`
        }}/>
    )
}
export default Line;
