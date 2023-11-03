import React from "react";
import Footer from "./Footer";
import Lottie from "lottie-react";
import landingData1 from "../../assets/Lottie/Landing1.json";
import Intro1 from "./Intro1";
import Intro2 from "./Intro2";
import Intro3 from "./Intro3";
import "./landingPage.css";
const style = {
  height: 500,
  width: 500,
};
const LandingPage = () => {
  return (
    <div className="landing_container">
      <div className="landing_intro_1">
        <div className="landing_right">
          <h4>Explore the World, Your Way</h4>
          <h2>Map Book</h2>
        </div>
        <div className="landing_left ">
          <Lottie animationData={landingData1} style={style} />
        </div>
      </div>
      <Intro1 />
      <br />
      <Intro2 />
      <br />
      <Intro3 />

      <br />
      <Footer />
    </div>
  );
};

export default LandingPage;
