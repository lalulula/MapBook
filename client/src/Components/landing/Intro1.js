import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import landingAni1 from "../../assets/Lottie/SocialInteraction.json";
import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";
import "./landingPage.css";
import { useInView } from "react-intersection-observer";

const Intro1 = () => {
  const [replay, setReplay] = useState(true);
  const [animationPlayed, setAnimationPlayed] = useState(true);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      // console.log("in intro 1");
      setAnimationPlayed(true);
    } else {
      setAnimationPlayed(false);
    }
  }, [inView]);
  const placeholderText = [
    { type: "heading1", text: "Design Your World" },
    {
      type: "heading2",
      text: "Craft maps that tell your story, with endless possibilities for personalization.",
    },
  ];

  const container = {
    visible: {
      transition: {
        staggerChildren: 0.025,
      },
    },
  };

  const handleReplay = () => {
    setReplay(!replay);
    setTimeout(() => {
      setReplay(true);
    }, 300);
  };

  const style = {
    height: 700,
    width: 900,
  };

  return (
    <div className="landing_intro_1 intro" ref={ref}>
      {animationPlayed && (
        <motion.div
          className="landing_intro_1 intro"
          initial="hidden"
          animate={replay ? "visible" : "hidden"}
          variants={container}
        >
          <div className="landing_left">
            <Lottie animationData={landingAni1} style={style} />
          </div>
          <div className="landing_right">
            {placeholderText.map((item, index) => (
              <div className={index === 0 ? "intro_maintext" : "intro_subtext"}>
                <AnimatedText {...item} key={index} />
              </div>
            ))}
            <br />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Intro1;
