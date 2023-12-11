import React from "react";
import "./buttons.css";

const UpdateUserButton = ({ onClick }) => {
  return (
    <div className="update_user_btn_container">
      <button className="update_user_btn" onClick={onClick}>
        Update Profile
      </button>
    </div>
  );
};

export default UpdateUserButton;
