const Body = ({ nx, ny, angleVec }) => {
    let is = [[2, 1], [0, 2], [0, 1]][Math.floor(i / 2)];
    let angle = angleVec[0];
    let axisVec = angleVec.length ? angleVec[1] : [0, 0, 1];
    return (
        <div className="body" style={{
            // width :`${2 * d[is[0]]}px`,
            // height:`${2 * d[is[1]]}px`,
            // left: `${(nx / 2 - d[is[0]])}px`,
            // top:  `${(ny / 2 - d[is[0]])}px`,
            left: `${nx / 2}`,
            top: `${ny / 2}`,
            // negative sign on angle causes L to point always in same direction (good thing)
            transform: `rotate3d(${axisVec[0]}, ${axisVec[1]}, ${-axisVec[2]},${angle}rad)`}}>
            <div class="side front" />
            <div class="side back" />
            <div class="side right" />
            <div class="side left" />
            <div class="side top" />
            <div class="side bottom" />
        }}/>
    )
}
export default Body;
