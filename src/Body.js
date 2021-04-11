import React from "react";
// import Line from "./Line";

const Body = ({ npx, angleVec, d, dt, mids, degeneracies, running }) => {
    let angle = angleVec ? angleVec[0] : 0;
    let axisVec = angleVec.length ? angleVec[1] : [0, 0, 1];
    let dmin = Math.min(...d)/2;
    return (
        <div className="body"
            style={{
                transform: `
                    translateX(${npx/2}px)
                    translateY(${npx/2}px)
                    rotate3d(${axisVec[0]}, ${axisVec[1]}, ${-axisVec[2]},${angle}rad)
                `,
                transitionDuration: `${!running ? 0 : dt / 1000}s`
            }}
        >
            <div className="side"
                style={{
                    width:`${2 * d[0]}px`, height:`${2 * d[1]}px`,
                    left: `${-d[0]}px`, top: `${-d[1]}px`,
                    transform: `translateZ(${d[2]}px)`, background: "rgba(100,30,30,0.8)",
                }}
            />
            <div className="side"
                style={{
                    width:`${2*d[0]}px`, height:`${2*d[1]}px`,
                    left: `${-d[0]}px`, top: `${-d[1]}px`,
                    transform: `translateZ(${-d[2]}px)`, background: "rgba(100,30,30,0.8)",
                }}
            />
            <div className="side"
                style={{
                    width:`${2 * d[2]}px`, height:`${2*d[1]}px`,
                    left: `${-d[2]}px`, top: `${-d[1]}px`,
                    transform: `rotateY(90deg) translateZ(${d[0]}px)`, background: "rgba(40,100,40,0.8)",
                }}
            />
            <div className="side"
                style={{
                    width:`${2*d[2]}px`, height:`${2*d[1]}px`,
                    left: `${-d[2]}px`, top: `${-d[1]}px`,
                    transform: `rotateY(-90deg) translateZ(${d[0]}px)`, background: "rgba(40,100,40,0.8)",
                }}
            />
            <div className="side"
                style={{
                    width:`${2*d[0]}px`, height:`${2*d[2]}px`,
                    left: `${-d[0]}px`, top: `${-d[2]}px`,
                    transform: `rotateX(90deg) translateZ(${d[1]}px)`, background: "rgba(50,50,100,0.8)",
                }}
            />
            <div className="side"
                style={{
                    width:`${2*d[0]}px`, height:`${2*d[2]}px`,
                    left: `${-d[0]}px`, top: `${-d[2]}px`,
                    transform: `rotateX(-90deg) translateZ(${d[1]}px)`, background: "rgba(50,50,100,0.8)",
                }}
            />
            {degeneracies[0] ? null
                :<>
                    <div className="line" style={{
                        left: `${-dmin}px`, width: `${2 * dmin}px`
                    }} />
                    <div className="line" style={{
                        transform: `rotateX(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`
                    }} />
                </>
            }
            {degeneracies[1] ? null
                :<>
                    <div className="line" style={{
                        transform: `rotateZ(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`
                    }} />
                    <div className="line" style={{
                        transform: `rotateZ(90deg) rotateX(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`
                    }} />
                </>
            }
            {degeneracies[2] ? null
                :<>
                    <div className="line" style={{
                        transform: `rotateY(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`
                    }} />
                    <div className="line" style={{
                        transform: `rotateY(90deg) rotateX(90deg)`, left: `${-dmin}px`, width: `${2 * dmin}px`
                    }} />
                </>
            }
        </div>
    )
}
export default Body;
