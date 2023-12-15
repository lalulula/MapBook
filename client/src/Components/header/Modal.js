import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import "./header.css";

// Define the app root element for accessibility

const CustomModal = ({ isOpen, closeModal }) => {
  const navigate = useNavigate();

  const handleToRegister = () => {
    closeModal();
    navigate("/register");
  };

  const handleToMain = () => {
    closeModal();
    navigate("/mainpage");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      className="custom-modal" // Apply a custom class for styling
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
        },
        content: {
          position: "absolute",
          top: "30%",
          left: "35%",
          right: "35%",
          bottom: "30%",
          border: "1px solid #ccc",
          background: "#ffffffe4",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "5px",
          outline: "none",
          padding: "20px",
        },
      }}
    >
      <div className="modal_content">
        <div className="modal_content_guest" onClick={handleToMain}>
          Continue as a guest
        </div>
        <hr></hr>
        <div className="modal_content_register" onClick={handleToRegister}>
          Register
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
