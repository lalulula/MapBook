import React, { useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useState } from "react";
const CreateMap = () => {
  const [step, setStep] = useState(1);
  const [options, setOptions] = useState({ topic: "", template: "" });
  useEffect(() => {
    console.log(options);
  }, [options]);
  const prevStep = () => {
    setStep(step - 1);
  };
  const nextStep = () => {
    setStep(step + 1);
  };
  const steps = {
    1: <Step1 nextStep={nextStep} options={options} setOptions={setOptions} />,
    2: <Step2 nextStep={nextStep} prevStep={prevStep} options={options} />,
    3: <Step3 prevStep={prevStep} />,
  };
  return (
    <div className="create_map_container">
      <div>Create Map</div>
      {steps[step]}
    </div>
  );
};

export default CreateMap;
