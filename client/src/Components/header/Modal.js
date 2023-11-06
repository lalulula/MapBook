import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";

// Define the app root element for accessibility

const CustomModal = ({ isOpen, closeModal }) => {
    const navigate = useNavigate();

    const handleToRegister = () => {
        closeModal();
        navigate("/register");
    };

    const handleToMain = () => {
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            className="custom-modal" // Apply a custom class for styling
            style={{
                overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.55)'
                },
                content: {
                    position: 'absolute',
                    top: '250px',
                    left: '350px',
                    right: '350px',
                    bottom: '250px',
                    border: '1px solid #ccc',
                    background: '#fff',
                    overflow: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    borderRadius: '4px',
                    outline: 'none',
                    padding: '20px'
                }
            }}

        >
            <div className='modal_content'>
                <div onClick={handleToMain}>Continue as a guest</div>
                <hr></hr>
                <div onClick={handleToRegister}>Register</div>
            </div>

        </Modal>
    );
};

export default CustomModal;