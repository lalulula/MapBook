import React from "react";
import "./buttons.css";

const EditButton = ({ onClick }) => {
  return (
    <div>
      <button className="social_edit_btn" onClick={onClick}>
        edit
      </button>
    </div>
  );
};

export default EditButton;
