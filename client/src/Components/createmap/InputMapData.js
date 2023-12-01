import Checkbox from "@mui/material/Checkbox";
import { grey, blueGrey } from "@mui/material/colors";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dropdown from "react-dropdown";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import PieBar from "./template/PieBar";
import Heat from "./template/Heat";
import Thematic from "./template/Thematic";
import Map from "./Map";
import ColorGenerator from "./template/ColorGenerator";
import Popup from "reactjs-popup";
import "./createMap.css";
import { useNavigate } from "react-router-dom";

const InputMapData = ({
  importDataOpen,
  options,
  setOptions,
  pieBarData,
  setPieBarData,
  themeData,
  setThemeData,
  selectedColors,
  setSelectedColors,
  heatRange,
  setHeatRange,
  selectedMapFile,
  showMapEdit,
  setShowMapEdit,
}) => {
  const handleMapNameChange = (name) => {
    setOptions({ ...options, name });
  };
  const handleMapDescriptionChange = (description) => {
    setOptions({ ...options, description });
  };
  const handleTopicClick = (topic) => {
    const newVal = topic.value;
    setOptions({ ...options, topic: newVal });
  };
  const handleCustomTopic = (customTopic) => {
    setOptions({ ...options, customTopic });
  };

  const handleTemplateClick = (template) => {
    const newVal = template.value;
    setOptions({ ...options, template: newVal });
  };
  const handleCircleHeatMapDataChange = (circleData) => {
    const newVal = circleData;
    setOptions({ ...options, circleHeatMapData: newVal });
  };
  const handlePrivacy = (e) => {
    setOptions({ ...options, isPrivate: e.target.checked });
  };
  const navigate = useNavigate();
  const topics = [
    "Economy",
    "Education",
    "Environmental",
    "Geography",
    "Health",
    "History",
    "Social",
    "Other",
  ];

  const templates = [
    "Bar Chart",
    "Circle Map",
    "Heat Map",
    "Pie Chart",
    "Thematic Map",
  ];
  const template = options["template"];
  // const [showMapEdit, setShowMapEdit] = useState(false);
  return (
    <>
      <>
        <div className="addmapdata_left_sidebar">
          <div>
            <h3>Map Name</h3>
            <input
              value={options.name}
              onChange={(e) => handleMapNameChange(e.target.value)}
              name="map_name"
              placeholder="Enter Map Name"
            />
          </div>
          <div>
            <h3>Description</h3>
            <input
              value={options.description}
              onChange={(e) => handleMapDescriptionChange(e.target.value)}
              name="map_description"
              placeholder="Enter Map Description"
            />
          </div>
          <br />
          <div>
            <h3>Topic</h3>
            <Dropdown
              options={topics}
              value={options.topic}
              placeholder="Select Topic"
              className=""
              onChange={handleTopicClick}
            />
            {options.topic === "Other" && (
              <input
                value={options.customTopic}
                placeholder="Enter a custom Topic"
                onChange={(e) => handleCustomTopic(e.target.value)}
              />
            )}
          </div>
          <br />
          <div>
            <h3>Templates</h3>
            <Dropdown
              options={templates}
              placeholder="Select Template"
              className=""
              onChange={handleTemplateClick}
              value={options.template}
            />
            {options.template === "Circle Map" && (
              <input
                value={options.circleHeatMapData}
                placeholder="Enter CircleMap Data Name"
                onChange={(e) => handleCircleHeatMapDataChange(e.target.value)}
              />
            )}
            {options.template === "Heat Map" && (
              <input
                value={options.circleHeatMapData}
                placeholder="Enter HeatMap Data Name"
                onChange={(e) => handleCircleHeatMapDataChange(e.target.value)}
              />
            )}
          </div>
          <br />
          <div>
            <h3>Visibility</h3>
            <FormControlLabel
              value="private"
              control={
                <Checkbox
                  onChange={handlePrivacy}
                  sx={{
                    color: grey[800],
                    "&.Mui-checked": {
                      color: blueGrey[600],
                    },
                  }}
                />
              }
              label="Private"
              labelPlacement="end"
              color="white"
            />
          </div>
        </div>
        <Map selectedMapFile={selectedMapFile} options={options} />
        <div className="addmapdata_right_sidebar">
          <h3>Map Data</h3>
          {template && template !== "Circle Map" && <h3>Enter Data Names</h3>}
          {(template === "Pie Chart" || template === "Bar Chart") && (
            <PieBar pieBarData={pieBarData} setPieBarData={setPieBarData} />
          )}
          {template === "Thematic Map" && (
            <>
              <Thematic themeData={themeData} setThemeData={setThemeData} />
            </>
          )}
          {template === "Heat Map" && (
            <>
              <Heat
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                heatRange={heatRange}
                setHeatRange={setHeatRange}
              />
              <ColorGenerator />
            </>
          )}
          {template && (
            <div className="">
              <span className=""></span>
              <button
                className=""
                disabled={
                  options["topic"] === "" || options["template"] === ""
                    ? true
                    : false
                }
                onClick={() => setShowMapEdit(true)}
                topic={options["topic"]}
                template={options["template"]}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </>
    </>
  );
};

export default InputMapData;
