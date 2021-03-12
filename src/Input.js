import React from "react";

const Input = ({name, quantity, handler}) => (
    <>
    <input
        type="text"
        onChange={handler}
        name={`${name}`}
        size="5"
        value={typeof(quantity) === "string" ? quantity : Math.round(1000 * quantity) / 1000}
    />
    &nbsp;
    </>
)
export default Input;
