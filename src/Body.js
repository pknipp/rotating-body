const Body = ({ nx, ny, angleVec, d }) => {
    let angle = angleVec ? angleVec[0] : 0;
    let axisVec = angleVec.length ? angleVec[1] : [0, 0, 1];
    return (
        <div className="body" style={{
            transform: `translateX(${nx/2}px) translateY(${ny/2}px) rotate3d(${axisVec[0]}, ${-axisVec[1]}, ${axisVec[2]}, ${angle}rad)`}}>
            <div className="side"  style={{transform: `rotateY(0deg) translateZ(${d[2]}px)`, background: "rgba(100,30,30,0.8)",
                left: `${-d[0]}px`, top: `${-d[1]}px`, width:`${2 * d[0]}px`, height:`${2 * d[1]}px`
            }}/>
            <div className="side" style={{transform: `rotateY(180deg) translateZ(${d[2]}px)`, background: "rgba(100,30,30,0.8)",
                left: `${-d[0]}px`, top: `${-d[1]}px`, width:`${2*d[0]}px`, height:`${2*d[1]}px`
            }}/>
            <div className="side" style={{transform: `rotateY(90deg) translateZ(${d[0]}px)`, background: "rgba(40,100,40,0.8)",
                left: `${-d[2]}px`, top: `${-d[1]}px`,     width:`${2 * d[2]}px`, height:`${2*d[1]}px`
            }}/>
            <div className="side" style={{transform: `rotateY(-90deg) translateZ(${d[0]}px)`, background: "rgba(40,100,40,0.8)",
                left: `${-d[2]}px`, top: `${-d[1]}px`, width:`${2*d[2]}px`, height:`${2*d[1]}px`
            }}/>
            <div className="side" style={{transform: `rotateX(90deg) translateZ(${d[1]}px)`, background: "rgba(50,50,100,0.8)",
                left: `${-d[0]}px`, top: `${-d[2]}px`, width:`${2*d[0]}px`, height:`${2*d[2]}px`
            }}/>
            <div className="side" style={{transform: `rotateX(-90deg) translateZ(${d[1]}px)`, background: "rgba(50,50,100,0.8)",
                left: `${-d[0]}px`, top: `${-d[2]}px`, width:`${2*d[0]}px`, height:`${2*d[2]}px`
            }}/>
        </div>
    )
}
export default Body;
