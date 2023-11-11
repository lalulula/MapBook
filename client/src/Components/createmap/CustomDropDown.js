import React, { useState } from "react";

const CustomDropDown = ({ label, options, handleClick }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="dropdown">
      <div className="dropdown_btn" onClick={() => setIsActive(!isActive)}>
        {label} <div>X</div>
      </div>
      {isActive && (
        <div className="dropdown_content">
          {options.map((option, index) => (
            <div
              key={index}
              className="dropdown_item"
              onClick={() => {
                handleClick(option);
                setIsActive(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropDown;
