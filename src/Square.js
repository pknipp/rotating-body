const Square = ({ nx, ny, mid, anglevec }) => {
    let angle = anglevec[0];
    let axis = anglevec[1];
    return (
        <>
        <div>{angle}</div>
        <div>{axis}</div>
        <div className="square" style={{
            width :`${nx / 2}px`,
            height:`${nx / 2}px`,
            left: `${(nx / 4) + mid ? mid[0] : 0}px`,
            top:  `${(ny / 4) + mid ? mid[1] : 0}px`,
            // borderStyle: `${dashed ? "dashed" : "solid"}`
            borderStyle: "solid",
            transform: `rotate3d(${axis[0]},${axis[1]}, ${axis[2]},${-angle}rad)`
            // transform: `rotate(${-ths[0]}rad) rotateX(${-ths[1]}rad) rotate(${-ths[2]}rad)`
            // transform: `rotate(${-ths[0]}rad) rotateX(${-ths[1]}rad)`
        }}/>
        </>
    )
}
export default Square;
