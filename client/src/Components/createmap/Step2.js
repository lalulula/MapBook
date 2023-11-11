import React from "react";

const Step2 = ({ nextStep, prevStep, options }) => {
  return (
    <>
      <div>Step2</div>
      <div>{options["topic"]}</div>
      <div>{options["template"]}</div>
      <button className="back_to_step1_btn" onClick={prevStep}> Back To Step1</button>
      <button onClick={nextStep}> Go To Step3</button>
    </>
  );
};

export default Step2;
