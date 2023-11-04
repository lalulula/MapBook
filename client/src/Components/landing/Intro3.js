import React from "react";
import "./landingPage.css";
import Lottie from "lottie-react";
import Network from "../../assets/Lottie/Network.json";

const Intro3 = () => {
  const style = {
    height: 600,
    width: 600,
  };
  return (
    <div className="landing_intro_3">
      <h1>Collaborate and Share</h1>
      <h4>
        Connect with fellow map enthusiasts, and share your maps for the world
        to see.
      </h4>
      <Lottie animationData={Network} style={style} />
    </div>
  );
};

export default Intro3;
