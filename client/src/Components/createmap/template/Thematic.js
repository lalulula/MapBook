import React, { useState } from "react";
import { BlockPicker } from "react-color";
const Thematic = ({ themeData, setThemeData }) => {
  const [selectedDataIndexes, setSelectedDataIndexes] = useState([]);
  const handleAddThemeData = () => {
    setThemeData([...themeData, { dataName: "", color: "#fff" }]);
    setSelectedDataIndexes([...selectedDataIndexes, null]);
  };
  const handleThemeDataInput = (index, newData) => {
    const updatedData = [...themeData];
    updatedData[index].dataName = newData;
    setThemeData(updatedData);
  };
  const handleThemeDataColorChange = (index, newColor) => {
    const updatedData = [...themeData];
    updatedData[index].color = newColor;
    setThemeData(updatedData);
  };
  const handleRemoveThemeData = (index) => {
    const updatedData = [...themeData];
    updatedData.splice(index, 1);
    setThemeData(updatedData);
    const updatedIndexes = [...selectedDataIndexes];
    updatedIndexes.splice(index, 1);
    setSelectedDataIndexes(updatedIndexes);
  };
  const showColorPicker = (index) => {
    const updatedIndexes = [...selectedDataIndexes];
    updatedIndexes[index] = index;
    setSelectedDataIndexes(updatedIndexes);
  };

  return (
    <div>
      <div className="data_container">
        {themeData.map((theme, index) => (
          <div className="data_input_container" key={index}>
            <input
              placeholder="Enter Data"
              value={theme.dataName}
              onChange={(e) => handleThemeDataInput(index, e.target.value)}
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
  );
};

export default Thematic;
