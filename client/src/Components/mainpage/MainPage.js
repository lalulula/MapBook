import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../features/userSlice";
import { getUserAPIMethod } from "../../api/client";
import "./main.css";

const MainPage = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  const handleEdit = () => {

  }



  return (
    <div className="main">
      <div className="main_container">
        Hello, {user.username} {/* <button onClick={handleLogout}>Logout, {user.email}</button> */}
      </div>
      <input></input>
      <button>update user</button>
    </div>
  );
};

export default MainPage;
