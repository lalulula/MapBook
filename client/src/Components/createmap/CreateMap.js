import React, { useEffect } from "react";
import InputMapData from "./InputMapData";
import { useState } from "react";
import "./createMap.css";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import FileDropBox from "./FileDropBox";

const CreateMap = () => {
  const navigate = useNavigate();
  const [options, setOptions] = useState({
    name: "",
    topic: "",
    circleHeatMapData: "",
    customTopic: "",
    template: "",
    description: "",
    isPrivate: false,
  });
  const [pieBarData, setPieBarData] = useState([""]); //data names for pie & bar
  const [themeData, setThemeData] = useState([{ dataName: "", color: "#fff" }]); //Theme: color and dataname
  const [selectedColors, setSelectedColors] = useState([]); //HEATMAP: color for each range
  const [heatRange, setHeatRange] = useState({ from: 0, to: 0 }); //HEATMAP: range value
  const [skipStep, setSkipSteps] = useState(false);
  const [importDataOpen, setImportDataOpen] = useState(true);
  const [showMapEdit, setShowMapEdit] = useState(false);
  const DEFAULT_GEOJSON =
    "https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson";

  const [selectedMapFile, setSelectedMapFile] = useState(DEFAULT_GEOJSON);
  // const [selectedMapFile, setSelectedMapFile] = useState(null);

  useEffect(() => {
    // console.log("useEffect: selectedMapFile: ", selectedMapFile);
    const newGeojsonData = {
      ...selectedMapFile,
      mapbook_mapname: options.name,
      mapbook_description: options.description,
      mapbook_template: options.template,
      mapbook_circleheatmapdata: options.circleHeatMapData,
      mapbook_topic: options.topic,
      mapbook_customtopic: options.customTopic,
      mapbook_visibility: options.isPrivate,
      mapbook_datanames: pieBarData, //piebar
      mapbook_heatrange: heatRange, // heat range
      mapbook_heat_selectedcolors: selectedColors, // heat color
      mapbook_themedata: themeData, //Color + data name
    };
    setSelectedMapFile(newGeojsonData);
  }, [options, pieBarData, heatRange, selectedColors, themeData]);

  useEffect(() => {}, [skipStep]);

  const closeImportDataPopup = () => {
    setImportDataOpen(false);
  };

  return (
    <div className="createmap_container">
      <Popup
        open={importDataOpen}
        closeOnDocumentClick={false}
        closeOnEscape={false}
        onClose={closeImportDataPopup}
      >
        <FileDropBox
          setSkipSteps={setSkipSteps}
          setSelectedMapFile={setSelectedMapFile}
          selectedMapFile={selectedMapFile}
          setImportDataOpen={setImportDataOpen}
        />
        <div></div>
      </Popup>

      {importDataOpen ? null : (
        <div className="createmap_add_data_container">
          <InputMapData
            importDataOpen={importDataOpen}
            options={options}
            setOptions={setOptions}
            pieBarData={pieBarData}
            setPieBarData={setPieBarData}
            themeData={themeData}
            setThemeData={setThemeData}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            heatRange={heatRange}
            setHeatRange={setHeatRange}
            selectedMapFile={selectedMapFile}
            setSelectedMapFile={setSelectedMapFile}
            showMapEdit={showMapEdit}
            setShowMapEdit={setShowMapEdit}
          />
        </div>
      )}
    </div>
  );
};

export default CreateMap;
