import React from "react";

const PieBar = ({
  pieBarData,
  handlePieBarDataInput,
  handleRemovePieBarData,
  handleAddPieBarData,
}) => {
  return (
    <>
      <h3>Enter Data Names</h3>
      <br />
      <div className="data_container">
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
      <div>
        <i
          style={{ display: "flex", justifyContent: "center" }}
          className="bi bi-plus-circle"
          onClick={handleAddPieBarData}
        ></i>
      </div>
    </>
  );
};

export default PieBar;
