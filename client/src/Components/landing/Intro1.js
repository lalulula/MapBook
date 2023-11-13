import React from "react";
import "./landingPage.css";
import Lottie from "lottie-react";
import landingAni1 from "../../assets/Lottie/landingAni1.json";

const Intro1 = () => {
  const style = {
    height: 600,
    width: 600,
  };
  return (
    <div className="landing_intro_1 intro">
      <div className="landing_right">
        <Lottie animationData={landingAni1} style={style} />
      </div>
      <div className="landing_left">
        <h4>
          Craft maps that tell your story, with endless possibilities for
          personalization.
        </h4>
        <br />
        <h1>Design Your World</h1>
      </div>
    </div>
  );
};

export default Intro1;
