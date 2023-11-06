import React from "react";
import Lottie from "lottie-react";
import landingData1 from "../../assets/Lottie/Landing1.json";
import "./landingPage.css";
const Intro = () => {
  const style = {
    height: 600,
    width: 600,
  };
  return (
    <div>
      <div className="landing_intro intro">
        <div className="landing_right">
          <h2>Explore the World, Your Way</h2>
          <h1>Map Book</h1>
        </div>
        <div className="landing_left">
          <Lottie animationData={landingData1} style={style} />
        </div>
      </div>
    </div>
  );
};

export default Intro;
