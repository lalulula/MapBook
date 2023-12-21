import Input from "@mui/joy/Input";
import { useEffect } from "react";

const Circle = ({ options, handleCircleHeatMapDataChange, fixData }) => {
  useEffect(() => {}, []);
  return (
    <div className="circle_container">
      {fixData ? (
        <Input
          required
          value={options.circleHeatMapData}
          placeholder="Data Name"
          onChange={(e) => handleCircleHeatMapDataChange(e.target.value)}
          disabled
        />
      ) : (
        <Input
          required
          value={options.circleHeatMapData}
          placeholder="Data Name"
          onChange={(e) => handleCircleHeatMapDataChange(e.target.value)}
        />
      )}
    </div>
  );
};

export default Circle;
