import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Divider } from "semantic-ui-react";
import "./mapdetails.css";
import MapTools from "../maptools/MapTools";
import Comment from "./Comment";
import * as turf from '@turf/turf';

import {
  getMapAPI,
  deleteMapPostAPIMethod,
  editMapPostAPIMethod,
} from "../../api/map";
import MapComments from "../comments/MapComments";
import { getAllUsersAPIMethod, getUserById } from "../../api/user";
import optionsIcon from "../../assets/img/options.png";
import { fb, storage } from "../../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import mapboxgl from "mapbox-gl"; // Import mapboxgl
import DeleteButton from "../widgets/DeleteButton";
import EditButton from "../widgets/EditButton";
import { async } from "@firebase/util";

import Lottie from "lottie-react";
import ImageLoader from "../../assets/Lottie/ImageLoader.json";
import Typewriter from "typewriter-effect";
import CustomSwitch from "../widgets/CustomSwitch";
import polylabel from "polylabel"


export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

const MapDetails = () => {
  const { mapId } = useParams();
  const currentMap = useRef(null);
  const [users, setUsers] = useState([]);
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const [optionsMenuVisible, setOptionsMenuVisible] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const postOwner = useRef(null);
  const MAPBOX_TOKEN =
    "pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw";
  const [lng, setLng] = useState(-122.48);
  const [lat, setLat] = useState(37.84);
  const [zoom, setZoom] = useState(3);
  const [hoverData, setHoverData] = useState("Out of range");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedMapFile, setSelectedMapFile] = useState();
  const user = useSelector((state) => state.user.user);
  const mapContainerRef = useRef(null);
  const navigate = useNavigate();
  const [showHoverData, setShowHoverData] = useState(false);
  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${day}\n${hours}:${minutes}`;

    return formattedDateTime;
  };

  const getMapRunning = useRef(false);

  const getUsers = async () => {
    const data = await getAllUsersAPIMethod();
    setUsers(data);
  };

  const getMap = async () => {
    // mutex that prevent calling multiple getMap simultaneously
    if (!getMapRunning.current) {
      getMapRunning.current = true;
      try {
        console.log("getMap called");
        const data = await getMapAPI(mapId);
        const post_owner_data = await getUserById(data.user_id);
        postOwner.current = post_owner_data;
        currentMap.current = data;
        console.log("currentMap.current: ", currentMap.current);
        const updatedViewCount = currentMap.current.view_count + 1;
        const updatedMap = {
          ...currentMap.current,
          view_count: updatedViewCount,
        };

        //it does not have to await
        editMapPostAPIMethod(currentMap.current._id, updatedMap);
        // console.log(postOwner, user._id);
        if (postOwner.current._id === user._id) {
          setIsOwner(true);
        }

        if (currentMap.current != null) {
          let url = currentMap.current.file_path;
          // get file name from url
          let fileName = url
            .substring(57, url.indexOf("geojson") + 7)
            .replaceAll("%20", " ");
          // console.log(fileName)
          const mapUrl = await getDownloadURL(ref(storage, fileName));

          setTimeout(() => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.onload = (event) => {
              // console.log("response: ", xhr.response);
              setSelectedMapFile(xhr.response);
            };
            xhr.open("GET", mapUrl);
            xhr.send();

            setIsMapLoaded(true);
          }, 3500);
        }
      } catch (error) {
        console.error("Error fetching map:", error);
      }
      getMapRunning.current = false;
    }
  };

  function calcPolygonArea(vertices) {
    var total = 0;

    for (var i = 0, l = vertices.length; i < l; i++) {
      var addX = vertices[i][0];
      var addY = vertices[i == vertices.length - 1 ? 0 : i + 1][1];
      var subX = vertices[i == vertices.length - 1 ? 0 : i + 1][0];
      var subY = vertices[i][1];

      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }

    return Math.abs(total);
  }
 
  function calculateCentroid(features) {
    let totalX = 0;
    let totalY = 0;
    let count = 0;

    // Loop through features and sum up coordinates
    features.forEach(feature => {
      const coordinates = feature.geometry.coordinates[0]; // Assuming the first ring of the polygon
      if (typeof coordinates == "number") {
        return;
      }
      if (coordinates.length > 1) {
        coordinates.forEach(coord => {
          if (typeof coord[0] == 'number' && typeof coord[0] == 'number') {
            totalX += coord[0];
            totalY += coord[1];
            count++;
          } else {
            coord.forEach(c => {
              if (typeof coord[0] == 'number' && typeof coord[0] == 'number') {
                totalX += coord[0];
                totalY += coord[1];
                count++;
              }
            })
          }
        });
      } else {
        coordinates[0].forEach(coord => {
          if (typeof coord[0] == 'number' && typeof coord[0] == 'number') {
            totalX += coord[0];
            totalY += coord[1];
            count++;
          }
        });
      }
    });
    console.log("totalX: ", totalX);
    console.log("totalY: ", totalY);
    const avgX = totalX / count;
    const avgY = totalY / count;
    return [avgX, avgY];
  }

  // function calculateBoundingBox(features) {
  //   let minX = Number.MAX_VALUE;
  //   let minY = Number.MAX_VALUE;
  //   let maxX = Number.MIN_VALUE;
  //   let maxY = Number.MIN_VALUE;

  //   // Loop through polygon features and find the minimum and maximum coordinates
  //   features.forEach(feature => {
  //     const coordinates = feature.geometry.coordinates[0]; // Assuming the first ring of the polygon
  //     coordinates.forEach(coord => {
  //       if (typeof coordinates == "number") {
  //         return;
  //       }
  //       // minX = Math.min(minX, coord[0]);
  //       // minY = Math.min(minY, coord[1]);
  //       // maxX = Math.max(maxX, coord[0]);
  //       // maxY = Math.max(maxY, coord[1]);
  //       minX = coord[0];
  //       minY = coord[1];
  //       maxX = coord[0];
  //       maxY = coord[1];
  //     });
  //   });

  //   // Return bounding box [minX, minY, maxX, maxY]
  //   return [[minX, minY], [maxX, maxY]];
  // }

  useEffect(() => {
    getMap();
  }, [mapId, user._id]);

  useEffect(() => {
    if (selectedMapFile != null) {
      // console.log("selectedMapFile: useEffect: ", selectedMapFile);
      const centroid = calculateCentroid(selectedMapFile.features);
      const totalArea = selectedMapFile.features.reduce((acc, feature) => {
        const area = turf.area(feature);
        return acc + area;
      }, 0);
      console.log('Total Area:', totalArea, 'square meters');

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

          ////////////// map visualization display ////////////
          console.log(
            "selectedMapFile.mapbook_template",
            selectedMapFile.mapbook_template
          );

          if (selectedMapFile.mapbook_template === "Thematic Map") {
            map.addLayer(
              {
                id: `counties-thematic`,
                type: "fill",
                source: "counties",
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

            const featureDataAdded = selectedMapFile["features"].filter(
              (f) => f["properties"].mapbook_data != null
            );
            var namesDataAdded = [];
            featureDataAdded.forEach((element) => {
              // console.log(element);
              namesDataAdded.push(element["properties"].name);
            });

            let dataNames = [];
            for (let i = 0; i < selectedMapFile.mapbook_themedata.length; i++) {
              dataNames.push(selectedMapFile.mapbook_themedata[i].dataName);
            }

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
              expGetMaximumColor.push(
                selectedMapFile.mapbook_themedata[i].color
              );
            }
            expGetMaximumColor.push("#000000");

            map.setLayoutProperty("counties-thematic", "visibility", "visible");
            map.setPaintProperty(
              "counties-thematic",
              "fill-color",
              expGetMaximumColor
            );
            // mapRef.current.setPaintProperty('counties-thematic', 'fill-color', ['case', ['==',  ['to-number', ['get', 'value', ['get', 'aa', ['get', 'mapbook_data']]]] , 10], '#ffffff', '#123123']);

            // mapRef.current.setPaintProperty('counties-thematic', 'fill-color', mapFileData.current.mapbook_themedata[0].color);
            map.setFilter("counties-thematic", [
              "in",
              "name",
              ...namesDataAdded,
            ]);
          } else if (selectedMapFile.mapbook_template === "Heat Map") {
            map.addLayer({
              id: `counties-heat`,
              type: "fill",
              source: "counties",
              layout: {
                visibility: "none",
              },
              paint: {
                "fill-outline-color": "#484896",
                "fill-color": "#faafee",
                "fill-opacity": 1,
              },
            });

            const featureDataAdded = selectedMapFile["features"].filter(
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

            var heatRangeFrom = Number(selectedMapFile.mapbook_heatrange.from);
            var heatRangeTo = Number(selectedMapFile.mapbook_heatrange.to);
            var range = (heatRangeTo - heatRangeFrom) / 5;
            // console.log(heatRangeFrom, heatRangeTo, range)
            // console.log(typeof(heatRangeFrom), typeof(heatRangeTo), typeof(range), typeof(heatRangeFrom + range))

            let expHeatColorByValue = ["case"];
            for (var i = 0; i < 5; i++) {
              expHeatColorByValue.push([
                "all",
                [">=", expValue, heatRangeFrom],
                ["<", expValue, heatRangeFrom + range],
              ]);
              expHeatColorByValue.push(
                selectedMapFile.mapbook_heat_selectedcolors[i]
              );
              heatRangeFrom = heatRangeFrom + range;
            }
            expHeatColorByValue.push("#000000");

            // console.log("heatData", inputData, "namesdata", namesDataAdded);

            map.setLayoutProperty("counties-heat", "visibility", "visible");
            map.setPaintProperty(
              "counties-heat",
              "fill-color",
              expHeatColorByValue
            );
            map.setFilter("counties-heat", ["in", "name", ...namesDataAdded]);
          } else if (selectedMapFile.mapbook_template === "Circle Map") {
            let dataName = selectedMapFile["mapbook_circleheatmapdata"];

            console.log(dataName);
            const expValue = [
              "to-number",
              ["get", dataName, ["get", "mapbook_data"]],
            ];

            const featureDataAdded = selectedMapFile["features"].filter(
              (f) => f["properties"].mapbook_data != null
            );

            var namesDataAdded = [];
            featureDataAdded.forEach((element) => {
              //adding mapbook data to each feature
              namesDataAdded.push(element["properties"].name);
            });

            var JsonBasedOnPoint = structuredClone(selectedMapFile);
            var newGeometry;

            for (var i = 0; i < selectedMapFile["features"].length; i++) {
              // console.log(selectedMapFile["features"][i])
              if(selectedMapFile["features"][i].geometry.type == "Polygon"){
                newGeometry = { type: "Point", coordinates:  polylabel(selectedMapFile["features"][i].geometry.coordinates, 1.0) };
              }
              else{
                let maxArea = 0;
                let maxPoint = [];
                for(var j = 0; j < selectedMapFile["features"][i].geometry.coordinates.length; j++){
                  var polygonArea = calcPolygonArea(selectedMapFile["features"][i].geometry.coordinates[j][0])
                  if(maxArea < polygonArea){
                    maxArea = polygonArea
                    maxPoint = polylabel(selectedMapFile["features"][i].geometry.coordinates[j])
                  }
                }
                newGeometry = { type: "Point", coordinates: maxPoint };
              }
              JsonBasedOnPoint["features"][i].geometry = newGeometry;
            }

            map.addSource("circles", {
              type: "geojson",
              data: JsonBasedOnPoint,
              // cluster: true,
              // clusterMaxZoom: 14, // Max zoom to cluster points on
              // clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
            });

            map.addLayer({
              id: "clusters",
              type: "circle",
              source: "circles",
              paint: {
                "circle-translate": [0, 0],
              },
            });

            map.addLayer({
              id: "cluster-count",
              type: "symbol",
              source: "circles",
              layout: {
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 12,
              },
            });

            map.setFilter("clusters", ["in", "name", ...namesDataAdded]);

            map.setFilter("cluster-count", ["in", "name", ...namesDataAdded]);

            map.setLayoutProperty("cluster-count", "text-field", [
              "to-string",
              expValue,
            ]);

            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            map.setPaintProperty("clusters", "circle-color", [
              "case",
              ["<", expValue, 100],
              "#51bbd6",
              ["all", [">=", expValue, 100], ["<", expValue, 750]],
              "#f1f075",
              "#f28cb1",
            ]);

            map.setPaintProperty("clusters", "circle-radius", [
              "case",
              ["<", expValue, 100],
              20,
              ["all", [">=", expValue, 100], ["<", expValue, 750]],
              30,
              40,
            ]);

            console.log(
              "mapRef.current.getPaintProperty:",
              map.getPaintProperty("clusters", "circle-color")
            );
          } else if (selectedMapFile.mapbook_template === "Bar Chart") {
          } else if (selectedMapFile.mapbook_template === "Pie Chart") {
          }

          map.on("mousemove", (event) => {
            const regions = map.queryRenderedFeatures(event.point, {
              layers: ["counties"],
            });
            if (regions.length == 0) {
              setHoverData("Out of range");
            }
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
      }
    }
  }, [selectedMapFile]);

  /////////////////////////////////////////

  useEffect(() => {
    if (!isMapLoaded) {
      getMap();
    }
  }, [currentMap.current]);

  useEffect(
    () => {
      getUsers();
    },
    [] /* [users] */
  );

  const handleToggleOptions = (e) => {
    e.stopPropagation();
    setOptionsMenuVisible(!optionsMenuVisible);
  };

  const handleDeleteMapPost = async (mapId) => {
    console.log(mapId);
    try {
      console.log("removing map post");
      const res = await deleteMapPostAPIMethod(mapId);
      if (res) {
        navigate("/mainpage");
      } else {
        alert("Error deleting post", res);
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);
    }
  };

  const handleShare = () => {
    // Handle share action
    navigator.clipboard.writeText(
      HOME_URL + "/mapdetails/" + currentMap.current._id
    );
    alert("Link Copied!");

    console.log("Share clicked");
  };

  // Convert data to GEOJSON //
  function saveGeoJSONToFile(geoJSONObject, filename) {
    const geoJSONString = JSON.stringify(geoJSONObject);

    const newGeoJson = new File([geoJSONString], filename, {
      type: "application/json",
    });
    return newGeoJson;
  }

  function downloadGeoJSON(geoJSONObject, filename) {
    const newGeoJson = saveGeoJSONToFile(geoJSONObject, filename);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(newGeoJson);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    // RM link from DOM
    document.body.removeChild(link);
    return newGeoJson;
  }

  if (!currentMap.current || !users) {
    return <></>;
  } else {
    return (
      <div className="map_details">
        <div className="map_details_container">
          <div className="name_options">
            <div className="name_topic">
              <div className="map_details_name">
                <h1>{currentMap.current.map_name}</h1>
              </div>
              <div className="map_details_topic">
                <h3>{currentMap.current.topic}</h3>
              </div>
              <div className="map_details_name" style={{ color: "#b8c5c9" }}>
                <h5>
                  Posted by{" "}
                  {postOwner.current != null
                    ? postOwner.current["username"]
                    : "Unknown User"}
                </h5>
                <h6>{formatDate(currentMap.current.created_at)}</h6>
                <div>
                  <i className="bi bi-eye" /> &nbsp;
                  {currentMap.current.view_count + 1}
                </div>
              </div>
            </div>
            <div className="map_details_options_container">
              {(isOwner || user.username === "Admin") && (
                <>
                  <DeleteButton
                    onClick={() => handleDeleteMapPost(currentMap.current._id)}
                  />
                  <EditButton />
                </>
              )}
              {isAuth && (
                <div className="options_icon">
                  <img
                    alt=""
                    style={{ width: "30px", height: "30px" }}
                    src={optionsIcon}
                    onClick={handleToggleOptions}
                  />
                  {optionsMenuVisible && (
                    <div className="mappreview_options_menu">
                      <ul>
                        <li>Fork Map</li>
                        <Divider style={{ margin: "0" }} />
                        <li onClick={() => handleShare()}>Share Map</li>
                        <Divider style={{ margin: "0" }} />
                        <li
                          onClick={() =>
                            downloadGeoJSON(
                              selectedMapFile,
                              currentMap.current.map_name + ".geojson"
                            )
                          }
                        >
                          Export Map
                        </li>
                        <Divider style={{ margin: "0" }} />
                        <li>Edit Map</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={`mapdetails_hoverdata_switch${showHoverData ? "_showing" : ""}`}>
              <CustomSwitch
                showHoverData={showHoverData}
                setShowHoverData={setShowHoverData}
              />
            </div>

            {showHoverData ? (
              <div className="mapdetails_hovered_data_container">
                <div className="mapdetails_hovered_data_header">
                  <h4 style={{ display: "inline-block", margin: 0 }}>Map Data</h4>
                </div>
                <div className="mapdetails_input_hovered_data">
                  <div>{hoverData}</div>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {isMapLoaded ? (
            <div
              ref={mapContainerRef}
              id="map"
              style={{ overflow: "hidden" }}
            ></div>
          ) : (
            <div className="mapdetails_loadmap_container">
              <Lottie
                animationData={ImageLoader}
                style={{
                  width: "45%",
                  height: "45%",
                  opacity: 0.2,
                }}
              />
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString("L o a d i n g     m a p . . .")
                    .start();
                }}
              />
            </div>
          )}
          <MapComments mapId={mapId} />
          <Divider section inverted style={{ margin: "20px 0" }} />
        </div>
      </div>
    );
  }
};

export default MapDetails;
