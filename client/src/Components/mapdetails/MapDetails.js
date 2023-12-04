import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Dropdown, Divider } from "semantic-ui-react";
import { Box, Typography } from "@mui/material";

import "./mapdetails.css";
import MapTools from "../maptools/MapTools";
import Comment from "./Comment";
import { getMapAPI, getAllMapCommentsAPIMethod } from "../../api/map";
import { getAllUsersAPIMethod } from "../../api/user";
import gallery from "../../assets/img/gallery.png";
import optionsIcon from "../../assets/img/options.png";

export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

const MapDetails = () => {
  const { mapId } = useParams();
  const [currentMap, setCurrentMap] = useState(null);
  const [users, setUsers] = useState([]);
  const [mapComments, setMapComments] = useState([]);
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const currentUserId = useSelector((state) => state.user.id);
  const [optionsMenuVisible, setOptionsMenuVisible] = useState(false);

  const getUsers = async () => {
    const data = await getAllUsersAPIMethod();
    setUsers(data);
  };

  const getMapComments = async () => {
    const data = await getAllMapCommentsAPIMethod(mapId);
    setMapComments(data);
  };

  const getMap = async () => {
    const data = await getMapAPI(mapId);
    setCurrentMap(data);
  };

  useEffect(() => {
    getMap();
  }, [currentMap]);

  useEffect(() => {
    getUsers();
  }, [users]);

  useEffect(() => {
    getMapComments();
  }, [mapComments]);

  const handleToggleOptions = (e) => {
    e.stopPropagation();
    setOptionsMenuVisible(!optionsMenuVisible);
  };

  if (!currentMap || !users) {
    return (
      <></>
    )
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
              <div className="map_details_name" style={{color: "#b8c5c9"}}>
                <h5>Posted by {currentMap.user_id}</h5>
              </div>
            </div>
            <div className="options_icon">
              <img style={{width: "30px", height: "30px"}} src={optionsIcon} onClick={handleToggleOptions}/>
              {optionsMenuVisible && (
                <div className="mappreview_options_menu">
                  <ul>
                    <li>Fork Map</li>
                    <Divider style={{margin: "0"}} />
                    <li>Share Map</li>
                    <Divider style={{margin: "0"}} />
                    <li>Export Map</li>
                    <Divider style={{margin: "0"}} />
                    <li>Edit Map</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="map_image_comments">
            <div className="map_details_image">
              <img src={currentMap.mapPreviewImg} />
            </div>
            <div className="map_details_comments">
              <div className="comment_title">Comments</div>
              <div className="comment_content">
                {/* <Box mt="0.5rem"> */}
                {mapComments.map((comment, i) => (
                  <Comment key={i} comment={comment}/>
                ))}
                {/* </Box> */}
              </div>
              <div className="comment_box">
                {isAuth ? (
                  <>
                    <div className="comment_box_profile">
                      {users.filter(user => user._id === currentUserId).map(user => (
                        <img key={user._id} style={{marginTop: "4px"}} className="profile_img" src={user.profile_img}></img>
                      ))}
                    </div>
                    <div className="comment_box_input">
                      <input
                        className="input_comment"
                        type="text"
                        placeholder="Add a comment..."
                        // value={newComment}
                        // onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div class="wrapper">
                        <img className="btnimg" src={gallery}/>
                        <input type="file" />
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
          <Divider section inverted style={{margin: "20px 0"}}/>
          <div className="tools">
            <MapTools
              isEdit={false}
              currentMap={currentMap}
            />
          </div>
        </div>
      </div>
    );
  };
};

export default MapDetails;
