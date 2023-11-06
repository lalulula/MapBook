import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./header.css";
import "intersection-observer";
import CustomModal from './Modal';


const Header = () => {
  const navigate = useNavigate();
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
          <div onClick={() => navigate("/")}>MapBook</div>
          <div className="header_begin">
            <div className="modal_container">
              <CustomModal isOpen={isModalOpen} closeModal={closeModal} />
            </div>
            <div onClick={openModal}>Get Started</div>
            <div onClick={() => navigate("/login")}>Login</div>
            <div onClick={() => navigate("/register")}>Register</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
