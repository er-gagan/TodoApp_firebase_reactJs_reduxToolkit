import React, { useEffect } from 'react';
import './NoMatchPage.scss';
import img404 from './Mirror.png';
import rightAnimate from './right-edges.png'

const NoMatchPage = () => {
    useEffect(() => {
        document.getElementById("clickBtn").addEventListener("click", () => {
            window.location.assign(window.location.origin)
        })
    }, []);
    return (
        <div className="row">
            <div className="col-md-6">
                <img style={{ width: "100%", height: "100%" }} src={img404} alt="404Image" />
            </div>

            <aside className="col-md-6" style={{ backgroundImage: `url(${rightAnimate})`, backgroundRepeat: "no-repeat", backgroundSize: "20px 100%", backgroundPosition: "top left" }}>
                <div id="myText" style={{ backgroundColor: "#383838", marginLeft: "1%", display: "block", width: "100%", height: "100%" }}>
                    <div>
                        <h1 style={{ fontFamily: "Fontdiner Swanky, cursive" }}>Sorry!</h1>
                        <p>
                            Either you aren't cool enough to visit this page or it doesn't exist<br /> <em>. . . like your social life.</em>
                        </p>
                        <button id="clickBtn">You can go now!</button>
                    </div>
                </div>
            </aside>
        </div>
    )
}

export default NoMatchPage
