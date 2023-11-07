import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../features/userSlice";
import { getUserAPIMethod } from "../../api/client";

const MainPage = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };



  return (
    <div>
      {user.username} {/* <button onClick={handleLogout}>Logout, {user.email}</button> */}
    </div>
  );
};

export default MainPage;
