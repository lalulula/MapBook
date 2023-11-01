import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/userSlice";

const MainPage = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div>
      MainPage <button onClick={handleLogout}>Logout, {user.email}</button>
    </div>
  );
};

export default MainPage;
