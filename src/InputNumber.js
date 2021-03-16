import React from "react";

const InputNumber = ({name, quantity, handler}) => (
    <>
    <input
        type="number"
        onChange={handler}
        name={`${name}`}
        step="0.1"
        value={typeof(quantity) === "string" ? quantity : Math.round(1000 * quantity) / 1000}
    />
    &nbsp;
    </>
)
export default InputNumber;
