import React, { useEffect, useState } from "react";
import "./landingPage.css";
import Lottie from "lottie-react";
import Discuss from "../../assets/Lottie/Discuss.json";
import MovingComponent from "react-moving-text";
import { useInView } from "react-intersection-observer";

const Intro2 = () => {
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const style = {
    height: 600,
    width: 600,
  };

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      setAnimationPlayed(true);
    } else {
      setAnimationPlayed(false);
    }
  }, [inView]);

  return (
    <div className="landing_intro_2 intro" ref={ref}>
      <div className="landing_top">
        {animationPlayed && (
          <MovingComponent
            type="swing"
            duration="1000ms"
            delay="0s"
            direction="normal"
            timing="ease"
            iteration="1"
            fillMode="none"
          >
            <div className="intro_maintext">Collaborate and Share</div>
          </MovingComponent>
        )}
        <br />
        <div className="intro_subtext">
          Connect with fellow map enthusiasts, and share your maps for the world
          to see.
        </div>
      </div>
      <div className="landing_btm">
        {animationPlayed && <Lottie animationData={Discuss} style={style} />}
      </div>
    </div>
  );
};

export default Intro2;
