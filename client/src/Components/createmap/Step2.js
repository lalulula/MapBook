import React, { useEffect, useState } from "react";
import Step3 from "./Step3";
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
    <>
      <div className="step2_container">
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
      </div>

      <button className="before_btn" onClick={prevStep}>
        Back To Step1
      </button>
      <button className="next_btn" onClick={nextStep}>
        Go To Step3
      </button>
    </>
  );
};

export default Step2;
