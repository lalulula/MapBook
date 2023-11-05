import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./header.css";
import "intersection-observer";
import LandingPage from "../landing/LandingPage";
import Login from "../login/Login";
import Register from "../register/Register";

const Header = () => {
  const navigate = useNavigate();

  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");

    if (this.scrollY >= 80) header.classList.add("scroll_header");
    else header.classList.remove("scroll_header");
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
      <div className="header">
        <div className="header_container">
          <div onClick={() => navigate("/")}>MapBook</div>
          <div className="header_begin">
            <div>Get Started</div>
            <div onClick={() => navigate("/login")}>Login</div>
            <div onClick={() => navigate("/register")}>Register</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
