import React from "react";
import PieBar from "./template/PieBar";
import Thematic from "./template/Thematic";
import Heat from "./template/Heat";

const Step2 = ({
  nextStep,
  prevStep,
  options,
  pieBarData,
  setPieBarData,
  themeData,
  setThemeData,
  selectedColors,
  setSelectedColors,
  heatRange,
  setHeatRange,
}) => {
  const template = options["template"];
  return (
    <div className="step2_container">
      <h3>Enter Data Names</h3>
      {(template === "Pie Chart" || template === "Bar Chart") && (
        <PieBar pieBarData={pieBarData} setPieBarData={setPieBarData} />
      )}
      {template === "Thematic Map" && (
        <Thematic themeData={themeData} setThemeData={setThemeData} />
      )}
      {template === "Heat Map" && (
        <Heat
          selectedColors={selectedColors}
          setSelectedColors={setSelectedColors}
          heatRange={heatRange}
          setHeatRange={setHeatRange}
        />
      )}
      <div className="btn_container">
        <button className="before_btn" onClick={prevStep}>
          Go Back
        </button>
        <button className="next_btn" onClick={nextStep}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2;
