// {options.template === "Circle Map" && (
//     <input
//       value={options.circleHeatMapData}
//       placeholder="Enter CircleMap Data Name"
//       onChange={(e) => handleCircleHeatMapDataChange(e.target.value)}
//     />
//   )}
import React, { useEffect, useState } from "react";

const Circle = ({ options, handleCircleHeatMapDataChange }) => {
  // https://www.color-hex.com/color-palettes/

  return (
    <div className="heat_container">
      <input
        value={options.circleHeatMapData}
        placeholder="Enter CircleMap Data Name"
        onChange={(e) => handleCircleHeatMapDataChange(e.target.value)}
      />
    </div>
  );
};

export default Circle;
