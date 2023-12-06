import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Icon } from 'semantic-ui-react'

import "./mapdetails.css";
import { getAllUsersAPIMethod } from "../../api/user";
import { 
  getAllMapPostRepliesAPIMethod,
  deleteMapPostReplyAPIMethod,
  createMapPostReplyAPIMethod,
  updateMapPostReplyAPIMethod 
} from "../../api/map";
import FlexBetween from "../FlexBetween";
import sendMessage from "../../assets/img/sendMessage.png";

const Comment = ({ isRelpy, comment, mapReply, handleDeleteMapComment, handleEditMapComment }) => {
  const { mapId } = useParams();
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const currentUserId = useSelector((state) => state.user.id);
  const [users, setUsers] = useState([]);
  const [isCommentOwner, setIsCommentOwner] = useState(currentUserId === comment.map_comment_owner);
  const [isCommentOptions, setIsCommentOptions] = useState(false);
  const [isEditMapComment, setIsEditMapComment] = useState(false);
  const [editedMapComment, setEditedMapComment] = useState("");

  const [mapReplies, setMapReplies] = useState([]);
  const [isReplyOwner, setIsReplyOwner] = useState(!mapReply ? false : currentUserId === mapReply.map_reply_owner);
  const [newMapReply, setNewMapReply] = useState("");
  const [isAddMapReply, setIsAddMapReply] = useState(false);
  const [isEditMapReply, setIsEditMapReply] = useState(false);
  const [editedMapReply, setEditedMapReply] = useState("");

  const getUsers = async () => {
    const data = await getAllUsersAPIMethod();
    setUsers(data);
  };

  const getMapReplies = async () => {
    const data = await getAllMapPostRepliesAPIMethod(comment._id);
    setMapReplies(data);
  };

  useEffect(() => {
    getUsers();
  }, [users]);

  useEffect(() => {
    getMapReplies();
  }, [mapReplies]);

  const toggleCommentOptions = (e) => {
    e.stopPropagation();
    setIsCommentOptions(!isCommentOptions);
  };

  const editMapComment = () => {
    const editedComment = {
      map_comment_content: editedMapComment,
      map_comment_owner: currentUserId,
      map_id: mapId
    };
    handleEditMapComment(comment._id, editedComment);
    setIsEditMapComment(!isEditMapComment);
  }

  const deleteMapComment = () => {
    handleDeleteMapComment(comment._id);
    setIsCommentOptions(!isCommentOptions);
  }

  const addMapReply = () => {
    const newReply = {
      map_reply_content: newMapReply,
      map_reply_owner: currentUserId,
      map_comment_id: comment._id
    };
    createMapPostReplyAPIMethod(newReply);
    setIsAddMapReply(!isAddMapReply);
  };

  const editMapReply = () => {
    const editedReply = {
      map_reply_content: editedMapReply,
      map_reply_owner: currentUserId,
      map_comment_id: comment._id
    };
    updateMapPostReplyAPIMethod(mapReply._id, editedReply);
    setIsEditMapReply(!isEditMapReply);
  };

  const deleteMapReply = (replyId) => {
    deleteMapPostReplyAPIMethod(mapReply._id);
    setIsCommentOptions(!isCommentOptions);
  }

  if (!users) {
    return (
      <></>
    )
  } else if (isRelpy) {
    return (
      <Box mb="10px" ml="55px">
        {users.filter(user => user._id === mapReply.map_reply_owner).map((user, i) => (
          <FlexBetween key={user._id + i}>
            <Box width="13%" alignSelf="start" mt="7px">
              <img style={{width: "35px", height: "35px", borderRadius: "50%"}} src={user.profile_img}/>
            </Box>
            <Box width="90%">
              <Box 
                borderRadius="0 15px 15px 15px"
                p="10px"
                mb="5px"
                backgroundColor="#323643"
              >
                <FlexBetween mb="10px">
                  <Box>
                    <Typography fontSize="18px" fontWeight="bold" color="whitesmoke">
                      {user.username}
                    </Typography>
                  </Box>
                  {isReplyOwner && (
                    <Box position="relative">
                      {isCommentOptions && (
                        <Box 
                          position="absolute" 
                          top="20px"
                          right="0"
                          padding="5px"
                          borderRadius="5px"
                          zIndex="1"
                          width="150px"
                          backgroundColor="rgb(191, 238, 250)"
                          color="black"
                        >
                          <ul style={{listStyle: "none", margin: "0", padding: "0"}}>
                            <li 
                              style={{cursor: "pointer", padding: "5px 10px", transition: "background-color 0.3s"}}
                              onClick={() => {setIsEditMapReply(!isEditMapReply); setIsCommentOptions(!isCommentOptions)}}
                            >
                              Edit
                            </li>
                            <li 
                              style={{cursor: "pointer", padding: "5px 10px", transition: "background-color 0.3s"}}
                              onClick={() => deleteMapReply(mapReply._id)}
                            >
                              Delete
                            </li>
                          </ul>
                        </Box>
                      )}
                      <Icon name="ellipsis horizontal" onClick={toggleCommentOptions}/>
                    </Box>
                  )}
                </FlexBetween>
                
                {!isEditMapReply ? (
                  <Typography fontSize="16px" color="whitesmoke">
                    {mapReply.map_reply_content}
                  </Typography>
                ) : (
                  <FlexBetween>
                    <input
                      style={{
                        backgroundColor: "#2A282E",
                        outline: "0",
                        boxShadow: "none",
                        padding: "10px",
                        color: "#b8c5c9",
                        border: "none",
                        borderRadius: "10px",
                        width: "85%"
                      }}
                      type="text"
                      placeholder={mapReply.map_reply_content}
                      onChange={(e) => setEditedMapReply(e.target.value)}
                    />
                    <Box 
                      onClick={editMapReply}
                    >
                      <img className="btnimg" src={sendMessage} />
                    </Box>
                  </FlexBetween>
                )}
              </Box>
            </Box>
          </FlexBetween>
        ))}
      </Box>
    )
  } else {
    return (
      <Box mb="20px">
        {users.filter(user => user._id === comment.map_comment_owner).map((user, i) => (
          <FlexBetween key={user._id + i} mb="15px">
            <Box width="13%" alignSelf="start" mt="7px">
              <img style={{width: "35px", height: "35px", borderRadius: "50%"}} src={user.profile_img}/>
            </Box>
            <Box width="92%">
              <Box 
                borderRadius="0 15px 15px 15px"
                p="10px"
                mb="5px"
                backgroundColor="#323643"
              >
                <FlexBetween mb="10px">
                  <Box>
                    <Typography fontSize="18px" fontWeight="bold" color="whitesmoke">
                      {user.username}
                    </Typography>
                  </Box>
                  {isCommentOwner && (
                    <Box position="relative">
                      {isCommentOptions && (
                        <Box 
                          position="absolute" 
                          top="20px"
                          right="0"
                          padding="5px"
                          borderRadius="5px"
                          zIndex="1"
                          width="150px"
                          backgroundColor="rgb(191, 238, 250)"
                          color="black"
                        >
                          <ul style={{listStyle: "none", margin: "0", padding: "0"}}>
                            <li 
                              style={{cursor: "pointer", padding: "5px 10px", transition: "background-color 0.3s"}}
                              onClick={() => {setIsEditMapComment(!isEditMapComment); setIsCommentOptions(!isCommentOptions)}}
                            >
                              Edit
                            </li>
                            <li 
                              style={{cursor: "pointer", padding: "5px 10px", transition: "background-color 0.3s"}}
                              onClick={deleteMapComment}
                            >
                              Delete
                            </li>
                          </ul>
                        </Box>
                      )}
                      <Icon name="ellipsis horizontal" onClick={toggleCommentOptions}/>
                    </Box>
                  )}
                </FlexBetween>
                
                {!isEditMapComment ? (
                  <Typography fontSize="16px" color="whitesmoke">
                    {comment.map_comment_content}
                  </Typography>
                ) : (
                  <FlexBetween>
                    <input
                      style={{
                        backgroundColor: "#2A282E",
                        outline: "0",
                        boxShadow: "none",
                        padding: "10px",
                        color: "#b8c5c9",
                        border: "none",
                        borderRadius: "10px",
                        width: "85%"
                      }}
                      type="text"
                      placeholder={comment.map_comment_content}
                      onChange={(e) => setEditedMapComment(e.target.value)}
                    />
                    <Box 
                      onClick={editMapComment}
                    >
                      <img className="btnimg" src={sendMessage} />
                    </Box>
                  </FlexBetween>
                )}
              </Box>

              {isAuth && (
                <FlexBetween ml="10px" width="22%">
                  <Typography 
                    fontSize="12px"
                    fontWeight="bold"
                    color="#dadada"
                    onClick={() => setIsAddMapReply(!isAddMapReply)}
                  >
                    Reply
                  </Typography>
                </FlexBetween>
              )}

              {isAddMapReply && (
                <div className="comment_box" style={{padding: "0", borderTop: "0", marginTop: "10px"}}>
                  <div className="comment_box_profile">
                    {users.filter(user => user._id === currentUserId).map(user => (
                      <img key={user._id} style={{ marginTop: "4px" }} className="profile_img" src={user.profile_img}></img>
                    ))}
                  </div>
                  <div className="comment_box_input">
                    <input
                      className="input_comment"
                      type="text"
                      placeholder="Add a reply..."
                      onChange={(e) => setNewMapReply(e.target.value)}
                    />
                    <div class="wrapper" onClick={addMapReply}>
                      <img className="btnimg" src={sendMessage} />
                    </div>
                  </div>
                </div>
              )}
            </Box>
          </FlexBetween>
        ))}
        {mapReplies.map((mapReply) => (
          <Comment 
            isRelpy={true}
            comment={comment}
            mapReply={mapReply}
            handleDeleteMapComment={handleDeleteMapComment}
            handleEditMapComment={handleEditMapComment}
          />
        ))}
      </Box>
    )
  }
}

export default Comment;