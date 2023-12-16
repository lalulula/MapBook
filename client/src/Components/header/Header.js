import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./header.css";
import "intersection-observer";
import CustomModal from "./Modal";
import defaultProfileImg from "../../assets/img/defaultProfileImg.jpg";

export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

const Header = () => {
  const [admin, setAdmin] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const route = window.location.pathname;
  const staticRoutes = ["resetPasswordRequest", "resetPassword"];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profileImgPath = useSelector((state) => state.user.user.profile_img);
  const user = useSelector((state) => state.user);
  const isCreateMapPage = route === "/createmap";
  useEffect(() => {
    if (user.is_admin) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
    console.log(isCreateMapPage);
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
    //NOT AUTHENTICATED
    return (
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
                <div
                  onClick={() => !isCreateMapPage && navigate("/socialpage")}
                >
                  <h4
                    style={
                      isCreateMapPage
                        ? {
                            cursor: "default",
                            transform: "none",
                            color: "#6a6a6abf",
                          }
                        : {}
                    }
                  >
                    Social
                  </h4>
                </div>
                <div onClick={() => !isCreateMapPage && navigate("/mymap")}>
                  <h4
                    style={
                      isCreateMapPage
                        ? {
                            cursor: "default",
                            transform: "none",
                            color: "#6a6a6abf",
                          }
                        : {}
                    }
                  >
                    MyMaps
                  </h4>
                </div>
                {user.user.is_admin && (
                  <div className="dropdown">
                    <h4 className="dropbtn">Manage</h4>
                    <div className="dropdown-content">
                      <div onClick={() => navigate("/managemaps")}>Maps</div>
                      <div onClick={() => navigate("/managesocials")}>
                        Social Posts
                      </div>
                      <div onClick={() => navigate("/manageusers")}>Users</div>
                    </div>
                  </div>
                )}
                <div>
                  <img
                    src={profileImgPath ? profileImgPath : defaultProfileImg}
                    alt="header_profile"
                    className="header_profile"
                    onClick={() => !isCreateMapPage && navigate("/profile")}
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
            ) : route === "/login" ||
              route === "/register" ||
              route === "/resetPasswordRequest" ||
              staticRoutes.includes(route.split("/")[1]) ? (
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
                    window.alert("You need to Register/Login to continue!")
                  }
                >
                  <h4>CreateMaps</h4>
                </div>
                <div
                  onClick={() => !isCreateMapPage && navigate("/socialpage")}
                >
                  <h4
                    style={
                      isCreateMapPage
                        ? {
                            cursor: "default",
                            transform: "none",
                            color: "#6a6a6abf",
                          }
                        : {}
                    }
                  >
                    Social
                  </h4>
                </div>
                <div
                  onClick={() =>
                    window.alert("You need to Register/Login to continue!")
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
    );
  } else {
    // AUTHENTICATED USER
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
                  <div
                    onClick={() => !isCreateMapPage && navigate("/socialpage")}
                  >
                    <h4
                      style={
                        isCreateMapPage
                          ? {
                              cursor: "default",
                              transform: "none",
                              color: "#6a6a6abf",
                            }
                          : {}
                      }
                    >
                      Social
                    </h4>
                  </div>
                  <div onClick={() => !isCreateMapPage && navigate("/mymap")}>
                    <h4
                      style={
                        isCreateMapPage
                          ? {
                              cursor: "default",
                              transform: "none",
                              color: "#6a6a6abf",
                            }
                          : {}
                      }
                    >
                      MyMaps
                    </h4>
                  </div>
                  {user.user.is_admin && (
                    <div className="dropdown">
                      <h4
                        className="dropbtn"
                        onClick={() => navigate("/manageusers")}
                      >
                        Manage Users
                      </h4>
                    </div>
                  )}
                  <div>
                    <img
                      src={user.user.profile_img}
                      alt="header_profile"
                      className="header_profile"
                      onClick={() => !isCreateMapPage && navigate("/profile")}
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
              ) : route === "/login" ||
                route === "/register" ||
                route === "/resetPasswordRequest" ||
                staticRoutes.includes(route.split("/")[1]) ? (
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
                  <div
                    onClick={() => !isCreateMapPage && navigate("/socialpage")}
                  >
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
  }
};
export default Header;
