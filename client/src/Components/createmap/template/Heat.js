import React, { useEffect, useState } from "react";
import Input from "@mui/joy/Input";
import Tooltip from "@mui/joy/Tooltip";
import ColorGenerator from "./ColorGenerator";
const Heat = ({
  selectedColors,
  setSelectedColors,
  heatRange,
  setHeatRange,
  options,
  handleCircleHeatMapDataChange,
  selectedMapFile,
}) => {
  const from = Number(selectedMapFile["mapbook_heatrange"]["from"]);
  const to = Number(selectedMapFile["mapbook_heatrange"]["to"]);

  const width = (to - from) / 5;
  const ranges = [
    from,
    from + width,
    from + width * 2,
    from + width * 3,
    from + width * 4,
    to,
  ];

  useEffect(() => {
    console.log("Heat map options: ", options)
    console.log("Heat map heatRange: ", heatRange)
    console.log("Heat map selectedColors: ", selectedColors)

  }, []);


  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setHeatRange({
      ...heatRange,
      [name]: value,
    });
  };
  return (
    <div className="heat_data_container">
      <Input
        required
        value={options.circleHeatMapData}
        placeholder="Enter Data Name"
        onChange={(e) => handleCircleHeatMapDataChange(e.target.value)}
      />
      <h3>Enter Data Range</h3>
      <Input
        required
        type="number"
        name="from"
        value={heatRange.from}

        placeholder="From"
        onChange={handleRangeChange}
      />
      <br />
      <Input
        required
        type="number"
        name="to"
        value={heatRange.to}

        placeholder="To"
        onChange={handleRangeChange}
      />
      <br />
      <div className="heat_data_tooltip">
        <h3 style={{ display: "flex", alignItems: "center" }}>
          Select color{" "}
          <Tooltip title="Corresponding colors will be chosen automatically">
            <i
              className="bi bi-info-circle"
              style={{ marginLeft: "0.3rem" }}
            ></i>
          </Tooltip>
        </h3>
        <ColorGenerator
          selectedColors={selectedColors}
          setSelectedColors={setSelectedColors}
        />
      </div>

      {/* Render color range*/}
      <h3>Data Color Range</h3>
      {selectedColors.length !== 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            flexDirection: "column",
          }}
        >
          {selectedColors.map((color, index) => (
            <div key={index}>
              <div
                style={{
                  backgroundColor: color,
                  padding: "5px",
                  width: "-webkit-fill-available",
                  // height: "2rem",
                  height: "max-content",
                  textAlign: "center",
                }}
              >
                {ranges[index].toFixed(2)}
                <br /> to {(ranges[index + 1] - 1).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Heat;
