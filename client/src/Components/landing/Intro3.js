import React, { useState, useEffect } from "react";
import "./landingPage.css";
import Lottie from "lottie-react";
import Network from "../../assets/Lottie/Network.json";
import Typewriter from "typewriter-effect";
import CustomModal from "../header/Modal";
import { useInView } from "react-intersection-observer";
const Intro3 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      setAnimationPlayed(true);
    } else {
      setAnimationPlayed(false);
    }
  }, [inView]);
  const style = {
    height: 600,
    width: 600,
  };

  const animationContainerStyle = {
    position: "relative",
    cursor: "pointer",
    transition: "transform 0.3s",
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMouseEnter = () => {
    const animationContainer = document.getElementById("animationContainer");
    animationContainer.style.transform = "scale(1.2)";

    const textElement = document.getElementById("animationText");
    textElement.style.display = "block";
  };

  const handleMouseLeave = () => {
    const animationContainer = document.getElementById("animationContainer");
    animationContainer.style.transform = "scale(1)";

    const textElement = document.getElementById("animationText");
    textElement.style.display = "none";
  };

  return (
    <div className="landing_intro_3 intro" ref={ref}>
      <div className="landing3_whole">
        {animationPlayed && (
          <div className="intro_maintext">
            <Typewriter
              onInit={(typewriter) => {
                typewriter.typeString("Ready to Get Started?").start();
              }}
            />
          </div>
        )}
        <div
          id="animationContainer"
          style={animationContainerStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="modal_container">
            <CustomModal isOpen={isModalOpen} closeModal={closeModal} />
          </div>
          <Lottie animationData={Network} style={style} onClick={openModal} />
          <div id="animationText" onClick={openModal}>
            Get Started
          </div>
        </div>
        <div style={{ textAlign: "center" }} className="intro_subtext">
          Your journey in mapping begins here!
          <br />
          Unleash your creativity and join a vibrant community of map
          enthusiasts.
        </div>
      </div>
    </div>
  );
};

export default Intro3;
