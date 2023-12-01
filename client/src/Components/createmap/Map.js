import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl"; // Import mapboxgl
import { createMapAPIMethod } from "../../api/map";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./createMap.css";

export const API_BASE_URL = process.env.REACT_APP_API_ROOT;

const Map = ({ selectedMapFile, options, setOptions }) => {
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
  const userId = useSelector((state) => state.user.id);
  const navigate = useNavigate();

  const handleClickRegion = () => {
    if (selectedMapFile["mapbook_template"] === "Bar Chart") {
      setShowModalBar(!showModalBar);
    } else if (selectedMapFile["mapbook_template"] === "Pie Chart")
      setShowModalPie(!showModalPie);
    else if (selectedMapFile["mapbook_template"] === "Circle Map")
      setShowModalCircle(!showModalCircle);
    else if (selectedMapFile["mapbook_template"] === "Thematic Map")
      setShowModalThematic(!showModalThematic);
    else if (selectedMapFile["mapbook_template"] === "Heat Map")
      setShowModalHeat(!showModalHeat);
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
    // TODO Handle the case where the number is outside the defined ranges (make it invalid)
    return "Invalid Color";
  };

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
    console.log("updated selectedmapfile: ", selectedMapFile);
    handleClickRegion();
  };

  const mapContainerRef = useRef(null);
  useEffect(() => {
    console.log(selectedMapFile);
    let map;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    if (mapContainerRef.current) {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
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
      console.log("ON LOAD selectedMapFile: ", selectedMapFile);
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
        console.log("this is e: ", e);
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

        console.log("selectedfeatures: ", newSelectedFeature);

        setFeature(newSelectedFeature);

        console.log("Selected region name: ", names);
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
            setHoverData(
              JSON.stringify(tempFeature["properties"].mapbook_data)
            );
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
    console.log(`GeoJSON saved as ${filename}`);
    return newGeoJson;
  }

  const createMap = async (mapData) => {
    const newMapObj = {
      map_name: options.name,
      topic: options.customTopic === "" ? options.topic : options.customTopic,
      is_visible: !options.isPrivate,
      user_id: userId,
      map_description: options.description,
      file: mapData,
    };
    const res = await createMapAPIMethod(newMapObj);
    console.log("res: ", res);
    if (res.ok) {
      // const responseMsg = await res.json;
      navigate("/mainpage");
      console.log("create map success!");
    } else {
      alert(`Error: ${res.status} - ${res.statusText}`);
    }
  };
  // Click Create Map Btn
  const handleCreateMap = async () => {
    console.log("clicked");
    // console.log(mapData);
    // console.log("saved");
    const geoJSONObject = selectedMapFile;
    const mapFile = saveGeoJSONToFile(
      geoJSONObject,
      `${selectedMapFile["mapbook_mapname"]}.geojson`
    );
    createMap(mapFile);
    // console.log(mapFile);
  };

  return (
    <div className="addmapdata_center">
      <div className="map_region_info">
        <p>Hover over a region!</p>
        {hoverData}
      </div>
      <div className="map_toolbar_container">
        <div className="map_undo_redo_container">
          <i className="undo bx bx-undo" />
          <div className="vertical_line_container">|</div>
          <i className="redo bx bx-redo" />
        </div>

        <button onClick={handleCreateMap}>Create Map</button>
      </div>
      <div ref={mapContainerRef} id="map">
        {/* Pie & Bar Modal - DONE*/}
        {(showModalPie || showModalBar) && (
          <div className="add_map_data_modal">
            PIEBAR
            <div
              className="close_add_map_data_modal"
              onClick={handleClickRegion}
            >
              close
            </div>
            <form onSubmit={handleAddData}>
              {selectedMapFile["mapbook_datanames"].map((dataname, index) => (
                <label key={index}>
                  {dataname}:
                  <input
                    type="text"
                    onChange={(e) =>
                      handlePieBarInputChange(dataname, e.target.value)
                    }
                  />
                </label>
              ))}
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
        {/* Circle Modal - DONE */}
        {showModalCircle && (
          <div className="add_map_data_modal">
            <div
              className="close_add_map_data_modal"
              onClick={handleClickRegion}
            >
              close
            </div>
            <form onSubmit={handleAddData}>
              <label>
                {selectedMapFile["mapbook_circleheatmapdata"]}
                <input
                  type="number"
                  onChange={(e) => setInputData(e.target.value)}
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        )}

        {/* Thematic Modal */}
        {showModalThematic && (
          <div className="add_map_data_modal">
            Theme
            <div
              className="close_add_map_data_modal"
              onClick={handleClickRegion}
            >
              close
            </div>
            <form onSubmit={handleAddData}>
              {selectedMapFile["mapbook_themedata"].map((data, index) => (
                <label key={index}>
                  {data.dataName}:{data.color}
                  <input
                    type="text"
                    onChange={(e) => handleThematicData(data, e.target.value)}
                  />
                </label>
              ))}
              <button type="submit">Submit</button>
            </form>
          </div>
        )}

        {/* Heat Modal - Done */}
        {showModalHeat && (
          <div className="add_map_data_modal">
            <div
              className="close_add_map_data_modal"
              onClick={handleClickRegion}
            >
              close
            </div>
            Heat
            <form onSubmit={handleAddData}>
              <label>
                {selectedMapFile["mapbook_circleheatmapdata"]}
                <input
                  type="number"
                  onChange={(e) => handleHeatMapData(e.target.value)}
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
