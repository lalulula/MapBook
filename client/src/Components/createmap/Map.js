import React, { useEffect, useRef, useState, useMemo } from "react";
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
  setSelectedMapFile,
  pieBarData,
  heatRange,
  selectedColors,
  themeData,
  template,
  hoverData,
  setHoverData,
}) => {
  const mapFileData = useRef(selectedMapFile);
  const mapRef = useRef();

  const [regionName, setRegionName] = useState("");

  useEffect(() => {
    console.log(template);
  }, [template]);

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

    mapFileData.current = selectedMapFile;
  }, [
    options,
    pieBarData,
    themeData,
    themeData,
    heatRange,
    selectedColors,
    mapFileData.current,
  ]);
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
  // const [hoverData, setHoverData] = useState("Out of range");
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const templateHoverType = useRef([]);
  const mapContainerRef = useRef(null);
  const userId = useSelector((state) => state.user.id);
  const [rerenderFlag, setRerenderFlag] = useState(false);

  const navigate = useNavigate();

  const handleRerender = () => {
    setRerenderFlag(!rerenderFlag);
  };

  const resetMap = () => {
    undoStack.current = [];
    redoStack.current = [];
    setSelectedMapFile((prevState) => {
      const newState = { ...prevState };
      newState.features = newState.features.map((feature) => {
        const newFeature = { ...feature };
        newState.mapbook_circleheatmapdata = "";
        newState.mapbook_customtopic = "";
        newState.mapbook_datanames = [""];
        newState.mapbook_description = "";
        newState.mapbook_heat_selectedcolors = [];
        newState.mapbook_heatrange = { from: 0, to: 0 };
        newState.mapbook_mapname = "";
        newState.mapbook_topic = "";
        newState.mapbook_visibility = false;

        newState.mapbook_template = template;
        if (newFeature.properties && newFeature.properties.mapbook_data) {
          delete newFeature.properties.mapbook_data;
        }
        return newFeature;
      });
      return newState;
    });
  };

  const handleThematicMapLayer = (map, data) => {
    console.log("handleThematicMapLayer: ", data);
  };

  useEffect(() => {
    templateHoverType.current = template;
    resetMap();
    console.log(selectedMapFile);
  }, [template]);

  const handleClickRegion = () => {
    // setShowPopup(false);
    setSelectedMapFile((prevMapFile) => {
      // console.log(prevMapFile);
      if (prevMapFile["mapbook_template"] === "Bar Chart") {
        // setTemplate("Bar Chart");
        setShowModalBar(!showModalBar);
      } else if (prevMapFile["mapbook_template"] === "Pie Chart") {
        // setTemplate("Pie Chart");
        setShowModalPie(!showModalPie);
      } else if (prevMapFile["mapbook_template"] === "Circle Map") {
        // setTemplate("Circle Map");
        setShowModalCircle(!showModalCircle);
      } else if (prevMapFile["mapbook_template"] === "Thematic Map") {
        // setTemplate("Thematic Map");
        setShowModalThematic(!showModalThematic);
      } else if (prevMapFile["mapbook_template"] === "Heat Map") {
        // setTemplate("Heat Map");
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

  const handleHeatMapData = (datavalue) => {
    const from = Number(mapFileData.current["mapbook_heatrange"]["from"]);
    const to = Number(mapFileData.current["mapbook_heatrange"]["to"]);
    const width = (to - from) / 5;
    const ranges = [
      from,
      from + width,
      from + width * 2,
      from + width * 3,
      from + width * 4,
      to,
    ];
    const colors = mapFileData.current["mapbook_heat_selectedcolors"];
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
  // THEMATIC
  const redrawThematicData = () => {
    if (templateHoverType.current === "Thematic Map") {
      //////// HANEUL
      if (mapRef.current.getLayer("counties-thematic")) {
        mapRef.current.removeLayer("counties-thematic");
      }
      if (mapRef.current.getSource("thematic")) {
        mapRef.current.removeSource("thematic");
      }

      mapRef.current.addSource("thematic", {
        type: "geojson",
        data: mapFileData.current,
      });

      ////// HANEUL
      mapRef.current.addLayer(
        {
          id: `counties-thematic`,
          type: "fill",
          source: "thematic",
          layout: {
            // Make the layer visible by default.
            visibility: "none",
          },
          paint: {
            "fill-outline-color": "#484896", //Fill color
            "fill-color": "#faafee",
            "fill-opacity": 1,
          },
        }
        // "building"
      );

    
      console.log("Calling THEMATIC AFTER CLICK");

      const featureDataAdded = mapFileData.current["features"].filter(
        (f) => f["properties"].mapbook_data != null
      );
      var namesDataAdded = [];
      featureDataAdded.forEach((element) => {
        // console.log(element);
        namesDataAdded.push(element["properties"].name);
      });

      console.log("themeData", themeData);

      let dataNames = [];
      themeData.forEach((data) => {
        dataNames.push(data.dataName);
      });
      console.log("dataNames", dataNames);

      let expMaximumValue = ["max"];
      let values = [];
      let colors = [];
      dataNames.forEach((dataName) => {
        const expValue = [
          "to-number",
          ["get", "value", ["get", dataName, ["get", "mapbook_data"]]],
        ];
        const expColor = [
          "get",
          "color",
          ["get", dataName, ["get", "mapbook_data"]],
        ];

        values.push(expValue);
        colors.push(expColor);
        expMaximumValue.push(expValue);
      });
      console.log("values", values);
      console.log("colors", colors);
      console.log("expMaximumValue", expMaximumValue);

      let expGetMaximumColor = ["case"];
      for (let i = 0; i < values.length; i++) {
        const statement = ["==", values[i], expMaximumValue];
        expGetMaximumColor.push(statement);
        expGetMaximumColor.push(mapFileData.current.mapbook_themedata[i].color);
      }
      expGetMaximumColor.push("#000000");

      console.log("expGetMaximumColor", expGetMaximumColor);

      console.log("mapFileData.current", mapFileData.current);
      console.log("mapRef.getSource(): ", mapRef.current.getSource("counties"));

      mapRef.current.setLayoutProperty(
        "counties-thematic",
        "visibility",
        "visible"
      );
      mapRef.current.setPaintProperty(
        "counties-thematic",
        "fill-color",
        expGetMaximumColor
      );
      // mapRef.current.setPaintProperty('counties-thematic', 'fill-color', ['case', ['==',  ['to-number', ['get', 'value', ['get', 'aa', ['get', 'mapbook_data']]]] , 10], '#ffffff', '#123123']);

      // mapRef.current.setPaintProperty('counties-thematic', 'fill-color', mapFileData.current.mapbook_themedata[0].color);
      mapRef.current.setFilter("counties-thematic", [
        "in",
        "name",
        ...namesDataAdded,
      ]);
    }
  };
  // HEAT
  const redrawHeatData = () => {
    if (templateHoverType.current === "Heat Map") {

      if (mapRef.current.getLayer("counties-heat")) {
        mapRef.current.removeLayer("counties-heat");
      }
      if (mapRef.current.getSource("heat")) {
        mapRef.current.removeSource("heat");
      }

      mapRef.current.addSource("heat", {
        type: "geojson",
        data: mapFileData.current,
      });

      mapRef.current.addLayer({
        id: `counties-heat`,
        type: "fill",
        source: "heat",
        layout: {
          visibility: "none",
        },
        paint: {
          "fill-outline-color": "#484896",
          "fill-color": "#faafee",
          "fill-opacity": 1,
        },
      });

  
      console.log("Calling HEAT AFTER CLICK");

      const featureDataAdded = mapFileData.current["features"].filter(
        (f) => f["properties"].mapbook_data != null
      );
      var namesDataAdded = [];
      featureDataAdded.forEach((element) => {
        console.log("featureDataAdded", element);
        namesDataAdded.push(element["properties"].name);
      });
      const expValue = [
        "to-number",
        ["get", "value",  ["get", "mapbook_data"]],
      ];
      console.log("heatData", inputData, "namesdata", namesDataAdded);

      let value = inputData["value"];
      let color = inputData["color"];
      console.log(value, color);
      mapRef.current.setLayoutProperty(
        "counties-heat",
        "visibility",
        "visible"
      );
      mapRef.current.setPaintProperty("counties-heat", "fill-color", color);
      mapRef.current.setFilter("counties-heat", [
        "in",
        "name",
        ...namesDataAdded,
      ]);
    }
  };

  const handleAddData = (e) => {
    e.preventDefault();

    // for undo/redo
    console.log("before calling handleChangeState: ", mapFileData.current);
    handleChangeState();

    var tempArr = mapFileData.current["features"];

    if (tempArr.length <= 0 || feature[0] == null) {
      return;
    }
    if (showModalCircle) {
      feature[0]["properties"]["mapbook_data"] = {
        [mapFileData.current["mapbook_circleheatmapdata"]]: inputData,
      };
    } else {
      feature[0]["properties"]["mapbook_data"] = inputData;
    }
    for (var i = 0; i < tempArr.length; i++) {
      if (tempArr[i]["properties"].name === feature[0]["properties"].name) {
        mapFileData.current["features"][i] = feature[0];
        break;
      }
    }

    handleClickRegion();
    redrawThematicData();
    redrawHeatData();
  };

  const handleUndo = () => {
    if (undoStack.current.length !== 0) {
      console.log("undo Clicked");
      // pop {a} from undo stack
      const popedState = undoStack.current.pop();

      // push current state into redo stack
      redoStack.current.push(mapFileData.current);

      // change current state to {a}
      // setSelectedMapFile(popedState => (popedState))
      mapFileData.current = popedState;

      console.log("popedState: ", popedState);
      console.log("afterUndo: ", mapFileData.current);

      setSelectedMapFile(mapFileData.current);
      redrawHeatData();
      redrawThematicData();
    }
  };

  const handleRedo = () => {
    if (redoStack.current.length !== 0) {
      console.log("redo Clicked");
      // pop {a} from redo stack
      const popedState = redoStack.current.pop();
      // push current state into undo stack
      undoStack.current.push(mapFileData.current);

      // change current state to {a}
      // setSelectedMapFile(popedState)
      mapFileData.current = popedState;

      console.log("popedState: ", popedState);
      console.log("afterRedo: ", mapFileData.current);

      setSelectedMapFile(mapFileData.current);

      redrawThematicData();
      redrawHeatData();
    }
  };

  const handleChangeState = () => {
    // push the state which is right before current change into undo stack
    undoStack.current.push(structuredClone(mapFileData.current));

    console.log("undoStack: ", undoStack);
    // clear redo stack
    redoStack.current = [];
  };

  useEffect(() => {
    // console.log("selectedMapFile: ", selectedMapFile);
    console.log("onhover: useEffect:", templateHoverType.current);

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

    if (map != null) {
      map.on("idle", function () {
        map.resize();
      });
      map.on("move", () => {
        setLng(map.getCenter().lng.toFixed(4));
        setLat(map.getCenter().lat.toFixed(4));
        setZoom(map.getZoom().toFixed(2));
      });

      map.on("load", () => {
        console.log("ON LOAD selectedMapFile: ", selectedMapFile);
        map.addSource("counties", {
          type: "geojson",
          data: mapFileData.current,
        });

        map.addLayer({
          id: "counties",
          type: "fill",
          source: "counties",
          paint: {
            "fill-color": "#ff0088", //default map color
            "fill-opacity": 0.4,
            "fill-outline-color": "#000000",
          },
        });

        map.addLayer({
          id: "counties-highlighted",
          type: "fill",
          source: "counties",
          paint: {
            "fill-outline-color": "#484896", //Fill color
            "fill-color": "#6e599f", //Fill color onclick
            "fill-opacity": 0.75,
          },
          filter: ["in", "name", ""],
        });

        // UGLY NAME LABELS
        // map.addLayer({
        //   id: "data-labels",
        //   type: "symbol",
        //   source: "counties",
        //   layout: {
        //     "text-field": ["get", "name"],
        //     "text-size": 15,
        //   },
        // });

        // circles? no mapbook_data tho
        /* map.addLayer({
          id: 'csvData',
          type: 'circle',
          source: {
            type: 'geojson',
            data: mapFileData.current,
          },
          paint: {
            'circle-color': '#dd502c',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#dd502c',
            'circle-opacity': 0.5,
            "circle-radius": {
              property: 'value',
              stops: [
                [2, 5],
                [1000, 10],
                [8000, 20],
              ]
            }
          }
        }); */

        map.on("click", (e) => {
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
          map.setFilter("counties-highlighted", ["in", "name", []]);

          if (names.length > 0) {
            const newSelectedFeature = mapFileData.current["features"].filter(
              (f) => f["properties"].name === names[0]
            );

            console.log("newSelectedFeature: ", newSelectedFeature);
            setFeature(newSelectedFeature);

            setRegionName(names[0]);
            map.setFilter("counties-highlighted", ["in", "name", ...names]);
            handleClickRegion();

            //ADDED
            console.log("mapfiledata.current: ", mapFileData.current.features);
            map.getSource("counties").setData(mapFileData.current.features);
            // map.setPaintProperty("counties", "fill-color");
          } else {
            setFeature([]);
            map.setFilter("counties-highlighted", ["in", "name", ...names]);
          }
        });

        map.on("mousemove", (event) => {
          const regions = map.queryRenderedFeatures(event.point, {
            layers: ["counties"],
          });

          if (regions.length > 0) {
            const tempFeature = mapFileData.current["features"].find(
              (m) => m["properties"].name === regions[0]["properties"].name
            );

            var data = tempFeature["properties"]["mapbook_data"];

            if (data === undefined) {
              setHoverData(regions[0]["properties"].name + "No data");
            } else {
              const formattedData =
                templateHoverType.current === "Thematic Map"
                  ? Object.keys(data)
                      .map((key) => {
                        const nestedProperties = Object.keys(data[key])
                          .map(
                            (nestedKey) =>
                              `${nestedKey}:${data[key][nestedKey]}`
                          )
                          .join("\n");
                        return `${key}: \n${nestedProperties}`;
                      })
                      .join("\n")
                  : Object.keys(data)
                      .map((key) => `${key}:${data[key]}`)
                      .join("\n");
              // console.log(data, formattedData);
              // console.log(regions[0]["properties"].name + "\n" + formattedData);

              if (templateHoverType.current === "Pie Chart") {
                //ok
                console.log("Calling PIE");
                setHoverData(
                  regions[0]["properties"].name + "\n" + formattedData
                );
              } else if (templateHoverType.current === "Bar Chart") {
                //ok
                console.log("Calling BAR");
                setHoverData(
                  regions[0]["properties"].name + "\n" + formattedData
                );
              } else if (templateHoverType.current === "Heat Map") {
                console.log("Calling HEAT");
                setHoverData(
                  regions[0]["properties"].name + "\n" + formattedData
                );
              } else if (templateHoverType.current === "Thematic Map") {
                console.log("Calling THEMATIC");
                setHoverData(
                  regions[0]["properties"].name + "\n" + formattedData
                );
              } else if (templateHoverType.current === "Circle Map") {
                console.log("Calling CIRCLE");
                setHoverData(
                  regions[0]["properties"].name + "\n" + formattedData
                );
              }
              // setHoverData(
              //   JSON.stringify(tempFeature["properties"].mapbook_data)
              // );
              // console.log(formattedData);
              // setHoverData(formattedData);
            }
          }
        });
      });
    }

    mapRef.current = map;
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
    } else {
      // alert(`Error: ${res.status} - ${res.statusText}`);
      alert("Check that all input fields have values");
    }
  };

  // Click Create Map Btn
  const handleCreateMap = async () => {
    const geoJSONObject = mapFileData.current;
    const mapFile = saveGeoJSONToFile(
      geoJSONObject,
      `${mapFileData.current["mapbook_mapname"]}.geojson`
    );
    createMap(mapFile);
  };

  return (
    <div className="addmapdata_center">
      <div className="map_toolbar_container">
        <div className="map_undo_redo_container">
          <i
            className="undo bx bx-undo"
            disabled={undoStack.length === 0}
            onClick={handleUndo}
          />
          <div className="vertical_line_container">|</div>
          <i
            className="redo bx bx-redo"
            disabled={redoStack.length === 0}
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
            selectedMapFile={mapFileData.current}
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
            selectedMapFile={mapFileData.current}
            setInputData={setInputData}
            regionName={regionName}
            handleRerender={handleRerender}
          />
        )}

        {/* Thematic Modal */}
        {showModalThematic && (
          <ThematicDataInput
            showModalThematic={showModalThematic}
            setShowModalThematic={setShowModalThematic}
            handleAddData={handleAddData}
            selectedMapFile={mapFileData.current}
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
