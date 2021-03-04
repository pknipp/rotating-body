import React from "react";

const Input = ({n, quantity, handler}) => (
    <input
        type="text"
        onChange={handler}
        name={`${n}`}
        value={typeof(quantity) === "string" ? quantity : Math.round(1000 * quantity) / 1000}
    />
)
export default Input;
