const Square = ({ nx, ny, mids, angleVec, color, d, i }) => {
    let is = [[2, 1], [0, 2], [0, 1]][Math.floor(i / 2)];
    let angle = angleVec[0];
    let axisVec = angleVec.length ? angleVec[1] : [0, 0, 1];
    return (i < 0 ? null :
        <div className="square" style={{
            width :`${2 * d[is[0]]}px`,
            height:`${2 * d[is[1]]}px`,
            left: `${(nx / 2 - d[is[0]]) - (mids[i] ? mids[i][0] : 0)}px`,
            top:  `${(ny / 2 - d[is[1]]) - (mids[i] ? mids[i][1] : 0)}px`,
            borderColor: `black`,
            // negative sign on angle causes L to always point in same direction (good thing)
            transform: `rotate3d(${axisVec[0]}, ${axisVec[1]}, ${-axisVec[2]},${-angle}rad)`,
            backgroundColor: `${mids[i] && mids[i][2] > 0 ? "transparent" : color}`,
        }}/>
    )
}
export default Square;
