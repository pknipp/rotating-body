const Square = ({ nx, ny, mids, angleVec, color, d, i }) => {
    let is = [[2, 1], [0, 2], [0, 1]][i % 3];
    let angle = angleVec[0];
    let axisVec = angleVec.length ? angleVec[1] : [0, 0, 1];
    return (
        <>
        <div className="square" style={{
            width :`${2 * d[is[0]]}px`,
            height:`${2 * d[is[1]]}px`,
            left: `${(nx / 2 - d[is[0]]) + (mids[i] ? mids[i][0] : 0)}px`,
            top:  `${(ny / 2 - d[is[1]]) + (mids[i] ? mids[i][1] : 0)}px`,
            // borderStyle: `${dashed ? "dashed" : "solid"}`
            borderColor: `black`,
            transform: `rotate3d(${axisVec[0]}, ${axisVec[1]}, ${axisVec[2]},${angle}rad)`,
            backgroundColor: `${mids[i] && mids[i][2] < 0 ? "transparent" : color}`,
        }}/>
        </>
    )
}
export default Square;
