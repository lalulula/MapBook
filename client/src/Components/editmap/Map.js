import React, { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl"; // Import mapboxgl
import { editMapPostAPIMethodWithFile } from "../../api/map";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./createMap.css";
import * as turf from "@turf/turf";
import polylabel from "polylabel";
import html2canvas from "html2canvas";
import { easeInOut, motion } from "framer-motion";
import PieBarDataInput from "./modals/PieBarDataInput";
import CircleDataInput from "./modals/CircleDataInput";
import ThematicDataInput from "./modals/ThematicDataInput";
import HeatDataInput from "./modals/HeatDataInput";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement);

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
  isMapbookData,
  setIsMapbookData,
  setMapImage,
  mapImage,
  mapId,
  fixData,
  setFixData,
}) => {
  const mapFileData = useRef(selectedMapFile);
  const mapRef = useRef();
  const fixDataRef = useRef(fixData);

  const [regionName, setRegionName] = useState("");

  useEffect(() => {}, [template]);

  useEffect(() => {
    if (fixDataRef.current) {
      if (!fixData) {
        resetMap();
      }
    }
    fixDataRef.current = fixData;
  }, [fixData]);

  useEffect(() => {
    mapFileData.current = {
      ...mapFileData.current,
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
  }, [options, pieBarData, themeData, heatRange, selectedColors]);

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
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const templateHoverType = useRef([]);
  const mapContainerRef = useRef(null);
  const userId = useSelector((state) => state.user.id);
  const [rerenderFlag, setRerenderFlag] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const pieChartData = useRef([]);
  const barChartData = useRef([]);
  const navigate = useNavigate();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isCanvasLoaded, setIsCanvasLoaded] = useState(true);
  const [startDataEditModal, setStartDataEditModal] = useState(false);

  const handleRerender = () => {
    setRerenderFlag(!rerenderFlag);
  };
  useEffect(() => {}, [undoStack, redoStack]);
  const resetMap = () => {
    undoStack.current = [];
    redoStack.current = [];
    const newState = { ...mapFileData.current };
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
    mapFileData.current = newState;

    if (isMapLoaded) {
      redrawThematicData();
      redrawHeatData();
      redrawCircleData();
    }
  };

  useEffect(() => {
    templateHoverType.current = template;
    if (!isMapbookData) {
      resetMap();
      setFixData(false);
    }
  }, [template]);

  const handleClickRegion = () => {
    if (fixDataRef.current) {
      // setShowPopup(false);
      setSelectedMapFile((prevMapFile) => {
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
    } else {
      setStartDataEditModal(true);
    }
  };

  const handlePieBarInputChange = (data, value) => {
    setInputData((prevInputData) => ({
      ...prevInputData,
      [data["dataName"]]: { color: data["color"], value: value },
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

      const featureDataAdded = mapFileData.current["features"].filter(
        (f) => f["properties"].mapbook_data != null
      );
      var namesDataAdded = [];
      featureDataAdded.forEach((element) => {
        if (
          Object.keys(element["properties"].mapbook_data).length <
          themeData.length
        ) {
          delete element["properties"].mapbook_data;
        } else {
          namesDataAdded.push(element["properties"].name);
        }
      });

      let dataNames = [];
      themeData.forEach((data) => {
        dataNames.push(data.dataName);
      });

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

      let expGetMaximumColor = ["case"];
      for (let i = 0; i < values.length; i++) {
        const statement = ["==", values[i], expMaximumValue];
        expGetMaximumColor.push(statement);
        expGetMaximumColor.push(mapFileData.current.mapbook_themedata[i].color);
      }
      expGetMaximumColor.push("#000000");

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
    } else {
      if (mapRef.current.getLayer("counties-thematic")) {
        mapRef.current.setLayoutProperty(
          "counties-thematic",
          "visibility",
          "none"
        );
      }
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

      const featureDataAdded = mapFileData.current["features"].filter(
        (f) => f["properties"].mapbook_data != null
      );
      var namesDataAdded = [];
      featureDataAdded.forEach((element) => {
        namesDataAdded.push(element["properties"].name);
      });

      const expValue = ["to-number", ["get", "value", ["get", "mapbook_data"]]];

      var heatRangeFrom = Number(mapFileData.current.mapbook_heatrange.from);
      var heatRangeTo = Number(mapFileData.current.mapbook_heatrange.to);
      var range = (heatRangeTo - heatRangeFrom) / 5;

      let expHeatColorByValue = ["case"];
      for (var i = 0; i < 5; i++) {
        expHeatColorByValue.push([
          "all",
          [">=", expValue, heatRangeFrom],
          ["<", expValue, heatRangeFrom + range],
        ]);
        expHeatColorByValue.push(
          mapFileData.current.mapbook_heat_selectedcolors[i]
        );
        heatRangeFrom = heatRangeFrom + range;
      }
      expHeatColorByValue.push("#000000");

      mapRef.current.setLayoutProperty(
        "counties-heat",
        "visibility",
        "visible"
      );
      mapRef.current.setPaintProperty(
        "counties-heat",
        "fill-color",
        expHeatColorByValue
      );
      mapRef.current.setFilter("counties-heat", [
        "in",
        "name",
        ...namesDataAdded,
      ]);
    } else {
      if (mapRef.current.getLayer("counties-heat")) {
        mapRef.current.setLayoutProperty("counties-heat", "visibility", "none");
      }
    }
  };

  function calcPolygonArea(vertices) {
    var total = 0;

    for (var i = 0, l = vertices.length; i < l; i++) {
      var addX = vertices[i][0];
      var addY = vertices[i === vertices.length - 1 ? 0 : i + 1][1];
      var subX = vertices[i === vertices.length - 1 ? 0 : i + 1][0];
      var subY = vertices[i][1];

      total += addX * addY * 0.5;
      total -= subX * subY * 0.5;
    }

    return Math.abs(total);
  }

  // CLUSTER APPROACH
  const redrawCircleData = () => {
    if (templateHoverType.current === "Circle Map") {
      if (mapRef.current.getLayer("clusters")) {
        mapRef.current.removeLayer("clusters");
      }
      if (mapRef.current.getLayer("cluster-count")) {
        mapRef.current.removeLayer("cluster-count");
      }
      if (mapRef.current.getLayer("unclustered-point")) {
        mapRef.current.removeLayer("unclustered-point");
      }
      if (mapRef.current.getSource("circles")) {
        mapRef.current.removeSource("circles");
      }

      let dataName = mapFileData.current["mapbook_circleheatmapdata"];

      const expValue = [
        "to-number",
        ["get", dataName, ["get", "mapbook_data"]],
      ];

      const featureDataAdded = mapFileData.current["features"].filter(
        (f) => f["properties"].mapbook_data != null
      );

      var namesDataAdded = [];
      featureDataAdded.forEach((element) => {
        //adding mapbook data to each feature
        namesDataAdded.push(element["properties"].name);
      });

      var JsonBasedOnPoint = structuredClone(mapFileData.current);
      var newGeometry;
      for (var i = 0; i < mapFileData.current["features"].length; i++) {
        if (mapFileData.current["features"][i].geometry.type === "Polygon") {
          newGeometry = {
            type: "Point",
            coordinates: polylabel(
              mapFileData.current["features"][i].geometry.coordinates,
              1.0
            ),
          };
        } else {
          let maxArea = 0;
          let maxPoint = [];
          for (
            var j = 0;
            j < mapFileData.current["features"][i].geometry.coordinates.length;
            j++
          ) {
            var polygonArea = calcPolygonArea(
              mapFileData.current["features"][i].geometry.coordinates[j][0]
            );
            if (maxArea < polygonArea) {
              maxArea = polygonArea;
              maxPoint = polylabel(
                mapFileData.current["features"][i].geometry.coordinates[j]
              );
            }
          }
          newGeometry = { type: "Point", coordinates: maxPoint };
        }
        JsonBasedOnPoint["features"][i].geometry = newGeometry;
      }

      mapRef.current.addSource("circles", {
        type: "geojson",
        data: JsonBasedOnPoint,
      });

      mapRef.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "circles",
        paint: {
          "circle-translate": [0, 0],
        },
      });

      mapRef.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "circles",
        layout: {
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      mapRef.current.setFilter("clusters", ["in", "name", ...namesDataAdded]);

      mapRef.current.setFilter("cluster-count", [
        "in",
        "name",
        ...namesDataAdded,
      ]);

      mapRef.current.setLayoutProperty("cluster-count", "text-field", [
        "to-string",
        expValue,
      ]);

      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      mapRef.current.setPaintProperty("clusters", "circle-color", [
        "case",
        ["<", expValue, 100],
        "#51bbd6",
        ["all", [">=", expValue, 100], ["<", expValue, 750]],
        "#f1f075",
        "#f28cb1",
      ]);

      mapRef.current.setPaintProperty("clusters", "circle-radius", [
        "case",
        ["<", expValue, 100],
        20,
        ["all", [">=", expValue, 100], ["<", expValue, 750]],
        30,
        40,
      ]);
    } else {
      if (mapRef.current.getLayer("clusters")) {
        mapRef.current.setLayoutProperty("clusters", "visibility", "none");
      }
      if (mapRef.current.getLayer("cluster-count")) {
        mapRef.current.setLayoutProperty("cluster-count", "visibility", "none");
      }
    }
  };

  // PIE
  const redrawPieData = async () => {
    if (templateHoverType.current === "Pie Chart") {
      if (mapRef.current.getLayer("counties-pie")) {
        mapRef.current.removeLayer("counties-pie");
      }
      if (mapRef.current.getSource("pie")) {
        mapRef.current.removeSource("pie");
      }

      const featureDataAdded = mapFileData.current["features"].filter(
        (f) => f["properties"].mapbook_data != null
      );

      const newPieChartData = [];

      var namesDataAdded = [];
      featureDataAdded.forEach((element) => {
        //adding mapbook data to each feature
        namesDataAdded.push(element["properties"].name);

        var tempPieChartData = {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: [],
            },
          ],
        };

        var keys = Object.keys(element["properties"].mapbook_data);
        keys.forEach((name) => {
          tempPieChartData.labels.push(name);
          tempPieChartData.datasets[0].data.push(
            element["properties"].mapbook_data[name].value
          );
          tempPieChartData.datasets[0].backgroundColor.push(
            element["properties"].mapbook_data[name].color
          );
        });
        newPieChartData.push([element["properties"].name, tempPieChartData]);
      });
      barChartData.current = [];
      pieChartData.current = newPieChartData;

      // wait till canvas is re-rander
      await new Promise((resolve) => setTimeout(resolve, 100));

      mapRef.current.addSource("pie", {
        type: "geojson",
        data: mapFileData.current,
        // cluster: true,
        // clusterMaxZoom: 14, // Max zoom to cluster points on
        // clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      mapRef.current.addLayer({
        id: "counties-pie",
        type: "symbol",
        source: "pie",
        layout: {
          "icon-size": 1,
        },
      });

      mapRef.current.setFilter("counties-pie", [
        "in",
        "name",
        ...namesDataAdded,
      ]);

      /// Haneul
      var expImageSelect = ["case"];
      // generate image object for region which data exist
      try {
        namesDataAdded.forEach((name) => {
          // generate image

          const canvasSave = document.getElementById(name + "pie");

          var context = canvasSave.getContext("2d");

          var imgData = context.getImageData(
            0,
            0,
            canvasSave.width,
            canvasSave.height
          );

          // add image that we generate
          if (mapRef.current.hasImage(name)) {
            mapRef.current.removeImage(name);
          }
          mapRef.current.addImage(name, imgData);

          // add expImageSelect on new image
          expImageSelect.push(["==", ["get", "name"], name]);
          expImageSelect.push(name);
        });
        //set default image (anything is okay)
        expImageSelect.push("aaa");

        mapRef.current.setLayoutProperty(
          "counties-pie",
          "icon-image",
          expImageSelect
        );
        setIsCanvasLoaded(true);
      } catch (error) {
        // set isCanvasLoaded false
        setIsCanvasLoaded(false);
      }
    } else {
      if (mapRef.current.getLayer("counties-pie")) {
        mapRef.current.setLayoutProperty("counties-pie", "visibility", "none");
      }
    }
  };

  // PIE
  const redrawBarData = async () => {
    if (templateHoverType.current === "Bar Chart") {
      if (mapRef.current.getLayer("counties-bar")) {
        mapRef.current.removeLayer("counties-bar");
      }
      if (mapRef.current.getSource("bar")) {
        mapRef.current.removeSource("bar");
      }

      const featureDataAdded = mapFileData.current["features"].filter(
        (f) => f["properties"].mapbook_data != null
      );

      const newBarChartData = [];

      var namesDataAdded = [];
      featureDataAdded.forEach((element) => {
        //adding mapbook data to each feature
        namesDataAdded.push(element["properties"].name);

        var tempBarChartData = {
          labels: [""],
          datasets: [],
        };

        var keys = Object.keys(element["properties"].mapbook_data);
        keys.forEach((name) => {
          var tempDataset = { data: [] };
          tempDataset.label = name;
          tempDataset.data.push(element["properties"].mapbook_data[name].value);
          tempDataset.backgroundColor =
            element["properties"].mapbook_data[name].color;

          tempBarChartData.datasets.push(tempDataset);
        });
        newBarChartData.push([element["properties"].name, tempBarChartData]);
      });
      pieChartData.current = [];
      barChartData.current = newBarChartData;

      // wait till canvas is re-rander
      await new Promise((resolve) => setTimeout(resolve, 100));

      mapRef.current.addSource("bar", {
        type: "geojson",
        data: mapFileData.current,
      });

      mapRef.current.addLayer({
        id: "counties-bar",
        type: "symbol",
        source: "bar",
        layout: {
          "icon-size": 1,
        },
      });

      mapRef.current.setFilter("counties-bar", [
        "in",
        "name",
        ...namesDataAdded,
      ]);

      var expImageSelect = ["case"];
      try {
        // generate image object for region which data exist
        namesDataAdded.forEach((name) => {
          const canvasSave = document.getElementById(name + "bar");

          var context = canvasSave.getContext("2d");
          var imgData = context.getImageData(
            0,
            0,
            canvasSave.width,
            canvasSave.height
          );

          // add image that we generate
          if (mapRef.current.hasImage(name)) {
            mapRef.current.removeImage(name);
          }
          mapRef.current.addImage(name, imgData);

          // add expImageSelect on new image
          expImageSelect.push(["==", ["get", "name"], name]);
          expImageSelect.push(name);
        });
        //set default image (anything is okay)
        expImageSelect.push("aaa");

        mapRef.current.setLayoutProperty(
          "counties-bar",
          "icon-image",
          expImageSelect
        );
        setIsCanvasLoaded(true);
      } catch (error) {
        // set isCanvasLoaded false
        setIsCanvasLoaded(false);
      }
    } else {
      if (mapRef.current.getLayer("counties-bar")) {
        mapRef.current.setLayoutProperty("counties-bar", "visibility", "none");
      }
    }
  };

  const handleAddData = (e) => {
    e.preventDefault();

    // for undo/redo
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
    redrawCircleData();
    redrawPieData();
    redrawBarData();
  };

  const handleUndo = () => {
    if (undoStack.current.length !== 0) {
      // pop {a} from undo stack
      const popedState = undoStack.current.pop();

      // push current state into redo stack
      redoStack.current.push(mapFileData.current);

      // change current state to {a}
      // setSelectedMapFile(popedState => (popedState))
      mapFileData.current = popedState;

      setSelectedMapFile(mapFileData.current);
      redrawHeatData();
      redrawThematicData();
      redrawCircleData();
      redrawPieData();
      redrawBarData();
    }
  };

  const handleRedo = () => {
    if (redoStack.current.length !== 0) {
      // pop {a} from redo stack
      const popedState = redoStack.current.pop();
      // push current state into undo stack
      undoStack.current.push(mapFileData.current);

      // change current state to {a}
      // setSelectedMapFile(popedState)
      mapFileData.current = popedState;

      setSelectedMapFile(mapFileData.current);

      redrawThematicData();
      redrawHeatData();
      redrawCircleData();
      redrawPieData();
      redrawBarData();
    }
  };

  const handleChangeState = () => {
    // push the state which is right before current change into undo stack
    undoStack.current.push(structuredClone(mapFileData.current));

    // clear redo stack
    redoStack.current = [];
  };

  function calculateCentroid(features) {
    let totalX = 0;
    let totalY = 0;
    let count = 0;

    // Loop through features and sum up coordinates
    features.forEach((feature) => {
      const coordinates = feature.geometry.coordinates[0]; // Assuming the first ring of the polygon
      if (typeof coordinates == "number") {
        return;
      }
      if (coordinates.length > 1) {
        coordinates.forEach((coord) => {
          if (typeof coord[0] == "number" && typeof coord[0] == "number") {
            totalX += coord[0];
            totalY += coord[1];
            count++;
          } else {
            coord.forEach((c) => {
              if (typeof coord[0] == "number" && typeof coord[0] == "number") {
                totalX += coord[0];
                totalY += coord[1];
                count++;
              }
            });
          }
        });
      } else {
        coordinates[0].forEach((coord) => {
          if (typeof coord[0] == "number" && typeof coord[0] == "number") {
            totalX += coord[0];
            totalY += coord[1];
            count++;
          }
        });
      }
    });

    const avgX = totalX / count;
    const avgY = totalY / count;
    return [avgX, avgY];
  }

  useEffect(() => {
    // TODO: make lowercase name
    // Name NAME -> name
    if (mapFileData.current != null) {
      if (mapFileData.current["features"][0].properties.name == null) {
        if (mapFileData.current["features"][0].properties.Name != null) {
          for (var i = 0; i < mapFileData.current["features"].length; i++) {
            mapFileData.current["features"][i].properties.name =
              mapFileData.current["features"][i].properties.Name;
          }
        } else if (mapFileData.current["features"][0].properties.NAME != null) {
          for (i = 0; i < mapFileData.current["features"].length; i++) {
            mapFileData.current["features"][i].properties.name =
              mapFileData.current["features"][i].properties.NAME;
          }
        }
      }
    }

    // mapFileData.current

    let map;
    const centroid = calculateCentroid(selectedMapFile.features);

    mapboxgl.accessToken = MAPBOX_TOKEN;
    if (mapContainerRef.current) {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
        preserveDrawingBuffer: true,
      });
      map.setCenter(centroid);
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
        map.addSource("counties", {
          type: "geojson",
          data: mapFileData.current,
        });

        map.addLayer({
          id: "counties",
          type: "fill",
          source: "counties",
          paint: {
            "fill-color": "#454545", //default map color
            "fill-opacity": 0.4,
            "fill-outline-color": "#000000",
          },
        });

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

            setFeature(newSelectedFeature);

            setRegionName(names[0]);
            map.setFilter("counties-highlighted", ["in", "name", ...names]);
            handleClickRegion();

            //ADDED
            map.getSource("counties").setData(mapFileData.current.features);
          } else {
            setFeature([]);
            map.setFilter("counties-highlighted", ["in", "name", ...names]);
          }
        });

        map.on("mousemove", (event) => {
          const regions = map.queryRenderedFeatures(event.point, {
            layers: ["counties"],
          });

          if (regions.length === 0) {
            setHoverData("Out of range");
          }
          if (regions.length > 0) {
            const tempFeature = mapFileData.current["features"].find(
              (m) => m["properties"].name === regions[0]["properties"].name
            );

            var data = tempFeature["properties"]["mapbook_data"];
            const isObject = (value) => {
              return typeof value === "object" && value !== null;
            };
            const renderObject = (obj) => {
              return `<span>${Object.keys(obj)
                .map((nestedKey) => {
                  const value = obj[nestedKey];
                  return ` ${
                    nestedKey.toLowerCase() === "color"
                      ? `<font color="${value}">(${value})</font>`
                      : value
                  }`;
                })
                .join("<br/>")}</span>`;
            };

            if (data === undefined) {
              setHoverData(`No data for ${regions[0]["properties"].name}`);
            } else {
              const formatDataByKey = (key, value) => {
                return `${key}  ${
                  isObject(value) ? renderObject(value) : value
                }`;
              };

              const formatColorKey = (key, value) => {
                const formattedValue =
                  key.toLowerCase() === "color"
                    ? `<font color="${value}"> (${value})</font>`
                    : value;
                return `${formattedValue}`;
              };

              const formattedData = (() => {
                const dataKeys = Object.keys(data);

                switch (templateHoverType.current) {
                  case "Thematic Map":
                  case "Pie Chart":
                  case "Bar Chart":
                    return dataKeys
                      .map((key) => formatDataByKey(key, data[key]))
                      .join("<br/>");

                  case "Circle Map":
                    return dataKeys.map((key) => `${data[key]}`).join("\n");

                  default:
                    return dataKeys
                      .sort((a, b) => (a.toLowerCase() === "color" ? -1 : 1))
                      .map((key) => formatColorKey(key, data[key]))
                      .join("<br/>");
                }
              })();

              if (templateHoverType.current === "Pie Chart") {
                setHoverData(
                  regions[0]["properties"].name + "<br/><br/>" + formattedData
                );
              } else if (templateHoverType.current === "Bar Chart") {
                setHoverData(
                  regions[0]["properties"].name + "<br/><br/>" + formattedData
                );
              } else if (templateHoverType.current === "Heat Map") {
                const heatDataName =
                  mapFileData.current.mapbook_circleheatmapdata;

                setHoverData(
                  regions[0]["properties"].name +
                    "\n" +
                    heatDataName +
                    formattedData
                );
              } else if (templateHoverType.current === "Thematic Map") {
                setHoverData(
                  regions[0]["properties"].name + "<br/><br/>" + formattedData
                );
              } else if (templateHoverType.current === "Circle Map") {
                const circleDataName =
                  mapFileData.current.mapbook_circleheatmapdata;

                setHoverData(
                  regions[0]["properties"].name +
                    "\n" +
                    circleDataName +
                    "<br/><br/>" +
                    formattedData
                );
              }
            }
          }
        });

        setIsMapLoaded(true);
      });
    }

    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (isMapLoaded) {
      if (isMapbookData) {
        redrawThematicData();
        redrawHeatData();
        redrawCircleData();
        redrawPieData();
        redrawBarData();

        setIsMapbookData(false);
      }
    }
  }, [isMapLoaded]);

  useEffect(() => {
    if (!isCanvasLoaded) {
      redrawPieData();
      redrawBarData();
    }
  }, [isCanvasLoaded]);

  // Convert data to GEOJSON //
  function saveGeoJSONToFile(geoJSONObject, filename) {
    const geoJSONString = JSON.stringify(geoJSONObject);
    const newGeoJson = new File([geoJSONString], filename, {
      type: "application/json",
    });
    return newGeoJson;
  }

  async function imageUrlToFile(imageUrl, fileName) {
    try {
      // Fetch the image data
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a File object
      const file = new File([blob], fileName, {
        type: response.headers.get("content-type"),
      });

      return file;
    } catch (error) {
      console.error("Error converting image URL to File:", error);
      return null;
    }
  }

  const editMap = async (mapData) => {
    console.log("MAPIMG in editmap: ", mapImage);

    const canvas = await html2canvas(
      document.querySelector(".mapboxgl-canvas")
    );

    // console.log("canvas", canvas);
    // const mapImage2 = canvas.toDataURL();
    // console.log("mapimg2: ", mapImage2);

    let finalMapImg = mapImage;
    if (!(mapImage instanceof File)) {
      const fileName = "image.jpg";
      finalMapImg = await imageUrlToFile(mapImage, fileName);
    }

    console.log("finalmapimg: ", finalMapImg);

    const newMapObj = {
      map_name: options.name,
      topic: options.customTopic === "" ? options.topic : options.customTopic,
      is_visible: !options.isPrivate,
      user_id: userId,
      map_description: options.description,
      mapPreviewImg: finalMapImg,
      file: mapData,
    };

    const res = await editMapPostAPIMethodWithFile(mapId, newMapObj);

    if (res.ok) {
      // const responseMsg = await res.json;
      navigate("/mainpage");
      window.location.reload();
    } else {
      // alert(`Error: ${res.status} - ${res.statusText}`);
      setShowErrorMessage(true);
      // alert("Check that all input fields have values");
    }
  };

  // Click Edit Map Btn
  const handleEditMap = async () => {
    const geoJSONObject = mapFileData.current;
    const mapFile = saveGeoJSONToFile(
      geoJSONObject,
      `${mapFileData.current["mapbook_mapname"]}.geojson`
    );
    editMap(mapFile);
  };

  return (
    <div className="addmapdata_center">
      <motion.div
        initial={{ x: "200%" }}
        animate={{ x: !showErrorMessage ? "200%" : 0 }}
        transition={{ type: "tween", duration: 0.5, ease: easeInOut }}
        exit={{ x: "-100%" }}
        style={{
          position: "fixed",
          padding: "20px",
          zIndex: "100",
          top: "100px",
        }}
        className="createsocialpost_error_message"
      >
        Please fill everything out!
        <div
          className="createsocialpost_error_message_close"
          onClick={() => setShowErrorMessage(false)}
        >
          X
        </div>
      </motion.div>
      <div className="map_toolbar_container">
        <div className="map_undo_redo_container">
          <i
            className={`${
              undoStack.current.length === 0 ? "disabled_undo" : "undo"
            } bx bx-undo`}
            onClick={handleUndo}
          />
          <div className="vertical_line_container">|</div>
          <i
            className={`${
              redoStack.current.length === 0 ? "disabled_redo" : "redo"
            } bx bx-redo`}
            onClick={handleRedo}
          />
        </div>

        <button onClick={handleEditMap}>Save Changes</button>
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
            feature={feature}
            // CIRCLE
            options={options}
            setInputData={setInputData}
            handleRerender={handleRerender}
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
            feature={feature}
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
            feature={feature}
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
            heatRange={heatRange}
            selectedColors={selectedColors}
            feature={feature}
          />
        )}
      </div>

      {startDataEditModal && (
        <div className="mappdetails_reset_confirmation_modal">
          <div className="mapdetails_reset_confirmation_modal_top">
            You can not edit Data. Click Start editing data.
          </div>
          <div className="mapdetails_edit_confirmation_modal_bottom">
            <button
              className="mapdetails_reset_confirm"
              onClick={() => setStartDataEditModal(false)}
            >
              Ok
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          width: 50,
          height: 50,
          top: 100,
          left: -200,
          position: "absolute",
          // display:'none'
        }}
      >
        {pieChartData.current.length !== 0 &&
          pieChartData.current.map((item, index) => (
            <Pie
              id={item[0] + "pie"}
              data={item[1]}
              options={{
                animation: {
                  duration: 0,
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          ))}

        {barChartData.current.length !== 0 &&
          barChartData.current.map((item, index) => (
            <Bar
              id={item[0] + "bar"}
              data={item[1]}
              options={{
                animation: {
                  duration: 0,
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                    border: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                    border: {
                      display: false,
                    },
                  },
                },
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default Map;
