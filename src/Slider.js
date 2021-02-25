import React from "react";

const Slider = ({n, maxVal, stepSize, quantity, handler}) => (
    <input
        type="range"
        onChange={handler}
        name={`${n}`}
        min="0"
        max={`${maxVal}`}
        step={`${stepSize}`}
        value={quantity}
    />
)
export default Slider;
