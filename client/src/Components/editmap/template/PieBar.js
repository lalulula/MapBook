import React, { useState } from "react";
import Input from "@mui/joy/Input";

const PieBar = ({ 
  pieBarData, 
  setPieBarData ,
}) => {
  const [selectedDataIndexes, setSelectedDataIndexes] = useState([]);

  const handleAddPieBarData = () => {
    setPieBarData([...pieBarData, { dataName: "", color: "#000000" }]);
    setSelectedDataIndexes([...selectedDataIndexes, null]);
    // const updatedData = [...pieBarData, ""];
    // pieBarData = updatedData
    // setPieBarData(updatedData);
    // console.log("piebar updatedData: ", pieBarData)
  };

  const handlePieBarDataInput = (index, newData) => {
    const updatedData = [...pieBarData];
    updatedData[index].dataName = newData;
    setPieBarData(updatedData);
  };

  const handlePieBarDataColorChange = (index, newColor) => {
    const updatedData = [...pieBarData];
    updatedData[index].color = newColor;
    setPieBarData(updatedData);
  };

  const handleRemovePieBarData = (index, e) => {
    const updatedData = [...pieBarData];
    updatedData.splice(index, 1);
    setPieBarData(updatedData);
    const updatedIndexes = [...selectedDataIndexes];
    updatedIndexes.splice(index, 1);
    setSelectedDataIndexes(updatedIndexes);
  };
  return (
    <div>
      <div className="data_container">
        {pieBarData.map((data, index) => (
          <div className="" key={index}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <div>Color for data #{index}&nbsp;&nbsp;</div>
              <input
                className="createMap_color_picker"
                style={{ width: "3rem", height: "3rem" }}
                type="color"
                value={data.color}
                onChange={(e) => {
                  handlePieBarDataColorChange(index, e.target.value);
                  const updatedIndexes = [...selectedDataIndexes];
                  updatedIndexes[index] = null;
                  setSelectedDataIndexes(updatedIndexes);
                }}
              />
            </div>
            <div className="data_input_container">
              <Input
                placeholder="Enter Data"
                required
                name={`data_name_${index}`}
                value={data.dataName}
                onChange={(e) => handlePieBarDataInput(index, e.target.value)}
              />
              <i
                className="bi bi-x-circle"
                onClick={() => handleRemovePieBarData(index)}
              />
            </div>
          </div>
        ))}
      </div>
      <div>
        <i
          style={{ display: "flex", justifyContent: "center" }}
          className="bi bi-plus-circle"
          onClick={handleAddPieBarData}
        ></i>
      </div>
    </div>
  );
  // return (
  //   <div>
  //     <div className="data_container">
  //       <div style={{ maxHeight: "300px", overflowY: "auto" }}>
  //         {pieBarData.map((data, index) => (
  //           <div className="data_input_container" key={index}>
  //             <Input
  //               className="data_input_value"
  //               placeholder="Enter Data"
  //               required
  //               name={`data_name_${index}`}
  //               value={data}
  //               onChange={(e) => handlePieBarDataInput(index, e.target.value)}
  //             />
  //             <i
  //               className="data_input_delete bi bi-x-circle "
  //               onClick={(e) => handleRemovePieBarData(index, e)}
  //             />
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //     <div>
  //       <i
  //         className="add_data_btn bi bi-plus-circle"
  //         onClick={handleAddPieBarData}
  //       ></i>
  //     </div>
  //   </div>
  // );
};

export default PieBar;
