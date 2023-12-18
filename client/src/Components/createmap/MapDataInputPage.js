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
  const [fixData, setFixData] = useState(false);
  const [resetDataModal, setResetDataModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    console.log(showHoverData);
  }, [showHoverData]);

  const setFixDataToTrue = () => {
    setFixData(true);
  };
  const setFixDataToFalse = () => {
    setResetDataModal(false);
    setFixData(false);
  };

  const handleMapNameChange = (name) => {
    if (!/^[a-zA-Z0-9\s]*$/.test(name)) {
      setErrorMsg(`[?!,.#] are not allowed.`);
      return;
    } else {
      setErrorMsg("");
      setOptions({ ...options, name });
    }
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

  // When template changed, reset data
  useEffect(() => {
    if (!isMapbookData) {
      console.log("template changed!!");
      setPieBarData([]);
      setThemeData([]);
      setSelectedColors([]);
      setHeatRange({ from: 0, to: 0 });
      setOptions({ ...options, circleHeatMapData: "" });
    }
  }, [template]);

  useEffect(() => {
    console.log("options: ", options);
  }, [options]);

  useEffect(() => {
    if (isMapbookData) {
      setSelectedMapFile({
        ...selectedMapFile,
        mapbook_description: "",
        mapbook_owner: "",
        mapbook_visibility: false,
      });

      if (selectedMapFile.mapbook_template == "Thematic Map") {
        setThemeData(selectedMapFile.mapbook_themedata);
        setOptions({
          ...options,
          template: selectedMapFile.mapbook_template,
          topic: selectedMapFile.mapbook_topic,
          customTopic: selectedMapFile.mapbook_customtopic,
        });
      } else if (selectedMapFile.mapbook_template == "Heat Map") {
        setSelectedColors(selectedMapFile.mapbook_heat_selectedcolors);
        setHeatRange(selectedMapFile.mapbook_heatrange);
        setOptions({
          ...options,
          template: selectedMapFile.mapbook_template,
          topic: selectedMapFile.mapbook_topic,
          customTopic: selectedMapFile.mapbook_customtopic,
          circleHeatMapData: selectedMapFile.mapbook_circleheatmapdata,
        });
      } else if (selectedMapFile.mapbook_template == "Circle Map") {
        console.log("Circle Map selected");
        console.log(
          "selectedMapFile.mapbook_circleheatmapdata: ",
          selectedMapFile.mapbook_circleheatmapdata
        );
        // const newOption = { ...options, circleHeatMapData: selectedMapFile.mapbook_circleheatmapdata }
        setOptions({
          ...options,
          template: selectedMapFile.mapbook_template,
          topic: selectedMapFile.mapbook_topic,
          customTopic: selectedMapFile.mapbook_customtopic,
          circleHeatMapData: selectedMapFile.mapbook_circleheatmapdata,
        });
      } else if (selectedMapFile.mapbook_template == "Pie Chart") {
        console.log("Pie Map selected");
        console.log(
          "selectedMapFile.mapbook_datanames: ",
          selectedMapFile.mapbook_datanames
        );
        setPieBarData(selectedMapFile.mapbook_datanames);
        setOptions({
          ...options,
          template: selectedMapFile.mapbook_template,
          topic: selectedMapFile.mapbook_topic,
          customTopic: selectedMapFile.mapbook_customtopic,
        });
      } else if (selectedMapFile.mapbook_template == "Bar Chart") {
        setPieBarData(selectedMapFile.mapbook_datanames);
        setOptions({
          ...options,
          template: selectedMapFile.mapbook_template,
          topic: selectedMapFile.mapbook_topic,
          customTopic: selectedMapFile.mapbook_customtopic,
        });
      }

      // console.log("Mapbook data: ", selectedMapFile)
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
              style={{
                borderColor: errorMsg ? "var(--warning-color)" : "", // Set border color to red if there's an error, otherwise default to empty string
                color: errorMsg ? "var(--warning-color)" : "", // Set text color to red if there's an error, otherwise default to empty string
              }}
            />
            <div className="createmap_mapname_error">
              {errorMsg && errorMsg}
            </div>
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
        template={template}
        hoverData={hoverData}
        setHoverData={setHoverData}
        isMapbookData={isMapbookData}
        setIsMapbookData={setIsMapbookData}
        setMapImage={setMapImage}
        mapImage={mapImage}
        fixData={fixData}
        setFixData={setFixData}
      />
      <div className="mapdatainput_right_sidebar">
        <h3>Data Names</h3>
        <div className="mapdatainput_templates">
          {(template === "Pie Chart" || template === "Bar Chart") && (
            <PieBar
              pieBarData={pieBarData}
              setPieBarData={setPieBarData}
              // CIRCLE
              options={options}
              handleCircleHeatMapDataChange={handleCircleHeatMapDataChange}
              fixData={fixData}
              setFixData={setFixData}
            />
          )}
          {template === "Circle Map" && (
            <Circle
              options={options}
              handleCircleHeatMapDataChange={handleCircleHeatMapDataChange}
              fixData={fixData}
              setFixData={setFixData}
            />
          )}
          {template === "Thematic Map" && (
            <>
              <Thematic
                themeData={themeData}
                setThemeData={setThemeData}
                fixData={fixData}
                setFixData={setFixData}
              />
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
                fixData={fixData}
                setFixData={setFixData}
              />
            </>
          )}
        </div>

        <div className="mapdatainput_fix_data" style={{ textAlign: "center" }}>
          {fixData ? (
            <span
              onClick={() => setResetDataModal(true)}
              className="createmap_fix_data_btn"
            >
              Edit Data
            </span>
          ) : (
            <span onClick={setFixDataToTrue} className="createmap_fix_data_btn">
              Start editing data
            </span>
          )}
        </div>
        {resetDataModal && (
          <div className="mappdetails_reset_confirmation_modal">
            <div className="mapdetails_reset_confirmation_modal_top">
              Are you sure you want to reset/edit data(s)?
            </div>
            <div className="mapdetails_reset_confirmation_modal_bottom">
              <button
                className="mapdetails_reset_confirm"
                onClick={() => setFixDataToFalse()}
              >
                Yes
              </button>
              <button
                className="mapdetails_cancel_reset"
                onClick={() => setResetDataModal(false)}
              >
                No
              </button>
            </div>
          </div>
        )}

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
              <div
                dangerouslySetInnerHTML={{ __html: hoverData }}
                style={{ fontSize: "1rem", fontWeight: 300 }}
              />
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
