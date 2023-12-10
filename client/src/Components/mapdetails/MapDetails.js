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

  const handleAddMapComment = () => {
    const newComment = {
      map_comment_content: newMapComment,
      map_comment_owner: currentUserId,
      map_id: mapId,
    };
    createMapCommentAPIMethod(newComment);
    setMapComments([...mapComments, newComment]);
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
                      <li>Share Map</li>
                      <Divider style={{ margin: "0" }} />
                      <li>Export Map</li>
                      <Divider style={{ margin: "0" }} />
                      <li>Edit Map</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="map_image_comments">
            <div
              ref={mapContainerRef}
              id="map"
              style={{ width: "800px", height: "500px" }}
            ></div>
            <div className="map_details_comments">
              <div className="comment_title">Comments</div>
              <div className="comment_content">
                {/* <Box mt="0.5rem"> */}
                {mapComments.map((comment, i) => (
                  <Comment
                    key={i}
                    isRelpy={false}
                    comment={comment}
                    handleDeleteMapComment={handleDeleteMapComment}
                    handleEditMapComment={handleEditMapComment}
                  />
                ))}
                {/* </Box> */}
              </div>
              <div className="comment_box">
                {isAuth ? (
                  <>
                    <div className="comment_box_profile">
                      {users
                        .filter((user) => user._id === currentUserId)
                        .map((user) => (
                          <img
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
                  <h4>Please sign in/sign up to comment.</h4>
                )}
              </div>
              {/* {currentMap.map_comments.map((comment) => (
                <MapComments />
              ))} */}
            </div>
          </div>
          <Divider section inverted style={{ margin: "20px 0" }} />
          <div className="tools">
            <MapTools isEdit={false} currentMap={currentMap} />
          </div>
        </div>
      </div>
    );
  }
};

export default MapDetails;
