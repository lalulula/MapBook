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
      {/* <Button
        onClick={onClick}
        style={{ marginTop: "20px" }}
        content={text}
        primary
      /> */}
      <button
        className="profile_update_cancel_btn"
        onClick={onClick}
        style={{
          marginTop: "20px",
          outline: "none",
          backgroundColor: "transparent",
          fontSize: "15px",
          fontWeight: "bold",
          color: "#333",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          padding: " 5px 10px",
          border: "2px solid #333",
        }}
      >
        {text}
      </button>
    </div>
  );
};

export default UpdateUserButton;
