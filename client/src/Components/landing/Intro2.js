import React from "react";
import "./landingPage.css";
import Lottie from "lottie-react";
import Discuss from "../../assets/Lottie/Discuss.json";

const Intro2 = () => {
  const style = {
    height: 600,
    width: 600,
  };
  return (
    <div className="landing_intro_2">
      <h1>Collaborate and Share</h1>
      <h4>
        Connect with fellow map enthusiasts, and share your maps for the world
        to see.
      </h4>
      <Lottie animationData={Discuss} style={style} />
    </div>
  );
};

export default Intro2;
