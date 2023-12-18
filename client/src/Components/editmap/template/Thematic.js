import React, { useState } from "react";
import Input from "@mui/joy/Input";
import { useEffect } from "react";

const Thematic = ({ themeData, setThemeData, 
  fixData,
  setFixData,
}) => {
  const [selectedDataIndexes, setSelectedDataIndexes] = useState([]);
  const handleAddThemeData = () => {
    setThemeData([...themeData, { dataName: "", color: "#000000" }]);
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
  useEffect(() => {
    if(fixData){
      // check that data is duplicated or not
      console.log("themeData:", themeData)
      for(var i = 0; i < themeData.length; i++){
        for(var j = i+1; j < themeData.length; j++){
          if(themeData[i].dataName == themeData[j].dataName){
            setFixData(false);
            console.log("DataName duplicated! Cannot fix Data")
            break;
          }
        }
      }
    }
  }, [fixData]);
  return (
    <div>
      <div className="data_container data_input_container_thematic">
        {fixData? 
          themeData.map((theme, index) => (
            <div className="" key={index}>
              <div className="data_input_container">
                <Input
                  placeholder="Data Name"
                  required
                  name={`data_name_${index}`}
                  value={theme.dataName}
                  onChange={(e) => handleThemeDataInput(index, e.target.value)}
                  disabled
                />
                <input
                  className="createMap_color_picker"
                  style={{ width: "3rem", height: "3rem" }}
                  type="color"
                  value={theme.color}
                  onChange={(e) => {
                    handleThemeDataColorChange(index, e.target.value);
                    const updatedIndexes = [...selectedDataIndexes];
                    updatedIndexes[index] = null;
                    setSelectedDataIndexes(updatedIndexes);
                  }}
                  disabled
                />
              </div>
            </div>
          ))
          : 
            themeData.map((theme, index) => (
              <div className="" key={index}>
                <div className="data_input_container">
                  <Input
                    placeholder="Data Name"
                    required
                    name={`data_name_${index}`}
                    value={theme.dataName}
                    onChange={(e) => handleThemeDataInput(index, e.target.value)}
                  />
                  <input
                    className="createMap_color_picker"
                    style={{ width: "3rem", height: "3rem" }}
                    type="color"
                    value={theme.color}
                    onChange={(e) => {
                      handleThemeDataColorChange(index, e.target.value);
                      const updatedIndexes = [...selectedDataIndexes];
                      updatedIndexes[index] = null;
                      setSelectedDataIndexes(updatedIndexes);
                    }}
                  />
                  <i
                    className="createmap_remove_data_btn bi bi-x-lg"
                    onClick={() => handleRemoveThemeData(index)}
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
          <span onClick={handleAddThemeData} className="createmap_add_data_btn">
            Add Data
          </span>
        </div>
      }
      
    </div>
  );
};

export default Thematic;
