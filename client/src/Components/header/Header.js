import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./header.css";
import "intersection-observer";
import CustomModal from "./Modal";
import defaultProfileImg from "../../assets/img/defaultProfileImg.jpg"

export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const route = window.location.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profileImgPath = useSelector((state) => state.user.user.profile_img)

  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const userId = useSelector((state) => state.user.id);

  const [user, setUser] = useState(null);

  const getUser = async () => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${isAuth}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, [user]);

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

  if (!user) {
    return (
      <>
        <div className="header">
          <div className="header_container">
            <div
              onClick={() => {
                isAuthenticated ? navigate("/mainpage") : navigate("/");
              }}
            >
              <h3>MapBook</h3>
            </div>
            <div className="header_begin">
              {isAuthenticated ? (
                <>
                  {/* Case 1)When user is logged in  */}
                  <div onClick={() => navigate("/createmap")}>
                    <h4>CreateMaps</h4>
                  </div>
                  <div onClick={() => navigate("/socialpage")}>
                    <h4>Social</h4>
                  </div>
                  <div onClick={() => navigate("/mymap")}>
                    <h4>MyMaps</h4>
                  </div>
                  <div>
                    <img
                      src={profileImgPath ? profileImgPath : defaultProfileImg}
                      alt="header_profile"
                      className="header_profile"
                      onClick={() => navigate("/profile")}
                    />
                  </div>
                </>
              ) : route === "/" ? (
                <>
                  {/* Case 2) User not authenticated*/}
                  <div className="modal_container">
                    <CustomModal isOpen={isModalOpen} closeModal={closeModal} />
                  </div>
                  <div onClick={openModal}>
                    <h4>Get Started</h4>
                  </div>
                  <div onClick={() => navigate("/login")}>
                    <h4>Login</h4>
                  </div>
                  <div onClick={() => navigate("/register")}>
                    <h4>Register</h4>
                  </div>
                </>
              ) : route === "/login" || route === "/register" ? (
                <>
                  <div onClick={() => navigate("/login")}>
                    <h4>Login</h4>
                  </div>
                  <div onClick={() => navigate("/register")}>
                    <h4>Register</h4>
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() =>
                      window.alert("You need to Register to continue!")
                    }
                  >
                    <h4>CreateMaps</h4>
                  </div>
                  <div onClick={() => navigate("/socialpage")}>
                    <h4>Social</h4>
                  </div>
                  <div
                    onClick={() =>
                      window.alert("You need to Register to continue!")
                    }
                  >
                    <h4>MyMaps</h4>
                  </div>
                  <div onClick={() => navigate("/register")}>
                    <h4>Register</h4>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="header">
          <div className="header_container">
            <div
              onClick={() => {
                isAuthenticated ? navigate("/mainpage") : navigate("/");
              }}
            >
              <h3>MapBook</h3>
            </div>
            <div className="header_begin">
              {isAuthenticated ? (
                <>
                  {/* Case 1)When user is logged in  */}
                  <div onClick={() => navigate("/createmap")}>
                    <h4>CreateMaps</h4>
                  </div>
                  <div onClick={() => navigate("/socialpage")}>
                    <h4>Social</h4>
                  </div>
                  <div onClick={() => navigate("/mymap")}>
                    <h4>MyMaps</h4>
                  </div>
                  <div>
                    <img
                      src={user.profile_img}
                      alt="header_profile"
                      className="header_profile"
                      onClick={() => navigate("/profile")}
                    />
                  </div>
                </>
              ) : route === "/" ? (
                <>
                  {/* Case 2) User not authenticated*/}
                  <div className="modal_container">
                    <CustomModal isOpen={isModalOpen} closeModal={closeModal} />
                  </div>
                  <div onClick={openModal}>
                    <h4>Get Started</h4>
                  </div>
                  <div onClick={() => navigate("/login")}>
                    <h4>Login</h4>
                  </div>
                  <div onClick={() => navigate("/register")}>
                    <h4>Register</h4>
                  </div>
                </>
              ) : route === "/login" || route === "/register" ? (
                <>
                  <div onClick={() => navigate("/login")}>
                    <h4>Login</h4>
                  </div>
                  <div onClick={() => navigate("/register")}>
                    <h4>Register</h4>
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() =>
                      window.alert("You need to Register to continue!")
                    }
                  >
                    <h4>CreateMaps</h4>
                  </div>
                  <div onClick={() => navigate("/socialpage")}>
                    <h4>Social</h4>
                  </div>
                  <div
                    onClick={() =>
                      window.alert("You need to Register to continue!")
                    }
                  >
                    <h4>MyMaps</h4>
                  </div>
                  <div onClick={() => navigate("/register")}>
                    <h4>Register</h4>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
};
export default Header;
