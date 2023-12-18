import React from "react";
import "./buttons.css";
import { Button } from "semantic-ui-react";

const UpdateUserButton = ({ onClick, text }) => {
  return (
    <div
      className={
        text === "Cancel"
          ? "update_cancel_user_btn_container"
          : "update_user_btn_container"
      }
    >
      <button
        className={
          text === "Cancel" ? "profile_update_canel_btn" : "profile_update_btn"
        }
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default UpdateUserButton;
