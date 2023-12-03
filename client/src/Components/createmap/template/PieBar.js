import React from "react";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";

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
      <br />
      <div className="data_container">
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {pieBarData.map((data, index) => (
            <div className="data_input_container" key={index}>
              <Input
                placeholder="Enter Data"
                required
                name={`data_name_${index}`}
                value={data}
                onChange={(e) => handlePieBarDataInput(index, e.target.value)}
                endDecorator={
                  <Button
                    variant="solid"
                    color=""
                    loading={data.status === "loading"}
                    onClick={(e) => handleRemovePieBarData(index, e)}
                    sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  >
                    {/* DELETE */}
                    <i className="bi bi-x-circle " />
                  </Button>
                }
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
