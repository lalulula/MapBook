import React from "react";
import Input from "@mui/joy/Input";

const PieBar = ({ pieBarData, setPieBarData }) => {
  const handleAddPieBarData = () => {
    const updatedData = [...pieBarData, ""];
    // pieBarData = updatedData
    setPieBarData(updatedData);
    console.log("piebar updatedData: ", pieBarData)
  };
  const handlePieBarDataInput = (index, newData) => {
    const updatedData = [...pieBarData];
    updatedData[index] = newData;
    setPieBarData(updatedData);
    console.log("piebar updatedData: ",updatedData)

  };
  const handleRemovePieBarData = (index, e) => {
    const updatedData = [...pieBarData];
    updatedData.splice(index, 1);
    setPieBarData(updatedData);
    console.log("piebar updatedData: ",updatedData)
  };
  return (
    <div>
      <div className="data_container">
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {pieBarData.map((data, index) => (
            <div className="data_input_container" key={index}>
              <Input
                className="data_input_value"
                placeholder="Enter Data"
                required
                name={`data_name_${index}`}
                value={data}
                onChange={(e) => handlePieBarDataInput(index, e.target.value)}
              />
              <i
                className="data_input_delete bi bi-x-circle "
                onClick={(e) => handleRemovePieBarData(index, e)}
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <i
          className="add_data_btn bi bi-plus-circle"
          onClick={handleAddPieBarData}
        ></i>
      </div>
    </div>
  );
};

export default PieBar;
