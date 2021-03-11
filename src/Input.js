import React from "react";

const Input = ({name, quantity, handler}) => (
    <input
        type="text"
        onChange={handler}
        name={`${name}`}
        value={typeof(quantity) === "string" ? quantity : Math.round(1000 * quantity) / 1000}
    />
)
export default Input;
