import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Divider } from "semantic-ui-react";

import "./mapdetails.css";
import MapTools from "../maptools/MapTools";
import Comment from "./Comment";
import {
  getMapAPI,
  getAllMapCommentsAPIMethod,
  createMapCommentAPIMethod,
  updateMapCommentAPIMethod,
  deleteMapCommentAPIMethod,
  getAllMapPostRepliesAPIMethod,
  deleteMapPostAPIMethod,
  editMapPostAPIMethod,
} from "../../api/map";
import { getAllUsersAPIMethod, getUserById } from "../../api/user";
import sendMessage from "../../assets/img/sendMessage.png";
import optionsIcon from "../../assets/img/options.png";
import { fb, storage } from "../../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import mapboxgl from "mapbox-gl"; // Import mapboxgl
import DeleteButton from "../widgets/DeleteButton";
import EditButton from "../widgets/EditButton";
import { async } from "@firebase/util";

export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

const MapDetails = () => {
  const { mapId } = useParams();
  const [currentMap, setCurrentMap] = useState(null);
  const [users, setUsers] = useState([]);
  const [mapComments, setMapComments] = useState([]);
  const [newMapComment, setNewMapComment] = useState("");
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const currentUserId = useSelector((state) => state.user.id);
  const [optionsMenuVisible, setOptionsMenuVisible] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [postOwner, setPostOwner] = useState(null);
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
  const getUsers = async () => {
    const data = await getAllUsersAPIMethod();
    setUsers(data);
  };

  const getMapComments = async () => {
    const data = await getAllMapCommentsAPIMethod(mapId);
    if (data !== mapComments) {
      setMapComments(data);
    }
  };
  const getMap = async () => {
    try {
      console.log("getMap called");
      const data = await getMapAPI(mapId);
      const post_owner_data = await getUserById(data.user_id);
      setCurrentMap(data);
      console.log("VIEW COUNT", currentMap.viewCount && currentMap.view_count);
      setPostOwner(post_owner_data);
      const updatedViewCount = currentMap.view_count + 1;
      const updatedMap = { ...currentMap, view_count: updatedViewCount };
      await editMapPostAPIMethod(currentMap._id, updatedMap);
      // console.log(postOwner, user._id);
      if (postOwner._id === user._id) {
        setIsOwner(true);
      }

      if (currentMap != null) {
        let url = currentMap.file_path;
        // get file name from url
        let fileName = url
          .substring(57, url.indexOf("geojson") + 7)
          .replaceAll("%20", " ");
        // console.log(fileName)
        const mapUrl = await getDownloadURL(ref(storage, fileName));

        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.onload = (event) => {
          // console.log("response: ", xhr.response);
          setSelectedMapFile(xhr.response);
        };
        xhr.open("GET", mapUrl);
        xhr.send();

        setIsMapLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching map:", error);
    }
  };

  useEffect(() => {
    getMap();
  }, [mapId, user._id]);

  useEffect(() => {
    console.log("selectedMapFile: useEffect: ", selectedMapFile);
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
            expGetMaximumColor.push(selectedMapFile.mapbook_themedata[i].color);
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
          map.setFilter("counties-thematic", ["in", "name", ...namesDataAdded]);
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
        } else if (selectedMapFile.mapbook_template === "Bar Chart") {
        } else if (selectedMapFile.mapbook_template === "Pie Chart") {
        }

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
    }
  }, [selectedMapFile]);

  /////////////////////////////////////////

  useEffect(() => {
    if (!isMapLoaded) {
      getMap();
    }
  }, [currentMap]);

  useEffect(
    () => {
      getUsers();
    },
    [] /* [users] */
  );

  useEffect(
    () => {
      getMapComments();
    },
    [] /* [mapComments] */
  );

  const handleToggleOptions = (e) => {
    e.stopPropagation();
    setOptionsMenuVisible(!optionsMenuVisible);
  };

  const handleAddMapComment = async () => {
    const newComment = {
      map_comment_content: newMapComment,
      map_comment_owner: currentUserId,
      map_id: mapId,
    };
    const result  = await createMapCommentAPIMethod(newComment);
    setMapComments([...mapComments, result]);
  };

  const handleEditMapComment = (mapCommentId, editedComment) => {
    updateMapCommentAPIMethod(mapCommentId, editedComment);
    const updatedMapComments = mapComments.map((mapComment) => {
      if (mapComment._id === mapCommentId) {
        return {
          ...mapComment,
          map_comment_content: editedComment.map_comment_content,
        };
      }
      return mapComment;
    });
    setMapComments(updatedMapComments);
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

  const handleDeleteMapComment = (mapCommentId) => {
    const updatedMapComments = mapComments.filter(
      (mapComment) => mapComment._id !== mapCommentId
    );
    setMapComments(updatedMapComments);
    deleteMapCommentAPIMethod(mapCommentId);
  };

  const handleShare = () => {
    // Handle share action
    navigator.clipboard.writeText(HOME_URL + "/mapdetails/" + currentMap._id);
    alert("Link Copied!");

    console.log("Share clicked");
  };

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
  // Export- download GeoJson

  // const handleExport = () => {
  //   const geoJSONObject = currentMap;
  //   const mapFile = saveGeoJSONToFile(
  //     geoJSONObject,
  //     `${currentMap["mapbook_mapname"]}.geojson`
  //   );
  // };

  // Convert data to GEOJSON //
  // function saveGeoJSONToFile(geoJSONObject, filename) {
  //   const geoJSONString = JSON.stringify(geoJSONObject);
  //   // console.log("geoJSONString: ", geoJSONString)
  //   const newGeoJson = new File([geoJSONString], filename, {
  //     type: "application/json",
  //   });
  //   return newGeoJson;
  // }

  // function downloadGeoJSON(geoJSONObject, filename) {
  //   const newGeoJson = saveGeoJSONToFile(geoJSONObject, filename);
  //   // console.log(newGeoJson)
  //   // Create a download link
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(newGeoJson);
  //   link.download = filename;
  //   // Append the link to the body -> trigger click event to start the download
  //   document.body.appendChild(link);
  //   link.click();
  //   // RM link from DOM
  //   document.body.removeChild(link);
  //   // console.log(`GeoJSON saved as ${filename}`);
  //   return newGeoJson;
  // }

  if (!currentMap || !users || !mapComments) {
    return <></>;
  } else {
    return (
      <div className="map_details">
        <div className="map_details_container">
          <div className="name_options">
            <div className="name_topic">
              <div className="map_details_name">
                <h1>{currentMap.map_name}</h1>
              </div>
              <div className="map_details_topic">
                <h3>{currentMap.topic}</h3>
              </div>
              <div className="map_details_name" style={{ color: "#b8c5c9" }}>
                <h5>Posted by {currentMap.user_id}</h5>
                <h6>{formatDate(currentMap.created_at)}</h6>
                <div>
                  <i className="bi bi-eye" /> &nbsp;
                  {currentMap.view_count + 1}
                </div>
              </div>
            </div>
            <div className="map_details_options_container">
              {isOwner && (
                <>
                  <DeleteButton
                    onClick={() => handleDeleteMapPost(currentMap._id)}
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
                              currentMap.map_name + ".geojson"
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
          </div>

          <div
            ref={mapContainerRef}
            id="map"
            style={{ overflow: "hidden" }}
          ></div>

          <div className="map_details_comments">
            <div className="comment_title">Comments</div>
            <div className="comment_content">
              {mapComments.map((comment, i) => (
                <Comment
                  key={i}
                  isRelpy={false}
                  comment={comment}
                  handleDeleteMapComment={handleDeleteMapComment}
                  handleEditMapComment={handleEditMapComment}
                />
              ))}
            </div>
            <div className="comment_box">
              {isAuth ? (
                <>
                  <div className="comment_box_profile">
                    {users
                      .filter((user) => user._id === currentUserId)
                      .map((user) => (
                        <img
                          alt=""
                          key={user._id}
                          style={{ marginTop: "4px" }}
                          className="profile_img"
                          src={user.profile_img}
                        ></img>
                      ))}
                  </div>
                  <div className="comment_box_input">
                    <input
                      className="input_comment"
                      type="text"
                      placeholder="Add a comment..."
                      // value={newMapComment}
                      onChange={(e) => setNewMapComment(e.target.value)}
                    />
                    <div class="wrapper" onClick={handleAddMapComment}>
                      <img className="btnimg" src={sendMessage} />
                    </div>
                  </div>
                </>
              ) : (
                <div>Please Login/Register to Comment.</div>
              )}
            </div>
          </div>
          <Divider section inverted style={{ margin: "20px 0" }} />
          {/* <div className="tools">
            <MapTools isEdit={false} currentMap={currentMap} />
          </div> */}
        </div>
      </div>
    );
  }
};

export default MapDetails;
