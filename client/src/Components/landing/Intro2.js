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
      console.log("In Intro2 now");
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
            <h1>Collaborate and Share</h1>
          </MovingComponent>
        )}
        <br />
        <h4>
          Connect with fellow map enthusiasts, and share your maps for the world
          to see.
        </h4>
      </div>
      <div className="landing_btm">
        {animationPlayed && <Lottie animationData={Discuss} style={style} />}
      </div>
    </div>
  );
};

export default Intro2;
