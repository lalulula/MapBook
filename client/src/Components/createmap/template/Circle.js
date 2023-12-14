import Input from "@mui/joy/Input";
import { useEffect } from "react";

const Circle = ({ options, handleCircleHeatMapDataChange }) => {

  useEffect(()  => {
    console.log("circle: option ", options)
  },[]);
  return (
    <div className="circle_container">
      <Input
        required
        value={options.circleHeatMapData}
        placeholder="Enter Data Name"
        onChange={(e) => handleCircleHeatMapDataChange(e.target.value)}
      />
    </div>
  );
};

export default Circle;
