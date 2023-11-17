import React, { useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useState } from "react";
import "./createMap.css";
import { useNavigate } from "react-router-dom";

const CreateMap = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [options, setOptions] = useState({
    name: "",
    topic: "",
    customTopic: "",
    template: "",
    isPrivate: false,
  });
  const [pieBarData, setPieBarData] = useState([""]);
  const [themeData, setThemeData] = useState([{ data: "", color: "#fff" }]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [heatRange, setHeatRange] = useState({ from: 0, to: 0, width: 0 });
  useEffect(() => {
    console.log(options);
  }, [options]);
  const prevStep = () => {
    if (options.template === "Circle Map") {
      setStep(step - 2);
    } else {
      setStep(step - 1);
    }
  };
  const nextStep = () => {
    if (options.template === "Circle Map") {
      setStep(step + 2);
    } else {
      setStep(step + 1);
    }
  };
  const steps = {
    1: <Step1 nextStep={nextStep} options={options} setOptions={setOptions} />,
    2: (
      <Step2
        nextStep={nextStep}
        prevStep={prevStep}
        options={options}
        pieBarData={pieBarData}
        setPieBarData={setPieBarData}
        themeData={themeData}
        setThemeData={setThemeData}
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
        heatRange={heatRange}
        setHeatRange={setHeatRange}
      />
    ),
    3: <Step3 prevStep={prevStep} options={options} />,
  };
  return (
    <div className="create_map_page">
      <span
        className="back_btn_createmap"
        onClick={() => navigate("/mainpage")}
      >
        <i className="bi bi-arrow-left" />
        &nbsp;&nbsp;MainPage
      </span>
      <span className="create_map_container">
        {/* {step !== 3 ? <h1>Create Map</h1> : <></>} */}
        <div className={step !== 3 ? "create_map_steps" : "create_map_steps3"}>
          {steps[step]}
        </div>
      </span>
    </div>
  );
};

export default CreateMap;
