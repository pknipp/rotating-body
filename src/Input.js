import React from "react";

const Input = ({n, quantity, handler}) => (
    <input
        type="text"
        onChange={handler}
        name={`${n}`}
        value={Math.round(1000 * quantity) / 1000}
    />
)
export default Input;
