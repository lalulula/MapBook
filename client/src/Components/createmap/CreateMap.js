import React, { useEffect, useRef } from "react";
import MapDataInputPage from "./MapDataInputPage";
import { useState } from "react";
import "./createMap.css";
import { useNavigate, useLocation } from "react-router-dom";
import Popup from "reactjs-popup";
import ImportFilePage from "./ImportFilePage";
import { useSelector } from "react-redux";


const CreateMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mapInfo = { ...location.state };


  const [options, setOptions] = useState({
    name: "",
    topic: "",
    circleHeatMapData: "",
    customTopic: "",
    template: "",
    description: "",
    isPrivate: false,
  });
  const [pieBarData, setPieBarData] = useState([]); //data names for pie & bar
  const [themeData, setThemeData] = useState([]); //Theme: color and dataname
  const [selectedColors, setSelectedColors] = useState([]); //HEATMAP: color for each range
  const [heatRange, setHeatRange] = useState({ from: 0, to: 0 }); //HEATMAP: range value
  const [importDataOpen, setImportDataOpen] = useState(true);
  const [showMapEdit, setShowMapEdit] = useState(false);
  const [isMapbookData, setIsMapbookData] = useState(false);
  const currentUser = useSelector((state) => state.user.user);
  const DEFAULT_GEOJSON =
    "https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson";

  const [selectedMapFile, setSelectedMapFile] = useState(DEFAULT_GEOJSON);
  // const [selectedMapFile, setSelectedMapFile] = useState(null);


  useEffect(() => {
    console.log("mapInfo: ", mapInfo.mapFile)
    // mapInfo
    if (mapInfo.mapFile) {
      setIsMapbookData(true);
      setSelectedMapFile(mapInfo.mapFile);
      setImportDataOpen(false);
    }
    window.userState = currentUser;
  }, []);


  useEffect(() => {
    // console.log("useEffect: selectedMapFile: ", selectedMapFile);
    if (mapInfo.mapFile == null) {
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
    }
  }, [options, pieBarData, heatRange, selectedColors, themeData]);


  const closeImportDataPopup = () => {
    setImportDataOpen(false);
  };



  useEffect(() => {
    // console.log("isMapbookData: CreateMap.js: ", isMapbookData)
  }, [isMapbookData]);

  return (
    <div className="createmap_container">
      <Popup
        open={importDataOpen}
        closeOnDocumentClick={false}
        closeOnEscape={false}
        onClose={closeImportDataPopup}
      >
        <ImportFilePage
          setSelectedMapFile={setSelectedMapFile}
          selectedMapFile={selectedMapFile}
          setImportDataOpen={setImportDataOpen}
          isMapbookData={isMapbookData}
          setIsMapbookData={setIsMapbookData}
        />
        <div></div>
      </Popup>
      {/* After Inputing Data file */}
      {importDataOpen ? null : (
        <div className="createmap_add_data_container">
          <MapDataInputPage
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
            isMapbookData={isMapbookData}
            setIsMapbookData={setIsMapbookData}

          />
        </div>
      )}
    </div>
  );
};

export default CreateMap;
