import React from "react";

const Input = ({n, quantity, handler}) => (
    <input
        type="number"
        onChange={handler}
        name={`${n}`}
        value={quantity}
    />
)
export default Input;
