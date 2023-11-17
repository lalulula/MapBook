import React from "react";

const PieBar = ({ pieBarData, setPieBarData }) => {
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
  return (
    <div>
      {/* <h3>Enter Data Names</h3> */}
      <br />
      <div className="data_container">
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {pieBarData.map((data, index) => (
            <div className="data_input_container" key={index}>
              <input
                placeholder="Enter Data"
                name={`data_name_${index}`}
                value={data}
                onChange={(e) => handlePieBarDataInput(index, e.target.value)}
              />
              <i
                className="bi bi-x-circle"
                onClick={(e) => handleRemovePieBarData(index, e)}
              ></i>
            </div>
          ))}
        </div>
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
};

export default PieBar;
