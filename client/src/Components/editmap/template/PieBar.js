import React, { useState } from "react";
import { useEffect } from "react";

import Input from "@mui/joy/Input";

const PieBar = ({ pieBarData, setPieBarData,
  fixData,
  setFixData,
  }) => {
  const [selectedDataIndexes, setSelectedDataIndexes] = useState([]);
  
  useEffect(() => {
    if(fixData){
      // check that data is duplicated or not
      console.log("pieBarData:", pieBarData)
      for(var i = 0; i < pieBarData.length; i++){
        for(var j = i+1; j < pieBarData.length; j++){
          if(pieBarData[i].dataName == pieBarData[j].dataName){
            setFixData(false);
            console.log("DataName duplicated! Cannot fix Data")
            break;
          }
        }
      }
    }
  }, [fixData]);

  const handleAddPieBarData = () => {
    setPieBarData([...pieBarData, { dataName: "", color: "#000000" }]);
    setSelectedDataIndexes([...selectedDataIndexes, null]);
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
        {fixData?  
          pieBarData.map((data, index) => ( 
            <div className="" key={index}>
              <div className="data_input_container">

                  <Input
                    placeholder="Data Name"
                    required
                    name={`data_name_${index}`}
                    value={data.dataName}
                    onChange={(e) => handlePieBarDataInput(index, e.target.value)}
                    disabled
                  />
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
                    disabled
                  />
              </div>
            </div>
          )) : 
          pieBarData.map((data, index) => ( 
            <div className="" key={index}>
              <div className="data_input_container">

                  <Input
                    placeholder="Data Name"
                    required
                    name={`data_name_${index}`}
                    value={data.dataName}
                    onChange={(e) => handlePieBarDataInput(index, e.target.value)}
                  />
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
                  <i
                    className="createmap_remove_data_btn bi bi-x-lg"
                    onClick={() => handleRemovePieBarData(index)}
                  />
                
              </div>
            </div>
          )) 

      }
      </div>
      {fixData?
      <></>
      :
      <div style={{ textAlign: "center" }}>
        <span onClick={handleAddPieBarData} className="createmap_add_data_btn">
          Add Data
        </span>
      </div>
      }
    </div>
  );
};

export default PieBar;
