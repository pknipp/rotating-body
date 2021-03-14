<<<<<<< HEAD
const Body = ({ nx, ny, angleVec, d }) => {
=======
import React from "react";
// import Line from "./Line";

const Body = ({ nx, ny, angleVec, d, dt, mids, degeneracies, running }) => {
>>>>>>> master
    let angle = angleVec ? angleVec[0] : 0;
    let axisVec = angleVec.length ? angleVec[1] : [0, 0, 1];
    let dmin = Math.min(...d)/2;
    return (
        <div className="body" style={{
<<<<<<< HEAD
            transform: `translateX(${nx/2}px) translateY(${ny/2}px) rotate3d(${axisVec[0]}, ${axisVec[1]}, ${-axisVec[2]}, ${angle}rad)`}}>
=======
            transform: `translateX(${nx/2}px) translateY(${ny/2}px) rotate3d(${axisVec[0]}, ${axisVec[1]}, ${-axisVec[2]},${angle}rad)`,
            transitionDuration: `${!running ? 0 : dt / 1000}s`
            }}>
>>>>>>> master
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
            {degeneracies[0] ? null :
            <>
            <div className="line" style={{left: `${-dmin}px`, width: `${2 * dmin}px`}} />
            <div className="line" style={{transform: `rotateX(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`}} />
            </>
            }
            {degeneracies[1] ? null :
            <>
            <div className="line" style={{transform: `rotateZ(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`}} />
            <div className="line" style={{transform: `rotateZ(90deg) rotateX(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`}} />
            </>
            }
            {degeneracies[2] ? null :
            <>
            <div className="line" style={{transform: `rotateY(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`}} />
            <div className="line" style={{transform: `rotateY(90deg) rotateX(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`}} />
            </>
            }
            {/* {mids.map((mid, i) => (
                    (degeneracies[Math.floor(i / 2)] || i > 3) ? null :
                        <Line xi={0*nx/2} yi={0*ny/2} xf={nx*(0.0+mid[0]/d[Math.floor(i/2)]/10)} yf={ny* (0.0+mid[1]/d[Math.floor(i/2)]/10)} dashed={true} />
            ))} */}
        </div>
    )
}
export default Body;
