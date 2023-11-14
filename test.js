import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./header.css";
import "intersection-observer";
import CustomModal from "./Modal";
import defaultImg from "../../assets/img/defaultProfileImg.jpg";

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const route = window.location.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");

    if (this.scrollY >= 50) header.classList.add("scroll_header");
    else header.classList.remove("scroll_header");
  });
  return (
    <>
      <div className="header">
        <div className="header_container">
          <div
            onClick={() => {
              isAuthenticated ? navigate("/mainpage") : navigate("/");
            }}
          >
            MapBook
          </div>
          <div className="header_begin">
            {isAuthenticated ? (
              <>
                {/* Case 1)When user is logged in  */}
                <div onClick={() => navigate("/createmap")}>CreateMaps</div>
                <div onClick={() => navigate("/socialpage")}>Social</div>
                <div onClick={() => navigate("/mymap")}>MyMaps</div>
                <div>
                  <img
                    src={defaultImg}
                    alt="header_profile"
                    className="header_profile"
                    onClick={() => navigate("/profile")}
                  />
                </div>
              </>
            ) : route === "/" ? (
              <>
                {/* Case 3)Landing Page  */}
                <div className="modal_container">
                  <CustomModal isOpen={isModalOpen} closeModal={closeModal} />
                </div>
                <div onClick={openModal}>Get Started</div>
                <div onClick={() => navigate("/login")}>Login</div>
                <div onClick={() => navigate("/register")}>Register</div>
              </>
            ) : (
              <>
                {/* Case 2)When continuing as guest user  */}
                <div
                  onClick={() =>
                    window.alert("You need to Register to continue!")
                  }
                >
                  CreateMaps
                </div>
                <div onClick={() => navigate("/socialpage")}>Social</div>
                <div
                  onClick={() =>
                    window.alert("You need to Register to continue!")
                  }
                >
                  MyMaps
                </div>
                <div onClick={() => navigate("/register")}>Register</div>
                {/* <div>
                <img
                  src={defaultImg}
                  alt="header_profile"
                  className="header_profile"
                  onClick={() => navigate("/profile")}
                />
              </div> */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
