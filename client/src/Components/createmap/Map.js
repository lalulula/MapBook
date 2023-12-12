import React, { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl"; // Import mapboxgl
import { createMapAPIMethod } from "../../api/map";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./createMap.css";
import * as turf from '@turf/turf'

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
        ["get", "value", ["get", "mapbook_data"]],
      ];

      console.log("mapFileData.current: ", mapFileData.current);

      var heatRangeFrom = Number(mapFileData.current.mapbook_heatrange.from);
      var heatRangeTo = Number(mapFileData.current.mapbook_heatrange.to);
      var range = ((heatRangeTo - heatRangeFrom) / 5);
      // console.log(heatRangeFrom, heatRangeTo, range)
      // console.log(typeof(heatRangeFrom), typeof(heatRangeTo), typeof(range), typeof(heatRangeFrom + range))

      let expHeatColorByValue = ["case"];
      for (var i = 0; i < 5; i++) {
        expHeatColorByValue.push(['all', ['>=', expValue, heatRangeFrom], ['<', expValue, heatRangeFrom + range]])
        expHeatColorByValue.push(mapFileData.current.mapbook_heat_selectedcolors[i]);
        heatRangeFrom = heatRangeFrom + range;
      }
      expHeatColorByValue.push("#000000");

      // console.log("heatData", inputData, "namesdata", namesDataAdded);

      let value = inputData["value"];
      let color = inputData["color"];
      console.log(value, color);
      mapRef.current.setLayoutProperty(
        "counties-heat",
        "visibility",
        "visible"
      );
      mapRef.current.setPaintProperty("counties-heat", "fill-color", expHeatColorByValue);
      mapRef.current.setFilter("counties-heat", [
        "in",
        "name",
        ...namesDataAdded,
      ]);
    }
  }


  // const redrawCircleData = () => {

  //   if (templateHoverType.current === "Circle Map") {
  //     if (mapRef.current.getLayer("counties-circles")) {
  //       mapRef.current.removeLayer("counties-circles");
  //     }
  //     if (mapRef.current.getSource("circles")) {
  //       mapRef.current.removeSource("circles");
  //     }

  //     // ME

  //     mapRef.current.addSource("circles", {
  //       type: "geojson",
  //       //data: mapFileData.current,
  //       data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
  //       'cluster': true,
  //       'clusterRadius': 80,
  //     });

  //     console.log("getsourcecircles:", mapRef.current.getSource('circles'));
  //     // console.log("SDHFOIS22", mapRef.current.querySourceFeatures('circles'));

  //     mapRef.current.addLayer({
  //       'id': 'circle_shape',
  //       'type': 'circle',
  //       'source': 'circles',
  //       'filter': ['!=', 'cluster', true],
  //       'paint': {
  //         'circle-color': "blue",
  //         'circle-opacity': 0.6,
  //         'circle-radius': 12
  //       }
  //     });

  //     mapRef.current.addLayer({
  //       'id': 'circle_label',
  //       'type': 'symbol',
  //       'source': 'circles',
  //       'filter': ['!=', 'cluster', true],
  //       'layout': {
  //         'text-field': [
  //           'number-format',
  //           ['get', 'mag'],
  //           { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }


  //         ],
  //         'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
  //         'text-size': 10
  //       },
  //       'paint': {
  //         'text-color': [
  //           'case',
  //           ['<', ['get', 'mag'], 3],
  //           'black',
  //           'white'
  //         ]
  //       }
  //     });
  //     const markers = {};
  //     let markersOnScreen = {};

  //     function updateMarkers() {
  //       const newMarkers = {};
  //       // const features = mapRef.current.getSource('circles')._data.features;
  //       const features = mapFileData.current.querySourceFeatures('circles');
  //       // console.log("features in update markers: ", features);

  //       // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
  //       // and add it to the map if it's not there already
  //       for (const feature of features) {
  //         const coords = feature.geometry.coordinates;
  //         // const coords = [-151.5129, 63.1016, 0.0];
  //         const props = feature.properties;
  //         // const props = { "id": "ak16994521", "mag": 2.3, "time": 1507425650893, "felt": null, "tsunami": 0 };
  //         console.log("is this working???????????????????", props);

  //         if (!props.cluster) continue;
  //         const id = props.name;
  //         console.log("is this working???????????????????");

  //         let marker = markers[id];
  //         console.log("2is this working???????????????????");

  //         if (!marker) {
  //           const el = createDonutChart(props);
  //           marker = markers[id] = new mapboxgl.Marker({
  //             element: el
  //           }).setLngLat(coords);
  //         }
  //         newMarkers[id] = marker;

  //         if (!markersOnScreen[id]) marker.addTo(mapRef.current);
  //       }
  //       // for every marker we've added previously, remove those that are no longer visible
  //       for (const id in markersOnScreen) {
  //         if (!newMarkers[id]) markersOnScreen[id].remove();
  //       }
  //       markersOnScreen = newMarkers;
  //     }

  //     // after the GeoJSON data is loaded, update markers on the screen on every frame
  //     mapRef.current.on('render', () => {
  //       if (!mapRef.current.isSourceLoaded('circles')) return;
  //       updateMarkers();
  //     });
  //   }
  // }

  // function createDonutChart(props) {
  //   const total = props.mag;

  //   const fontSize =
  //     total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
  //   const r =
  //     total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
  //   const r0 = Math.round(r * 0.6);
  //   const w = r * 2;

  //   const html = `<div>
  //     <svg width="${w}" height="${w}" viewBox="0 0 ${w} ${w}" text-anchor="middle" style="font: ${fontSize}px sans-serif; display: block">
  //       ${donutSegment(0, 1, r, r0, props.color)}
  //       <circle cx="${r}" cy="${r}" r="${r0}" fill="white" />
  //       <text dominant-baseline="central" transform="translate(${r}, ${r})">
  //         ${total.toLocaleString()}
  //       </text>
  //     </svg>
  //   </div>`;

  //   const el = document.createElement('div');
  //   el.innerHTML = html;
  //   return el.firstChild;
  // }

  // function donutSegment(start, end, r, r0, color) {
  //   if (end - start === 1) end -= 0.00001;
  //   const a0 = 2 * Math.PI * (start - 0.25);
  //   const a1 = 2 * Math.PI * (end - 0.25);
  //   const x0 = Math.cos(a0),
  //     y0 = Math.sin(a0);
  //   const x1 = Math.cos(a1),
  //     y1 = Math.sin(a1);
  //   const largeArc = end - start > 0.5 ? 1 : 0;

  //   // draw an SVG path
  //   return `<path d="M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${r + r * y0
  //     } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${r + r0 * x1
  //     } ${r + r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${r + r0 * y0
  //     }" fill="${color}" />`;
  // }




  // CLUSTER APPROACH
  const redrawCircleData = () => {

    if (templateHoverType.current === "Circle Map") {
      if (mapRef.current.getLayer("counties-circles")) {
        mapRef.current.removeLayer("counties-circles");
      }
      if (mapRef.current.getSource("circles")) {
        mapRef.current.removeSource("circles");
      }

      console.log("mapfile.current: ", mapFileData.current);

      const featureDataAdded = mapFileData.current["features"].filter(
        (f) => f["properties"].mapbook_data != null
      );

      mapRef.current.addSource('circles', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        //data: mapFileData.current,
        // data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        data: mapFileData.current,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });

      mapRef.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'circles',
        filter: ['has', 'point_count'],
        paint: {
          // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      mapRef.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'circles',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      mapRef.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'circles',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });
    }
    /* const featureDataAdded = mapFileData.current["features"].filter(
      (f) => f["properties"].mapbook_data != null
    );
    var namesDataAdded = [];
    featureDataAdded.forEach((element) => { //adding mapbook data to each feature
      namesDataAdded.push(element["properties"].name);
    });
    mapRef.current.setFilter("counties-circles", [
      "in",
      "name",
      ...namesDataAdded,
    ]); */
  }




  // ATTEMPT 2 -------------------------------
  /* const redrawCircleData = () => {
    const mag1 = ['<', ['get', 'mag'], 2];
    const mag2 = ['all', ['>=', ['get', 'mag'], 2], ['<', ['get', 'mag'], 3]];
    const mag3 = ['all', ['>=', ['get', 'mag'], 3], ['<', ['get', 'mag'], 4]];
    const mag4 = ['all', ['>=', ['get', 'mag'], 4], ['<', ['get', 'mag'], 5]];
    const mag5 = ['>=', ['get', 'mag'], 5];
   
    const colors = ['#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c'];
   
    if (templateHoverType.current === "Circle Map") {
      if (mapRef.current.getLayer("counties-circle")) {
        mapRef.current.removeLayer("counties-circle");
        mapRef.current.removeSource("circles"); //TEMPORARY FIX
      }
      if (mapRef.current.getSource("circles")) {
        console.log("REMOVED circle");
        mapRef.current.removeSource("circles");
      }
   
      mapRef.current.addSource("circles", {
        type: "geojson",
        data: mapFileData.current,
        // 'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        'cluster': true,
        'clusterRadius': 80,
        'clusterProperties': {
          // keep separate counts for each magnitude category in a cluster
          'mag1': ['+', ['case', mag1, 1, 0]],
          'mag2': ['+', ['case', mag2, 1, 0]],
          'mag3': ['+', ['case', mag3, 1, 0]],
          'mag4': ['+', ['case', mag4, 1, 0]],
          'mag5': ['+', ['case', mag5, 1, 0]]
        },
      });
   
      console.log("SDHFOIS", mapRef.current.getSource('circles'));
      console.log("SDHFOIS22", mapRef.current.querySourceFeatures('circles'));
   
      mapRef.current.addLayer({
        'id': 'circle_shape',
        'type': 'circle',
        'source': 'circles',
        'filter': ['!=', 'cluster', true],
        'paint': {
          'circle-color': [
            'case',
            mag1,
            colors[0],
            mag2,
            colors[1],
            mag3,
            colors[2],
            mag4,
            colors[3],
            colors[4]
          ],
          'circle-opacity': 0.6,
          'circle-radius': 12
        }
      });
   
      mapRef.current.addLayer({
        'id': 'circle_label',
        'type': 'symbol',
        'source': 'circles',
        'filter': ['!=', 'cluster', true],
        'layout': {
          'text-field': [
            'number-format',
            ['get', 'mag'],
            { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }
   
   
          ],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-size': 10
        },
        'paint': {
          'text-color': [
            'case',
            ['<', ['get', 'mag'], 3],
            'black',
            'white'
          ]
        }
      });
      const markers = {};
      let markersOnScreen = {};
   
      function updateMarkers() {
        const newMarkers = {};
        const features = mapRef.current.getSource('circles')._data.features;
        console.log("features in update markers: ", features);
   
        // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
        // and add it to the map if it's not there already
        for (const feature of features) {
          // const coords = feature.geometry.coordinates;
          const coords = [-151.5129, 63.1016, 0.0];
          // const props = feature.properties;
          console.log("feature.properties: ", feature.properties);
          console.log("currentmap: ", mapFileData);
          const props = { "id": "ak16994521", "mag": 2.3, "time": 1507425650893, "felt": null, "tsunami": 0 };
          if (!props.cluster) continue;
          const id = props.cluster_id;
   
          let marker = markers[id];
          if (!marker) {
            const el = createDonutChart(props);
            marker = markers[id] = new mapboxgl.Marker({
              element: el
            }).setLngLat(coords);
          }
          newMarkers[id] = marker;
   
          if (!markersOnScreen[id]) marker.addTo(mapRef.current);
        }
        // for every marker we've added previously, remove those that are no longer visible
        for (const id in markersOnScreen) {
          if (!newMarkers[id]) markersOnScreen[id].remove();
        }
        markersOnScreen = newMarkers;
      }
   
      // after the GeoJSON data is loaded, update markers on the screen on every frame
      mapRef.current.on('render', () => {
        if (!mapRef.current.isSourceLoaded('circles')) return;
        updateMarkers();
      });
    }
   
    function createDonutChart(props) { //pass in features.properties
      const offsets = [];
      const counts = [
        props.mag1,
        props.mag2,
        props.mag3,
        props.mag4,
        props.mag5
      ];
      let total = 0;
      for (const count of counts) {
        offsets.push(total);
        total += count;
      }
      const fontSize =
        total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
      const r =
        total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
      const r0 = Math.round(r * 0.6);
      const w = r * 2;
   
      let html = `<div>
      <svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" style="font: ${fontSize}px sans-serif; display: block">`;
   
      for (let i = 0; i < counts.length; i++) {
        html += donutSegment(
          offsets[i] / total,
          (offsets[i] + counts[i]) / total,
          r,
          r0,
          colors[i]
        );
      }
      html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" />
      <text dominant-baseline="central" transform="translate(${r}, ${r})">
      ${total.toLocaleString()}
      </text>
      </svg>
      </div>`;
   
      const el = document.createElement('div');
      el.innerHTML = html;
      return el.firstChild;
    }
   
    function donutSegment(start, end, r, r0, color) {
      if (end - start === 1) end -= 0.00001;
      const a0 = 2 * Math.PI * (start - 0.25);
      const a1 = 2 * Math.PI * (end - 0.25);
      const x0 = Math.cos(a0),
        y0 = Math.sin(a0);
      const x1 = Math.cos(a1),
        y1 = Math.sin(a1);
      const largeArc = end - start > 0.5 ? 1 : 0;
   
      // draw an SVG path
      return `<path d="M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${r + r * y0
        } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${r + r0 * x1
        } ${r + r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${r + r0 * y0
        }" fill="${color}" />`;
    }
  } */
  // END ATTEMPT 2 -------------------------------




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
    redrawCircleData();
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
        const points = turf.featureCollection([]);
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

        ////// HANEUL
        map.addLayer(
          {
            id: `counties-thematic`,
            type: "fill",
            source: "counties",
            'layout': {
              // Make the layer visible by default.
              'visibility': 'none'
            },
            paint: {
              "fill-outline-color": "#484896", //Fill color
              'fill-color': '#faafee',
              "fill-opacity": 1,
            },
          }
          // "building"
        );

        map.addLayer(
          {
            id: `counties-circles`,
            type: "fill",
            source: "counties",
            'layout': {
              // Make the layer visible by default.
              'visibility': 'none'
            },
            paint: {
              "fill-outline-color": "#484896", //Fill color
              'fill-color': '#faafee',
              "fill-opacity": 1,
            },
          }
        );





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
      view_count: 1,
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
