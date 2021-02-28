const Square = ({ nx, ny, mid, ths }) => {
    return (
        <div className="square" style={{
            width :`${nx / 2}px`,
            height:`${nx / 2}px`,
            left: `${(nx / 4)}px`,
            top:  `${(ny / 4)}px`,
            // borderStyle: `${dashed ? "dashed" : "solid"}`
            borderStyle: "solid",
            // transform: `rotate(${-ths[0]}rad) rotateX(${-ths[1]}rad) rotate(${-ths[2]}rad)`
            transform: `rotate(${-ths[0]}rad) rotateX(${-ths[1]}rad)`
        }}/>
    )
}
export default Square;
