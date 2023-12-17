import React from "react";
import "./buttons.css";
import { Button } from "semantic-ui-react";

const UpdateUserButton = ({ onClick, text }) => {
  return (
    <div className="update_user_btn_container">
      <Button
        onClick={onClick}
        style={{ marginTop: "20px" }}
        content={text}
        primary
      />
    </div>
  );
};

export default UpdateUserButton;
