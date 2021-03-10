const Body = ({ nx, ny, angleVec, d }) => {
    let is = [[2, 1], [0, 2], [0, 1]];
    let angle = angleVec ? angleVec[0] : 0;
    let axisVec = angleVec ? angleVec[1] : [0, 0, 1];
    return (
        <div className="body" style={{
            position: "relative",
            // width :`${2 * d[is[0]]}px`,
            // height:`${2 * d[is[1]]}px`,
            left: `${nx /2}`,
            top: `${ny / 2}`,
            // left: `${(nx / 2 - d[is[0]])}px`,
            // top:  `${(ny / 2 - d[is[0]])}px`,
            // left: `${nx / 2}`,
            // top: `${ny / 2}`,
            transform: `rotate3d(${axisVec[0]}, ${axisVec[1]}, ${-axisVec[2]},${angle}rad)`}}>
            <div className="side"  style={{transform: `rotateY(0deg) translateZ(${d[2]}px)`, width:`${2 * d[0]}px`, height:`${2 * d[1]}px`}}/>
            <div className="side" style={{transform: `rotateY(180deg) translateZ(${d[2]}px)`, width:`${2*d[0]}px`, height:`${2*d[1]}px`}}/>

            <div className="side" style={{transform: `rotateY(90deg) translateZ(${d[0]}px)`, left: `${d[0] - d[2]}px`, width:`${2 * d[2]}px`, height:`${2*d[1]}px`}}/>
            <div className="side" style={{transform: `rotateY(-90deg) translateZ(${d[0]}px)`, left: `${d[0] - d[2]}px`, width:`${2*d[2]}px`, height:`${2*d[1]}px`}}/>

            <div className="side" style={{transform: `rotateX(90deg) translateZ(${d[1]}px)`, top: `${d[1] - d[2]}px`, width:`${2*d[0]}px`, height:`${2*d[2]}px`}}/>
            <div className="side" style={{transform: `rotateX(-90deg) translateZ(${d[1]}px)`, top: `${d[1] - d[2]}px`, width:`${2*d[0]}px`, height:`${2*d[2]}px`}}/>
        </div>
    )
}
export default Body;
