import React from "react";
import Lottie from "lottie-react";
import landingData1 from "../../assets/Lottie/Landing1.json";
import "./landingPage.css";
import { motion } from "framer-motion";

const Intro = () => {
  const style = {
    height: 600,
    width: 600,
  };

  return (
    <div>
      <div className="landing_intro">
        <div className="landing_right">
          <motion.div
            className="intro_subtext"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 10, y: 0 }}
            transition={{ duration: 3 }}
          >
            Explore the World, Your Way
          </motion.div>
          <motion.div
            className="intro_maintext"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 3 }}
          >
            Map Book
          </motion.div>
        </div>
        <div className="landing_left">
          <Lottie animationData={landingData1} style={style} />
        </div>
      </div>
    </div>
  );
};

export default Intro;
