import Input from "@mui/joy/Input";
const Circle = ({ options, handleCircleHeatMapDataChange }) => {
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
