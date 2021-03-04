const Square = ({ nx, ny, mid, angle, axisVec, flip, index }) => {
    let colors = ["red", "blue", "green"];
    return (
        <>
        <div className="square" style={{
            width :`${nx / 2}px`,
            height:`${nx / 2}px`,
            left: `${(nx / 4) + (mid ? mid[0] : 0)}px`,
            top:  `${(ny / 4) + (mid ? mid[1] : 0)}px`,
            // borderStyle: `${dashed ? "dashed" : "solid"}`
            borderColor: `${flip ? "green" : "red"}`,
            transform: `rotate3d(${axisVec[0]}, ${axisVec[1]}, ${axisVec[2]},${angle}rad)`,
            backgroundColor: `${mid && mid[2] < 0 ? "transparent" : flip ? "green" : "red"}`,
        }}/>
        </>
    )
}
export default Square;
