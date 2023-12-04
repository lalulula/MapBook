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
        placeholder="From"
        onChange={handleRangeChange}
      />
      <br />
      <Input
        required
        type="number"
        name="to"
        placeholder="To"
        onChange={handleRangeChange}
      />
      <br />
      <div className="heat_data_tooltip">
        <h3>
          Select color{" "}
          <Tooltip title="Corresponding colors will be chosen automatically">
            <i className="bi bi-info-circle" style={{ marginLeft: "1rem" }}></i>
          </Tooltip>
        </h3>
        <ColorGenerator
          selectedColors={selectedColors}
          setSelectedColors={setSelectedColors}
        />
      </div>

      {/* Render color range */}
      <div>
        <h3>Data Color Range</h3>
        {selectedColors.length !== 0 ? (
          <>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  backgroundColor: selectedColors[0],
                  padding: "5px",
                  width: "-webkit-fill-available",
                  height: "2rem",
                }}
              >
                {ranges[0].toFixed(2)} - {(ranges[1] - 1).toFixed(2)}
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  backgroundColor: selectedColors[1],
                  padding: "5px",
                  width: "-webkit-fill-available",
                  height: "2rem",
                }}
              >
                {ranges[1].toFixed(2)} - {(ranges[2] - 1).toFixed(2)}
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  backgroundColor: selectedColors[2],
                  padding: "5px",
                  width: "-webkit-fill-available",
                  height: "2rem",
                }}
              >
                {ranges[2].toFixed(2)} - {(ranges[3] - 1).toFixed(2)}
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  backgroundColor: selectedColors[3],
                  padding: "5px",
                  width: "-webkit-fill-available",
                  height: "2rem",
                }}
              >
                {ranges[3].toFixed(2)} - {(ranges[4] - 1).toFixed(2)}
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  backgroundColor: selectedColors[4],
                  padding: "5px",
                  width: "-webkit-fill-available",
                  height: "2rem",
                }}
              >
                {ranges[4].toFixed(2)} - {(ranges[5] - 1).toFixed(2)}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Heat;
