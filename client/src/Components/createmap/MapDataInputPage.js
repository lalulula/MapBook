import Map from "./Map";
import Dropdown from "react-dropdown";
import PieBar from "./template/PieBar";
import Heat from "./template/Heat";
import Thematic from "./template/Thematic";
import Circle from "./template/Circle";
import Checkbox from "@mui/material/Checkbox";
import { grey, blueGrey } from "@mui/material/colors";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Textarea from "@mui/joy/Textarea";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import CustomSwitch from "../widgets/CustomSwitch";
import "./createMap.css";
import { useEffect, useState } from "react";
import MapPrevImgDropBox from "./MapPrevImgDropBox";
const MapDataInputPage = ({
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
  setSelectedMapFile,
  isMapbookData,
  setIsMapbookData,
}) => {
  
  const [mapImage, setMapImage] = useState(null);
  const [hoverData, setHoverData] = useState("Out of range");
  const [showHoverData, setShowHoverData] = useState(false);
  useEffect(() => {
    console.log(showHoverData);
  }, [showHoverData]);


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
    console.log("Changing template");
  };
  const handleCircleHeatMapDataChange = (circleData) => {
    const newVal = circleData;
    setOptions({ ...options, circleHeatMapData: newVal });
  };
  const handlePrivacy = (e) => {
    setOptions({ ...options, isPrivate: e.target.checked });
  };
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
  
  // When template changed
  useEffect(() => {
    if(!isMapbookData){
      setPieBarData([]);
      setThemeData([]);
      setSelectedColors([]);
      setHeatRange({ from: 0, to: 0 })
      setOptions({ ...options, circleHeatMapData: "" });

      console.log("template changed")
    }
  }, [template]);

  useEffect(()  => {
    if(isMapbookData){
      setSelectedMapFile({...selectedMapFile, mapbook_description: "", mapbook_owner: "", mapbook_visibility: false})

      if(selectedMapFile.mapbook_template == "Thematic Map"){
        // console.log("Mapbook themedata: ", selectedMapFile.mapbook_themedata)
        setThemeData(selectedMapFile.mapbook_themedata);
      }
      else if(selectedMapFile.mapbook_template == "Heat Map"){
        setSelectedColors(selectedMapFile.mapbook_heat_selectedcolors);
        setHeatRange(selectedMapFile.mapbook_heatrange)
        setOptions({ ...options, circleHeatMapData: selectedMapFile.mapbook_circleheatmapdata });
      }
      else if(selectedMapFile.mapbook_template == "Circle Map"){
        setOptions({ ...options, circleHeatMapData: selectedMapFile.mapbook_circleheatmapdata });
      }
      else if(selectedMapFile.mapbook_template == "Pie Chart"){
        setPieBarData(selectedMapFile.mapbook_datanames);
      }
      else if(selectedMapFile.mapbook_template == "Bar Chart"){
        setPieBarData(selectedMapFile.mapbook_datanames);
      }
      setOptions({ ...options, template: selectedMapFile.mapbook_template, topic:selectedMapFile.mapbook_topic});

      console.log("Mapbook data: ", selectedMapFile)

    }
  }, []);


  return (
    <>
      <div className="addmapdata_left_sidebar">
        <div>
          <FormControl>
            <h3>Map Name</h3>
            <Input
              value={options.name}
              onChange={(e) => handleMapNameChange(e.target.value)}
              name="map_name"
              placeholder="Enter Map Name"
              required
            />
          </FormControl>
        </div>
        <div>
          <FormControl>
            <h3>Description</h3>
            <Textarea
              value={options.description}
              onChange={(e) => handleMapDescriptionChange(e.target.value)}
              name="map_description"
              placeholder="Enter Map Description"
              minRows={4}
              maxRows={4}
              endDecorator={
                <Typography level="body-xs" sx={{ ml: "auto" }}>
                  {options.description.length} character(s)
                </Typography>
              }
            />
            <FormHelperText>Brief Description of the Map</FormHelperText>
          </FormControl>
        </div>

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
            <Input
              sx={{ marginTop: "0.5rem" }}
              value={options.customTopic}
              placeholder="Enter Custom Topic"
              onChange={(e) => handleCustomTopic(e.target.value)}
            />
          )}
          <h3>Templates</h3>
          <Dropdown
            options={templates}
            placeholder="Select Template"
            className=""
            onChange={handleTemplateClick}
            value={options.template}
          />
        </div>

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

      <Map
        selectedMapFile={selectedMapFile}
        options={options}
        setOptions={setOptions}
        setSelectedMapFile={setSelectedMapFile}
        pieBarData={pieBarData}
        heatRange={heatRange}
        selectedColors={selectedColors}
        themeData={themeData}
        setMapImage={setMapImage}
        mapImage={mapImage}
        template={template}
        hoverData={hoverData}
        setHoverData={setHoverData}
        isMapbookData = {isMapbookData}
        setIsMapbookData={setIsMapbookData}
      />
      <div className="mapdatainput_right_sidebar">
        <h3>Data Names</h3>
        <div className="mapdatainput_templates">
          {(template === "Pie Chart" || template === "Bar Chart") && (
            <PieBar pieBarData={pieBarData} setPieBarData={setPieBarData} />
          )}
          {template === "Circle Map" && (
            <Circle
              options={options}
              handleCircleHeatMapDataChange={handleCircleHeatMapDataChange}
            />
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
                options={options}
                handleCircleHeatMapDataChange={handleCircleHeatMapDataChange}
                selectedMapFile={selectedMapFile}
              />
            </>
          )}
        </div>

        <div className="mapdatainput_image_drop">
          <h3>Map Preview Image</h3>
          <MapPrevImgDropBox setMapImage={setMapImage} mapImage={mapImage} />
        </div>

        <div className="mapdatainput_hovered_data_container">
          <div className="mapdatainput_hovered_data_header">
            <h4 style={{ display: "inline-block", margin: 0 }}>Map Data</h4>
            <CustomSwitch
              showHoverData={showHoverData}
              setShowHoverData={setShowHoverData}
            />
          </div>
          <div className="mapdatainput_hovered_data">
            {showHoverData ? (
              <div>{hoverData}</div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  fontSize: "1rem",
                  fontWeight: 200,
                }}
              >
                <b>Swipe</b> the option to <b>"Show"</b> and hover over a region
                <br />
                to check the data names and values
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MapDataInputPage;
