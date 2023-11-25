import React, { useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useState } from "react";
import "./createMap.css";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import ImportInitData from "./ImportInitData";

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
  const [skipStep, setSkipSteps] = useState(false);
  const [importDataOpen, setImportDataOpen] = useState(true);

  useEffect(() => {
    console.log(options);
  }, [options]);

  useEffect(() => {
    if (skipStep) {
      setStep(3);
    }
  }, [skipStep]);

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

  const closeImportDataPopup = () => {
    setImportDataOpen(false);
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
      <Popup
        trigger={
          <span className="back_btn_createmap">
            <i className="bi bi-arrow-left" />
            &nbsp;&nbsp;MainPage
          </span>
        }
        modal
        nested
        closeOnDocumentClick={false}
        closeOnEscape={false}
      >
        {(close) => (
          <div className="back2main_modal">
            <div className="back2main_modal_content">
              <h3>
                Are you sure you want to go to the mainpage?
                <br /> Your works will not be saved.
              </h3>
            </div>

            <div className="modal_btn_container">
              <button onClick={() => navigate("/mainpage")}>
                Go to Main Page
              </button>
              <button onClick={() => close()}>Keep Me on This Page</button>
            </div>
          </div>
        )}
      </Popup>
      <Popup
        open={importDataOpen}
        closeOnDocumentClick={false}
        closeOnEscape={false}
        onClose={closeImportDataPopup}
      >
        <div>
          <ImportInitData setSkipSteps={setSkipSteps} />
          <div className="modal_btn_container">
            <button onClick={() => setImportDataOpen(false)}>
              Import Data File
            </button>
            <button onClick={() => navigate("/mainpage")}>
              Return to Main Page
            </button>
          </div>
        </div>
      </Popup>

      <span className="create_map_container">
        {importDataOpen ? null : (
          <div
            className={step !== 3 ? "create_map_steps" : "create_map_steps3"}
          >
            {steps[step]}
          </div>
        )}
      </span>
    </div>
  );
};

export default CreateMap;
