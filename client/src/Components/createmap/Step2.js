import React, { useEffect, useState } from "react";
import Step3 from "./Step3";
import PieBar from "./template/PieBar";
import { SketchPicker, BlockPicker } from "react-color";

const Step2 = ({
  nextStep,
  prevStep,
  options,
  pieBarData,
  setPieBarData,
  themeData,
  setThemeData,
}) => {
  const template = options["template"];
  // Pie-Bar Map States
  const handleAddPieBarData = () => {
    setPieBarData([...pieBarData, ""]);
  };
  const handlePieBarDataInput = (index, newData) => {
    const updatedData = [...pieBarData];
    updatedData[index] = newData;
    setPieBarData(updatedData);
  };
  const handleRemovePieBarData = (index, e) => {
    const updatedData = [...pieBarData];
    updatedData.splice(index, 1);
    setPieBarData(updatedData);
  };
  // Theme Map States
  const [selectedDataIndexes, setSelectedDataIndexes] = useState([]);

  const handleAddThemeData = () => {
    setThemeData([...themeData, { data: "", color: "#fff" }]);
    setSelectedDataIndexes([...selectedDataIndexes, null]);
  };
  const handleThemeDataInput = (index, newData) => {
    const updatedData = [...themeData];
    updatedData[index].data = newData;
    setThemeData(updatedData);
  };
  const handleThemeDataColorChange = (index, newColor) => {
    const updatedData = [...themeData];
    updatedData[index].color = newColor;
    setThemeData(updatedData);
  };
  const handleRemoveThemeData = (index) => {
    // const updatedData = [...themeData];
    // updatedData.splice(index, 1);
    // setThemeData(updatedData);
    const updatedData = [...themeData];
    updatedData.splice(index, 1);
    setThemeData(updatedData);
    const updatedIndexes = [...selectedDataIndexes];
    updatedIndexes.splice(index, 1);
    setSelectedDataIndexes(updatedIndexes);
  };
  const showColorPicker = (index) => {
    // setSelectedDataIndex(index);
    const updatedIndexes = [...selectedDataIndexes];
    updatedIndexes[index] = index;
    setSelectedDataIndexes(updatedIndexes);
  };

  return (
    <>
      <div className="step2_container">
        {(template === "Pie Chart" || template === "Bar Chart") && (
          <PieBar
            pieBarData={pieBarData}
            handlePieBarDataInput={handlePieBarDataInput}
            handleRemovePieBarData={handleRemovePieBarData}
            handleAddPieBarData={handleAddPieBarData}
          />
        )}
        {template === "Thematic Map" && (
          <div>
            <h3>Enter Data Names</h3>
            <br />
            <div className="data_container">
              {themeData.map((theme, index) => (
                <div className="data_input_container" key={index}>
                  <input
                    placeholder="Enter Data"
                    value={theme.data}
                    onChange={(e) =>
                      handleThemeDataInput(index, e.target.value)
                    }
                  />
                  <div
                    onClick={() => {
                      showColorPicker(index);
                    }}
                    style={{
                      backgroundColor: `${theme.color}`,
                      width: 25,
                      height: 25,
                      borderRadius: "50%",
                    }}
                  ></div>
                  <i
                    className="bi bi-x-circle"
                    onClick={() => handleRemoveThemeData(index)}
                  />

                  {selectedDataIndexes[index] === index && (
                    <BlockPicker
                      key={index}
                      color={theme.color}
                      onChange={(color) => {
                        handleThemeDataColorChange(index, color.hex);
                        const updatedIndexes = [...selectedDataIndexes];
                        updatedIndexes[index] = null;
                        setSelectedDataIndexes(updatedIndexes);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div>
              <i
                style={{ display: "flex", justifyContent: "center" }}
                className="bi bi-plus-circle"
                onClick={handleAddThemeData}
              ></i>
            </div>
          </div>
        )}
        {template === "Heat Map" && <div>Heat</div>}
        {template === "Circle Map" && <Step3 />}
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
