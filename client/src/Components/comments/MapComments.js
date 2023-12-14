import { useState, useEffect } from "react";
import "./mapcomments.css";
import defaultImg from "../../assets/img/defaultProfileImg.jpg";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useParams } from "react-router-dom";
import {
  createMapCommentAPIMethod,
  deleteMapCommentAPIMethod,
  getAllExistingMapCommentsAPIMethod,
  getAllMapCommentsAPIMethod,
  updateMapCommentAPIMethod,
} from "../../api/map";
import { getAllUsersAPIMethod, getUserById } from "../../api/user";
import { useSelector } from "react-redux";
import MapReplies from "./MapReplies";

const MapComments = () => {
  const [allUsers, setAllUsers] = useState(null);
  const [comments, setComments] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [finalComments, setFinalComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const { mapId } = useParams();
  // console.log("THIS IS THE ID: ", mapId);
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const [showingComment, setShowingComment] = useState(false);
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [tempCommentId, setTempCommentId] = useState(null);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);

  const currentUserId = useSelector((state) => state.user.id);

  const handleAddComment = async () => {
    if (newComment.trim() !== "") {
      const newCommentObject = {
        map_comment_content: newComment,
        map_comment_owner: currentUserId,
        map_id: mapId,
      };
      setComments([...comments, newCommentObject]);

      const result = await createMapCommentAPIMethod(newCommentObject);
      // console.log(result)

      newCommentObject["_id"] = result._id;
      let tempPostComments = postComments;
      tempPostComments.push(newCommentObject._id);
      setPostComments(tempPostComments);

      let userData = await getUserInfo(
        newCommentObject["map_comment_owner"]
      );
      newCommentObject["username"] = userData["username"];
      newCommentObject["profile_img"] = userData["profile_img"];

      let tempCommentArray = finalComments;
      tempCommentArray.push(newCommentObject);

      setFinalComments(tempCommentArray);

      setNewComment("");
    }
  };

  const handleClickDeleteComment = (commentId) => {
    if (showDeleteConfirmationModal) {
      setShowDeleteConfirmationModal(false);
      return;
    } else {
      setShowDeleteConfirmationModal(commentId);
    }
  };

  const handleDeleteComment = (commentId) => {
    setShowDeleteConfirmationModal(false);
    const filteredComments = finalComments.filter((c) => c._id !== commentId);
    setFinalComments(filteredComments);
    setPostComments(filteredComments.map((c) => c._id));
    deleteMapCommentAPIMethod(commentId);
  };

  const handleClickEditComment = (commentId) => {
    if (editingCommentId != null) {
      setEditingCommentId(null);
    } else {
      setEditingCommentId(commentId);
    }
    const commentToEdit = finalComments.find(
      (comment) => comment._id === commentId
    );
    setCommentText(commentToEdit.social_comment_content);
  };

  const handleEditCommentSave = (commentId) => {
    const newCom = finalComments.find((c) => c._id == commentId);
    newCom["map_comment_content"] = commentText;
    updateMapCommentAPIMethod(commentId, newCom);
    const updatedComments = finalComments.map((c) =>
      c._id === commentId ? newCom : c
    );

    setFinalComments(updatedComments);
    setComments(updatedComments);
    setPostComments(updatedComments.map((c) => c._id));
    setEditingCommentId(null);
  };

  const handleClickReplyComment = (cid) => {
    if (replyingCommentId != null) {
      setReplyingCommentId(null);
    } else {
      setReplyingCommentId(cid);
      setTempCommentId(cid);
    }
  };

  const getUserInfo = async (comment) => {
    if (comment != null) {
      const user = await getUserById(comment);
      return user;
    }
    return null;
  };

  const refresh = async () => {
    const arr = comments.filter((c) => postComments.includes(c._id));
    console.log("comments: ", comments);
    console.log("postComments: ", postComments);
    console.log("refresh: arr: ", arr);
    for (let i = 0; i < arr.length; i++) {
      try {
        if (arr[i]["username"] == null) {
          let userData = await getUserInfo(arr[i]["map_comment_owner"]);
          arr[i]["username"] = userData["username"];
          arr[i]["profile_img"] = userData["profile_img"];
        }
      } catch (error) {
        console.error("Error fetching userData posts:", error);
      }
    }
    setFinalComments(arr);
  };

  const handleClickShowComment = () => {
    refresh();
    setShowingComment(!showingComment);
  };

  useEffect(() => {
    getAllExistingMapCommentsAPIMethod().then((c) => {
      //get comments that have social_post_id == id
      setComments(c);
    });

    getAllMapCommentsAPIMethod(mapId).then((c) => {
      setPostComments(c);
    });

    getAllUsersAPIMethod().then((u) => {
      setAllUsers(u);
    });
  }, []);

  //will call get all comments api and then filter based on the mapId

  return (
    <div className="map_comments">
      <div className="map_comments_container">
        <div className="show_map_comments_container">
          <hr className="show_map_comments_hr"></hr>
          <button
            onClick={handleClickShowComment}
            className="show_map_comments"
          >
            {showingComment ? "Hide Comments" : "Show Comments"}
          </button>
          <hr className="show_map_comments_hr"></hr>
        </div>
        {showingComment && (
          <div>
            <h3>Comments</h3>
            <hr id="mapcommentsline"></hr>
            {finalComments.map((comment, i) => (
              <div className="map_comment" key={i}>
                <div className="map_comment_header">
                  <img
                    className="map_comment_profile_img"
                    src={
                      comment.profile_img != null
                        ? comment.profile_img
                        : defaultImg
                    }
                  />
                  <div className="user">
                    {comment.username != null
                      ? comment.username
                      : "Unknown User"}
                  </div>
                </div>
                {editingCommentId === comment._id ? (
                  <div>
                    <div className="mapcomments_edit_container">
                      <textarea
                        className="edit_map_comment_input"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <button
                        className="save_map_comment_changes"
                        onClick={() => handleEditCommentSave(comment._id)}
                      >
                        save
                      </button>
                    </div>
                    <div className="map_comment_replies_container">
                      <MapReplies
                        commentId={comment._id}
                        replyingCommentId={replyingCommentId}
                        tempCommentId={tempCommentId}
                      />
                    </div>
                    {showDeleteConfirmationModal == comment._id && (
                      <div className="mapcomments_delete_confirmation_modal">
                        <div className="mapcomments_delete_confirmation_modal_top">
                          Are you sure you want to delete this comment?
                        </div>
                        <div className="mapcomments_delete_confirmation_modal_bottom">
                          <button
                            className="mapcomments_delete_comment_confirm"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Yes
                          </button>
                          <button
                            className="mapcomments_cancel_delete_comment"
                            onClick={() =>
                              setShowDeleteConfirmationModal(false)
                            }
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="comment_tools">
                      {comment.map_comment_owner == currentUserId && (
                        <div className="map_comment_bottom">
                          <div
                            className="edit_map_comment_btn"
                            onClick={() => handleClickEditComment(comment._id)}
                          >
                            <EditIcon />
                            Edit comment
                          </div>
                          <div
                            className="delete_map_comment_btn"
                            onClick={() =>
                              handleClickDeleteComment(comment._id)
                            }
                          >
                            <DeleteIcon />
                            Delete comment
                          </div>
                        </div>
                      )}
                      <div
                        className="reply_map_comment_btn"
                        onClick={() => handleClickReplyComment(comment._id)}
                      >
                        <ChatBubbleOutlineIcon />
                        Reply
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="map_comment_content">
                      {comment.map_comment_content}
                    </p>
                    <div className="map_comment_replies_container">
                      <MapReplies
                        commentId={comment._id}
                        replyingCommentId={replyingCommentId}
                        setReplyingCommentId={setReplyingCommentId}
                        tempCommentId={tempCommentId}
                        setEditingCommentId={setEditingCommentId}
                      />
                    </div>
                    <div className="map_comment_tools">
                      {showDeleteConfirmationModal == comment._id && (
                        <div className="mapcomments_delete_confirmation_modal">
                          <div className="mapcomments_delete_confirmation_modal_top">
                            Are you sure you want to delete this comment?
                          </div>
                          <div className="mapcomments_delete_confirmation_modal_bottom">
                            <button
                              className="mapcomments_delete_comment_confirm"
                              onClick={() => handleDeleteComment(comment._id)}
                            >
                              Yes
                            </button>
                            <button
                              className="mapcomments_cancel_delete_comment"
                              onClick={() =>
                                setShowDeleteConfirmationModal(false)
                              }
                            >
                              No
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="comment_tools">
                      {comment.map_comment_owner === currentUserId && (
                        <div className="map_comment_bottom">
                          <div
                            className="edit_map_comment_btn"
                            onClick={() => handleClickEditComment(comment._id)}
                          >
                            <EditIcon />
                            Edit comment
                          </div>
                          <div
                            className="delete_map_comment_btn"
                            onClick={() =>
                              handleClickDeleteComment(comment._id)
                            }
                          >
                            <DeleteIcon />
                            Delete comment
                          </div>
                        </div>
                      )}
                      {isAuth && (
                        <div
                          className="reply_comment_btn"
                          onClick={() => handleClickReplyComment(comment._id)}
                        >
                          <ChatBubbleOutlineIcon />
                          Reply
                          {/* <p>Reply</p> */}
                        </div>
                      )}
                      </div>
                      
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showingComment && (
          <div className="map_comments_bottom">
            {isAuth ? (
              <>
                {" "}
                <textarea
                  id="map_comment"
                  type="text"
                  placeholder="Add a comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                  className="map_comment_button"
                  onClick={handleAddComment}
                >
                  Post
                </button>
              </>
            ) : (
              <div>Please Login/Register to Comment</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComments;




// import { useState, useEffect } from "react";
// import "./mapcomments.css";
// import defaultImg from "../../assets/img/defaultProfileImg.jpg";
// import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import { useParams } from "react-router-dom";
// import {
//   getAllMapCommentsAPIMethod,
//   createMapCommentAPIMethod,
//   updateMapCommentAPIMethod,
//   deleteMapCommentAPIMethod,
//   getAllExistingMapCommentsAPIMethod,
// } from "../../api/map";
// import { getAllUsersAPIMethod, getUserById } from "../../api/user";
// import { useSelector } from "react-redux";
// import MapReplies from "./MapReplies";

// import { Box, Typography } from "@mui/material";
// import FlexBetween from "../FlexBetween";
// import sendMessage from "../../assets/img/sendMessage.png";
// import { Icon } from 'semantic-ui-react'


// const MapComments = () => {
//   const [allUsers, setAllUsers] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [postComments, setPostComments] = useState([]);
//   const [finalComments, setFinalComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [commentText, setCommentText] = useState("");
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const { mapId } = useParams();
//   const isAuth = useSelector((state) => state.user.isAuthenticated);
//   const [showingComment, setShowingComment] = useState(false);
//   const [replyingCommentId, setReplyingCommentId] = useState(null);
//   const [tempCommentId, setTempCommentId] = useState(null);
//   const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
//     useState(false);
//   const [dropdownVisible, setDropdownVisible] = useState(false);


//   const currentUserId = useSelector((state) => state.user.id);
//   const profileImgPath = useSelector((state) => state.user.user.profile_img);

//   const handleAddMapComment = async () => {
//     if (newComment.trim() !== "") {
//       const newCommentObject = {
//         map_comment_content: newComment,
//         map_comment_owner: currentUserId,
//         map_id: mapId,
//       };
//       setComments([...comments, newCommentObject]);
//       const result  = await createMapCommentAPIMethod(newCommentObject);
//       newCommentObject["_id"] = result._id;
//       let tempPostComments = postComments;
//       tempPostComments.push(newCommentObject._id);
//       setPostComments(tempPostComments);

//       let userData = await getUserInfo(
//         newCommentObject["social_comment_owner"]
//       );
//       newCommentObject["username"] = userData["username"];
//       newCommentObject["profile_img"] = userData["profile_img"];

//       let tempCommentArray = finalComments;
//       tempCommentArray.push(newCommentObject);

//       setFinalComments(tempCommentArray);

//       setNewComment("");  
//     }
//   };


//   const handleClickDeleteMapComment = (commentId) => {
//     console.log("handleClickDeleteMapComment called")
//     console.log("showDeleteConfirmationModal: ", showDeleteConfirmationModal)
//     if (showDeleteConfirmationModal) {
//       setShowDeleteConfirmationModal(false);
//       return;
//     } else {
//       setShowDeleteConfirmationModal(commentId);
//     }
//   };

//   const handleDeleteMapComment = (mapCommentId) => {
//     setShowDeleteConfirmationModal(false);
//     const filteredComments = finalComments.filter((c) => c._id !== mapCommentId);
//     setFinalComments(filteredComments);
//     setPostComments(filteredComments.map((c) => c._id));
//     deleteMapCommentAPIMethod(mapCommentId);

//   };

//   const handleClickEditMapComment = (commentId) => {
//     console.log("handleClickEditMapComment called")
//     console.log("editingCommentId: ", editingCommentId)

//     if (editingCommentId != null) {
//       setEditingCommentId(null);
//     } else {
//       setEditingCommentId(commentId);
//     }
//     setDropdownVisible(false);

//     console.log("after setting editingCommentId: ", editingCommentId)

//     const commentToEdit = finalComments.find(
//       (comment) => comment._id === commentId
//     );
//     setCommentText(commentToEdit.map_comment_content);
//   };

//   const handleEditMapCommentSave = (commentId) => {
//     console.log("finalComments: ", finalComments)
//     console.log("commentId: ", commentId)

//     const newCom = finalComments.find((c) => c._id == commentId);
//     console.log("newCom: ", newCom)
//     newCom["map_comment_content"] = commentText;
//     updateMapCommentAPIMethod(commentId, newCom);
//     const updatedComments = finalComments.map((c) =>
//       c._id === commentId ? newCom : c
//     );

//     setFinalComments(updatedComments);
//     setComments(updatedComments);
//     setPostComments(updatedComments.map((c) => c._id));
//     setEditingCommentId(null);
//   };

//   const handleClickReplyMapComment = (cid) => {
//     if (replyingCommentId != null) {
//       setReplyingCommentId(null);
//     } else {
//       setReplyingCommentId(cid);
//       setTempCommentId(cid);
//     }
//   };

//   const handleClickDottedMenu = (commentId) => {
//     if (dropdownVisible != false) {
//         setDropdownVisible(false);
//     } else {
//         setDropdownVisible(commentId);
//     }
// }

//   const getUserInfo = async (comment) => {
//     if (comment != null) {
//       const user = await getUserById(comment);
//       return user;
//     }
//     return null;
//   };

//   const refresh = async () => {
//     const arr = comments.filter((c) => postComments.includes(c._id));
//     // console.log("comments: ", comments);
//     // console.log("postComments: ", comments);
//     // console.log("refresh: arr: ", arr);

//     for (let i = 0; i < arr.length; i++) {
//       try {
//         if (arr[i]["username"] == null) {
//           let userData = await getUserInfo(arr[i]["map_comment_owner"]);
//           arr[i]["username"] = userData["username"];
//           arr[i]["profile_img"] = userData["profile_img"];
//         }
//       } catch (error) {
//         console.error("Error fetching userData posts:", error);
//       } 
//     }
//     setFinalComments(arr);
//     // console.log("refresh: finalComments: ", finalComments);
//   };


//   useEffect(() => {
//     // console.log("id: ", mapId)

//     getAllExistingMapCommentsAPIMethod().then((c) => {
//       //get comments that have map_post_id == id
//       setComments(c);
//       // console.log("getAllExistingMapCommentsAPIMethod", c);
//     });

//     getAllMapCommentsAPIMethod(mapId).then((c) => {
//       setPostComments(c);
//       // console.log("getAllMapCommentsAPIMethod", c);

//     }); 

//     getAllUsersAPIMethod().then((u) => {
//       setAllUsers(u);
//       // console.log("getAllUsersAPIMethod", u);

//     });

//   }, []);

//   useEffect(() => {
//     // console.log("refresh Called")
//     refresh();
//   }, [comments, postComments]);


//   return ( 
//     <div className="map_details_comments">
//     <div className="comment_title">Comments</div>
//       <div className="comment_content">
//         <div>
//           {finalComments.map((comment, i) => (
//             <Box mb="10px" ml="55px">
//               <FlexBetween key={i} mb="15px">
//                 <Box width="13%" alignSelf="start" mt="7px">
//                   <img style={{width: "35px", height: "35px", borderRadius: "50%"}} src={
//                         comment.profile_img != null
//                           ? comment.profile_img
//                           : defaultImg
//                       }/>
//                 </Box>
//                 <Box width="90%">
//                   <Box 
//                     borderRadius="0 15px 15px 15px"
//                     p="10px"
//                     mb="5px"
//                     backgroundColor="#323643"
//                   >
//                     <FlexBetween mb="10px">
//                       <Box>
//                         <Typography fontSize="18px" fontWeight="bold" color="whitesmoke">
//                         {comment.username != null
//                           ? comment.username
//                           : "Unknown User"}
//                         </Typography>
//                       </Box>
//                         <Box position="relative">
//                           <Box 
            
//                           >
//                           {comment.map_comment_owner === currentUserId && editingCommentId == null && !showDeleteConfirmationModal && (
//                               <div className="map_reply_dotted_menu" onClick={() => handleClickDottedMenu(comment._id)}>
//                                   ...
//                               </div>
//                           )}
//                           {dropdownVisible === comment._id && (
//                               <div className="map_reply_dropdown">
//                                   <div className="edit_reply_btn" onClick={() => handleClickEditMapComment(comment._id)}>
//                                       Edit
//                                   </div>
//                                   <hr style={{ "width": "100%" }}></hr>
//                                   <div className="delete_reply_btn" onClick={() => handleClickDeleteMapComment(comment._id)}>
//                                       Delete
//                                   </div>
//                               </div>
//                           )}
//                             {/* <ul style={{listStyle: "none", margin: "0", padding: "0"}}>
//                               <li 
//                                 style={{cursor: "pointer", padding: "5px 10px", transition: "background-color 0.3s"}}
//                                 onClick={() => {handleClickEditMapComment(comment._id)}}
//                               >
//                                 Edit
//                               </li>
//                               <li 
//                                 style={{cursor: "pointer", padding: "5px 10px", transition: "background-color 0.3s"}}
//                                 onClick={() => {handleClickDeleteMapComment(comment._id)}}
//                               >
//                                 Delete
//                               </li>
//                             </ul> */}
//                           </Box>
//                           {/* <Icon name="ellipsis horizontal" onClick={toggleCommentOptions}/> */}
//                         </Box>

                      

//                     </FlexBetween>
//                     {/* {console.log("editingCommentId === comment._id: ", editingCommentId === comment._id)}
//                     {console.log("editingCommentId: ", editingCommentId )}
//                     {console.log("comment._id: ", comment._id)} */}

//                     {editingCommentId === comment._id ? (
//                       <FlexBetween>
//                         <input
//                           style={{
//                             backgroundColor: "#2A282E",
//                             outline: "0",
//                             boxShadow: "none",
//                             padding: "10px",
//                             color: "#b8c5c9",
//                             border: "none",
//                             borderRadius: "10px",
//                             width: "85%"
//                           }}
//                           type="text"
//                           placeholder={comment.map_comment_content}
//                           onChange={(e) => setCommentText(e.target.value)}
//                         />
//                         <Box 
//                           onClick={() => handleEditMapCommentSave(comment._id)}
//                         >
//                           <img className="btnimg" src={sendMessage} />
//                         </Box>
//                       </FlexBetween>
//                     ) : (

//                       <Typography fontSize="16px" color="whitesmoke">
//                         {comment.map_comment_content}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Box>

//                 {showDeleteConfirmationModal == comment._id && (
//                   <div className="delete_confirmation_modal">
//                     <div className="delete_confirmation_modal_top">
//                       Are you sure you want to delete this comment?
//                     </div>
//                     <div className="delete_confirmation_modal_bottom">
//                       <button
//                         className="delete_comment_confirm"
//                         onClick={() => handleDeleteMapComment(comment._id)}
//                       >
//                         Yes
//                       </button>
//                       <button
//                         className="cancel_delete_comment"
//                         onClick={() =>
//                           setShowDeleteConfirmationModal(false)
//                         }
//                       >
//                         No
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {isAuth && (
//                   <FlexBetween ml="10px" width="22%">
//                     <Typography 
//                       fontSize="12px"
//                       fontWeight="bold"
//                       color="#dadada"
//                       onClick={() => handleClickReplyMapComment(comment._id)}
//                     >
//                       Reply
//                     </Typography>
//                   </FlexBetween>
//                 )}
//               </FlexBetween>
              
//               <MapReplies
//                 commentId={comment._id}
//                 replyingCommentId={replyingCommentId}
//                 setReplyingCommentId={setReplyingCommentId}
//                 tempCommentId={tempCommentId}
//                 setEditingCommentId={setEditingCommentId}
//               />
//             </Box>

//           ))}
//         </div>

//         <div className="comment_box">
//           {isAuth ? (
//             <>
//               <div className="comment_box_profile">

//                 <img
//                   alt=""
//                   key={currentUserId}
//                   style={{ marginTop: "4px" }}
//                   className="profile_img"
//                   src={profileImgPath}
//                 ></img>

//               </div>
//               <div className="comment_box_input">
//                 <input
//                   className="input_comment"
//                   type="text"
//                   placeholder="Add a comment..."
//                   // value={newMapComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                 />
//                 <div class="wrapper" onClick={handleAddMapComment}>
//                   <img className="btnimg" src={sendMessage} />
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div>Please Login/Register to Comment.</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MapComments;