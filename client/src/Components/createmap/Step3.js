import React, { useState } from "react";

const Step3 = ({ prevStep }) => {
  const [showModal, setShowModal] = useState(false);
  const handleAddMap = () => {
    setShowModal(true);
  };
  return (
    <>
      <div>
        <div>Step3</div>
        <button onClick={prevStep}> Back To Step2</button>
        <button onClick={handleAddMap}>Add Map</button>
      </div>
    </>
  );
};

export default Step3;
