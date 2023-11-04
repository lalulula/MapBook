import React from "react";
import Footer from "./Footer";
import Intro from "./Intro";
import Intro1 from "./Intro1";
import Intro2 from "./Intro2";
import Intro3 from "./Intro3";
import "./landingPage.css";

const LandingPage = () => {
  return (
    <div className="landing_container">
      <Intro />
      <Intro1 />
      <Intro2 />
      <Intro3 />
      <Footer />
    </div>
  );
};

export default LandingPage;
