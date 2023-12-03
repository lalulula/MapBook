import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl"; // Import mapboxgl
import { createMapAPIMethod } from "../../api/map";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./createMap.css";

import html2canvas from "html2canvas";

import PieBarDataInput from "./modals/PieBarDataInput";
import CircleDataInput from "./modals/CircleDataInput";
import ThematicDataInput from "./modals/ThematicDataInput";
import HeatDataInput from "./modals/HeatDataInput";

export const API_BASE_URL = process.env.REACT_APP_API_ROOT;

const Map = ({
  selectedMapFile,
  options,
  setOptions,
  setSelectedMapFile,
  pieBarData,
  heatRange,
  selectedColors,
  themeData,
}) => {
  const [regionName, setRegionName] = useState("");
  useEffect(() => {
    setSelectedMapFile((prevMapFile) => ({
      ...prevMapFile,
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
    }));
  }, [options, pieBarData, themeData, themeData, heatRange, selectedColors]);
  const MAPBOX_TOKEN =
    "pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw";
  const [lng, setLng] = useState(-122.48);
  const [lat, setLat] = useState(37.84);
  const [zoom, setZoom] = useState(3);
  const [showModalThematic, setShowModalThematic] = useState(false);
  const [showModalBar, setShowModalBar] = useState(false);
  const [showModalPie, setShowModalPie] = useState(false);
  const [showModalCircle, setShowModalCircle] = useState(false);
  const [showModalHeat, setShowModalHeat] = useState(false);
  const [feature, setFeature] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [hoverData, setHoverData] = useState("Out of range");
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  const userId = useSelector((state) => state.user.id);

  const navigate = useNavigate();

  useEffect(() => {
    // console.log("selectedMapFile: useEffect: ", selectedMapFile);
  }, [selectedMapFile]);

  const handleClickRegion = () => {
    setShowPopup(false);
    setSelectedMapFile((prevMapFile) => {
      console.log(prevMapFile);
      console.log(prevMapFile["mapbook_template"]);

      if (prevMapFile["mapbook_template"] === "Bar Chart") {
        setShowModalBar(!showModalBar);
      } else if (prevMapFile["mapbook_template"] === "Pie Chart") {
        setShowModalPie(!showModalPie);
      } else if (prevMapFile["mapbook_template"] === "Circle Map") {
        setShowModalCircle(!showModalCircle);
      } else if (prevMapFile["mapbook_template"] === "Thematic Map") {
        setShowModalThematic(!showModalThematic);
      } else if (prevMapFile["mapbook_template"] === "Heat Map") {
        setShowModalHeat(!showModalHeat);
      }

      return prevMapFile; // Return the unchanged state
    });
  };
  const handlePieBarInputChange = (dataname, value) => {
    setInputData((prevInputData) => ({
      ...prevInputData,
      [dataname]: value,
    }));
  };
  const getColor = (datavalue, colors, ranges) => {
    for (let i = 0; i < ranges.length - 1; i++) {
      if (datavalue >= ranges[i] && datavalue < ranges[i + 1]) {
        return colors[i];
      }
    }
    return "Invalid Color";
  };
  // useEffect(() => {
  //   console.log(inputData);
  //   console.log(selectedMapFile);
  // }, [inputData]);

  const handleHeatMapData = (datavalue) => {
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
    const colors = selectedMapFile["mapbook_heat_selectedcolors"];
    const color = getColor(datavalue, colors, ranges);

    setInputData((prevInputData) => ({
      ...prevInputData,
      value: datavalue,
      color: color,
    }));
  };

  const handleThematicData = (data, value) => {
    setInputData((prevInputData) => ({
      ...prevInputData,
      [data["dataName"]]: { color: data["color"], value: value },
    }));
  };

  const handleAddData = (e) => {
    e.preventDefault();

    // for undo/redo
    console.log("before calling handleChangeState: ", selectedMapFile);
    handleChangeState();

    var tempArr = selectedMapFile["features"];

    if (tempArr.length <= 0 || feature[0] == null) {
      return;
    }
    if (showModalCircle) {
      feature[0]["properties"]["mapbook_data"] = {
        [selectedMapFile["mapbook_circleheatmapdata"]]: inputData,
      };
    } else {
      feature[0]["properties"]["mapbook_data"] = inputData;
    }
    for (var i = 0; i < tempArr.length; i++) {
      if (tempArr[i]["properties"].name === feature[0]["properties"].name) {
        selectedMapFile["features"][i] = feature[0];
        break;
      }
    }
    // console.log("updated selectedmapfile: ", selectedMapFile);
    handleClickRegion();
  };

  const handleUndo = () => {
    if (undoStack.current.length != 0) {
      console.log("undo Clicked");
      // pop {a} from undo stack
      const popedState = undoStack.current.pop();

      // push current state into redo stack
      redoStack.current.push(selectedMapFile);

      // change current state to {a}
      // setSelectedMapFile(popedState)
      selectedMapFile = popedState;

      console.log("popedState: ", popedState);
      console.log("afterUndo: ", selectedMapFile);
    }
  };

  const handleRedo = () => {
    if (redoStack.current.length != 0) {
      console.log("redo Clicked");

      // pop {a} from redo stack
      const popedState = redoStack.current.pop();

      // push current state into undo stack
      undoStack.current.push(selectedMapFile);

      // change current state to {a}
      // setSelectedMapFile(popedState)
      selectedMapFile = popedState;

      console.log("popedState: ", popedState);
      console.log("afterRedo: ", selectedMapFile);
    }
  };

  const handleChangeState = () => {
    // push the state which is right before current change into undo stack
    undoStack.current.push(structuredClone(selectedMapFile));

    console.log("undoStack: ", undoStack);
    // clear redo stack
    redoStack.current = [];
  };

  const mapContainerRef = useRef(null);

  useEffect(() => {
    // console.log("selectedMapFile: ", selectedMapFile);
    let map;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    if (mapContainerRef.current) {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
        preserveDrawingBuffer: true,
      });
    }

    map.on("idle", function () {
      map.resize();
    });
    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    map.on("load", () => {
      // console.log("ON LOAD selectedMapFile: ", selectedMapFile);
      map.addSource("counties", {
        type: "geojson",
        data: selectedMapFile,
      });

      map.addLayer(
        {
          id: "counties",
          type: "fill",
          source: "counties",
          // "source-layer": "original",
          paint: {
            // "fill-color": "rgba(0.5,0.5,0,0.4)",
            "fill-color": "#ff0088",
            "fill-opacity": 0.4,
            "fill-outline-color": "#000000",
            // "fill-outline-opacity": 0.8
          },
        }
        // "building"
      );

      map.addLayer(
        {
          id: "counties-highlighted",
          type: "fill",
          source: "counties",
          // "source-layer": "original",
          paint: {
            "fill-outline-color": "#484896",
            "fill-color": "#6e599f",
            "fill-opacity": 0.75,
          },
          filter: ["in", "name", ""],
        }
        // "building"
      );

      map.addLayer({
        id: "data-labels",
        type: "symbol",
        source: "counties",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 15,
        },
      });

      map.on("click", (e) => {
        // console.log("this is e: ", e);
        const bbox = [
          [e.point.x, e.point.y],
          [e.point.x, e.point.y],
        ];

        const selectedFeatures = map.queryRenderedFeatures(bbox, {
          layers: ["counties"],
        });

        const names = selectedFeatures.map(
          (feature) => feature.properties.name
        );

        const newSelectedFeature = selectedMapFile["features"].filter(
          (f) => f["properties"].name === names[0]
        );

        // console.log("selectedfeatures: ", newSelectedFeature);

        setFeature(newSelectedFeature);

        // console.log("Selected region name: ", names[0]);
        setRegionName(names[0]);
        map.setFilter("counties-highlighted", ["in", "name", ...names]);
        handleClickRegion();
      });
      map.on("mousemove", (event) => {
        const regions = map.queryRenderedFeatures(event.point, {
          layers: ["counties"],
        });

        if (regions.length > 0) {
          const tempFeature = selectedMapFile["features"].find(
            (m) => m["properties"].name === regions[0]["properties"].name
          );
          //console.log("tempFeature: ", tempFeature);
          var data = tempFeature["properties"].mapbook_data;
          if (data === undefined) {
            setHoverData("No data");
          } else {
            // JSON.stringify(tempFeature["properties"].mapbook_data)
            var newData = JSON.stringify(
              tempFeature["properties"].mapbook_data
            );
            console.log(newData, typeof newData);

            if (
              selectedMapFile["mapbook_template"] === "Bar Chart" ||
              "Pie Chart" ||
              "CircleMap"
            ) {
              try {
                const data = JSON.parse(newData);

                const formattedData = Object.keys(data)
                  .map((key) => `${key}: ${data[key]}`)
                  .join("\n");

                console.log(formattedData);
                setHoverData(formattedData);
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }
            } else if (selectedMapFile["mapbook_template"] === "Heat Map") {
              newData = "HeatMap";
            } else if (selectedMapFile["mapbook_template"] === "Thematic Map") {
              newData = "ThematicMap";
            }
          }
        }
      });
    });
  }, []);

  // Convert data to GEOJSON //
  function saveGeoJSONToFile(geoJSONObject, filename) {
    const geoJSONString = JSON.stringify(geoJSONObject);
    // console.log("geoJSONString: ", geoJSONString)
    const newGeoJson = new File([geoJSONString], filename, {
      type: "application/json",
    });
    return newGeoJson;
  }

  function downloadGeoJSON(geoJSONObject, filename) {
    const newGeoJson = saveGeoJSONToFile(geoJSONObject, filename);
    // console.log(newGeoJson)
    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(newGeoJson);
    link.download = filename;
    // Append the link to the body -> trigger click event to start the download
    document.body.appendChild(link);
    link.click();
    // RM link from DOM
    document.body.removeChild(link);
    // console.log(`GeoJSON saved as ${filename}`);
    return newGeoJson;
  }

  const createMap = async (mapData) => {
    const canvas = await html2canvas(
      document.querySelector(".mapboxgl-canvas")
    );

    // console.log("canvas", canvas);
    const mapImage = canvas.toDataURL();

    const newMapObj = {
      map_name: options.name,
      topic: options.customTopic === "" ? options.topic : options.customTopic,
      is_visible: !options.isPrivate,
      user_id: userId,
      map_description: options.description,
      mapPreviewImg: mapImage,
      file: mapData,
    };

    const res = await createMapAPIMethod(newMapObj);
    console.log("res: ", res);
    if (res.ok) {
      // const responseMsg = await res.json;
      navigate("/mainpage");
      // console.log("create map success!");
    } else {
      alert(`Error: ${res.status} - ${res.statusText}`);
    }
  };

  // Click Create Map Btn
  const handleCreateMap = async () => {
    const geoJSONObject = selectedMapFile;
    const mapFile = saveGeoJSONToFile(
      geoJSONObject,
      `${selectedMapFile["mapbook_mapname"]}.geojson`
    );
    createMap(mapFile);
  };
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState(false);

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = () => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };
  return (
    <div
      className="addmapdata_center"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hoverData && showPopup && (
        <div className="popup" style={{ left: position.x, top: position.y }}>
          {hoverData}
        </div>
      )}

      <div className="map_toolbar_container">
        <div className="map_undo_redo_container">
          <i
            className="undo bx bx-undo"
            disabled={undoStack.length == 0}
            onClick={handleUndo}
          />
          <div className="vertical_line_container">|</div>
          <i
            className="redo bx bx-redo"
            disabled={redoStack.length == 0}
            onClick={handleRedo}
          />
        </div>

        <button onClick={handleCreateMap}>Create Map</button>
      </div>
      <div ref={mapContainerRef} id="map">
        {/* Pie & Bar Modal - DONE*/}
        {(showModalPie || showModalBar) && (
          <PieBarDataInput
            showModalBar={showModalBar}
            showModalPie={showModalPie}
            setShowModalBar={setShowModalBar}
            setShowModalPie={setShowModalPie}
            handleAddData={handleAddData}
            selectedMapFile={selectedMapFile}
            handlePieBarInputChange={handlePieBarInputChange}
            regionName={regionName}
          />
        )}
        {/* Circle Modal */}
        {showModalCircle && (
          <CircleDataInput
            options={options}
            showModalCircle={showModalCircle}
            setShowModalCircle={setShowModalCircle}
            handleAddData={handleAddData}
            selectedMapFile={selectedMapFile}
            setInputData={setInputData}
            regionName={regionName}
          />
        )}

        {/* Thematic Modal */}
        {showModalThematic && (
          <ThematicDataInput
            showModalThematic={showModalThematic}
            setShowModalThematic={setShowModalThematic}
            handleAddData={handleAddData}
            selectedMapFile={selectedMapFile}
            handleThematicData={handleThematicData}
            regionName={regionName}
          />
        )}

        {/* Heat Modal - Done */}
        {showModalHeat && (
          <HeatDataInput
            showModalHeat={showModalHeat}
            setShowModalHeat={setShowModalHeat}
            handleAddData={handleAddData}
            handleHeatMapData={handleHeatMapData}
            options={options}
            regionName={regionName}
            inputData={inputData}
          />
        )}
      </div>
    </div>
  );
};

export default Map;
