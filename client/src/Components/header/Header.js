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

  useEffect(() => {
    console.log(isAuthenticated);
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");

    if (this.scrollY >= 80) header.classList.add("scroll_header");
    else header.classList.remove("scroll_header");
  });

  return (
    <>
      <div className="header">
        <div className="header_container">
          <div onClick={() => navigate("/mainpage")}>MapBook</div>
          <div className="header_begin">
            {isAuthenticated ? (
              <>
                <div onClick={() => navigate("/createmap")}>CreateMaps</div>
                <div onClick={() => navigate("/socialpage")}>Social</div>
                <div onClick={() => navigate("/mymap")}>MyMaps</div>
                <div>
                  {/* <div onClick={() => navigate("/profile")}> */}
                  <img
                    src={defaultImg}
                    alt="header_profile"
                    className="header_profile"
                    onClick={() => navigate("/profile")}
                  />
                </div>
              </>
            ) : (
              <>
                {" "}
                <div className="modal_container">
                  <CustomModal isOpen={isModalOpen} closeModal={closeModal} />
                </div>
                <div onClick={openModal}>Get Started</div>
                <div onClick={() => navigate("/login")}>Login</div>
                <div onClick={() => navigate("/register")}>Register</div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
