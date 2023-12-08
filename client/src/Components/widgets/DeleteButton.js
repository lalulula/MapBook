import React from "react";
import "./buttons.css";
const DeleteButton = ({ onClick }) => {
  return (
    <div>
      <button className="social_delete_btn" onClick={onClick}>
        delete
      </button>
    </div>
  );
};

export default DeleteButton;
