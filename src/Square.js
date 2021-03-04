const Square = ({ nx, ny, mid, angleVec, color, d }) => {
    let angle = angleVec[0];
    let axisVec = angleVec.length ? angleVec[1] : [0, 0, 1];
    return (
        <>
        <div className="square" style={{
            width :`${nx / 2}px`,
            height:`${nx / 2}px`,
            left: `${(nx / 2 - d[0]) + (mid ? mid[0] : 0)}px`,
            top:  `${(ny / 2 - d[1]) + (mid ? mid[1] : 0)}px`,
            // borderStyle: `${dashed ? "dashed" : "solid"}`
            borderColor: `black`,
            transform: `rotate3d(${axisVec[0]}, ${axisVec[1]}, ${axisVec[2]},${angle}rad)`,
            backgroundColor: `${mid && mid[2] < 0 ? "transparent" : color}`,
        }}/>
        </>
    )
}
export default Square;
