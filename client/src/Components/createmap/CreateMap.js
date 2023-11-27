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
  const [pieBarData, setPieBarData] = useState([""]); //data names for pie & bar
  const [themeData, setThemeData] = useState([{ data: "", color: "#fff" }]); //Theme: color and dataname
  const [selectedColors, setSelectedColors] = useState([]); //HEATMAP: color for each range
  const [heatRange, setHeatRange] = useState({ from: 0, to: 0, width: 0 }); //HEATMAP: range value
  const [skipStep, setSkipSteps] = useState(false);
  const [importDataOpen, setImportDataOpen] = useState(true);
  const [geojsonData, setGeojsonData] = useState(null);
  const DEFAULT_GEOJSON =
    "https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson";
  const [selectedMapFile, setSelectedMapFile] = useState(DEFAULT_GEOJSON);
  const updateGeojsonData = (newGeojsonData) => {
    setSelectedMapFile(newGeojsonData);
  };
  useEffect(() => {
    const newGeojsonData = {
      ...geojsonData,
      mapbook_mapname: options.name,
      mapbook_template: options.template,
      mapbook_topic: options.topic,
      mapbook_customtopic: options.customTopic,
      mapbook_visibility: options.isPrivate,
      mapbook_datanames: pieBarData, //piebar
      mapbook_heatrange: heatRange, // heat range
      mapbook_heat_selectedcolors: selectedColors, // heat color
      mapbook_themedata: themeData, //Color + data name
    };
    setGeojsonData(newGeojsonData);
    updateGeojsonData(newGeojsonData);
  }, [options, pieBarData, heatRange, selectedColors, themeData]);

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
        setSelectedMapFile={setSelectedMapFile}
      />
    ),
    // 3: <Step3 prevStep={prevStep} options={options} />,
    3: <Step3 selectedMapFile={selectedMapFile} />,
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
          <ImportInitData
            geojsonData={geojsonData}
            setGeojsonData={setGeojsonData}
            setSkipSteps={setSkipSteps}
            setSelectedMapFile={setSelectedMapFile}
            updateGeojsonData={updateGeojsonData}
          />
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
      {/* <span className="create_map_container"> */}
      <span
        className={
          step !== 3 ? "create_map_container" : "create_map_container_step3"
        }
      >
        {importDataOpen ? null : (
          <div
            // className={step !== 3 ? "create_map_steps" : "create_map_steps3"}
            className={step !== 3 ? "create_map_steps" : ""}
          >
            {steps[step]}
          </div>
        )}
      </span>
    </div>
  );
};

export default CreateMap;
