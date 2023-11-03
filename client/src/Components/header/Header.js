import React, { useEffect, useState } from "react";
import "./header.css";
import "intersection-observer";

const Header = () => {
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");

    if (this.scrollY >= 80) header.classList.add("scroll_header");
    else header.classList.remove("scroll_header");
  });
  return (
    <div className="header">
      <div className="header_container">
        <div>MapBook</div>
        <div className="header_begin">
          <div>Get Started</div>
          <div>Login</div>
          <div>Register</div>
        </div>
      </div>
    </div>
  );
};
export default Header;
