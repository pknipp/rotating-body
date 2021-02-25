import React from "react";

const Slider = ({name, maxVal, stepSize, quantity, handler}) => (
    <>
    {name}
    <input
        type="range"
        onChange={handler}
        name={`${name}`}
        min="0"
        max={`${maxVal}`}
        step={`${stepSize}`}
        value={quantity}
    />
    </>
)
export default Slider;
