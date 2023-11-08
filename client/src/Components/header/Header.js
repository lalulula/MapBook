import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import "./header.css";
import "intersection-observer";
import CustomModal from "./Modal";
import defaultImg from "../../assets/img/defaultProfileImg.jpg";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

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
          <div>MapBook</div>
          <div className="header_begin">
            {user ? (
              <>
                <div onClick={() => navigate("/createmap")}>AddMaps</div>
                <div onClick={() => navigate("/social")}>Social</div>
                <div onClick={() => navigate("/mymap")}>MyMaps</div>
                <img
                  src={defaultImg}
                  alt="header_profile"
                  className="header_profile"
                  onClick={() => navigate("/profile")}
                />
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
