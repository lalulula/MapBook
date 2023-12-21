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
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const [showingComment, setShowingComment] = useState(false);
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [tempCommentId, setTempCommentId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
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

      let userData = await getUserInfo(newCommentObject["map_comment_owner"]);
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
    setReplyingCommentId(null);
    setEditingReplyId(null);
    if (editingCommentId != null) {
      setEditingCommentId(null);
    } else {
      setEditingCommentId(commentId);
    }
    const commentToEdit = finalComments.find(
      (comment) => comment._id === commentId
    );
    setCommentText(commentToEdit.map_comment_content);
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
    setEditingCommentId(null);
    setReplyingCommentId(null);
    setEditingReplyId(null);
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
    // console.log("comments: ", comments);
    // console.log("postComments: ", postComments);
    // console.log("refresh: arr: ", arr);
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
                    <div className="socialcomments_edit_container">
                      <textarea
                        className="edit_comment_input"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <button
                        className="save_comment_changes"
                        onClick={() => handleEditCommentSave(comment._id)}
                      >
                        save
                      </button>
                    </div>
                    <div className="map_comment_replies_container">
                      <MapReplies
                        commentId={comment._id}
                        replyingCommentId={replyingCommentId}
                        setReplyingCommentId={setReplyingCommentId}
                        setEditingCommentId={setEditingCommentId}
                        editingCommentId={editingCommentId}
                        editingReplyId={editingReplyId}
                        setEditingReplyId={setEditingReplyId}
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
                      <div className="map_comment_bottom_container">
                        <div className="map_comment_bottom">
                          {comment.map_comment_owner === currentUserId && (
                            <div
                              className="edit_comment_btn"
                              onClick={() =>
                                handleClickEditComment(comment._id)
                              }
                            >
                              <EditIcon style={{ fontSize: "17px" }} />
                              Edit comment
                            </div>
                          )}
                          {comment.map_comment_owner === currentUserId && (
                            <div
                              className="delete_comment_btn"
                              onClick={() =>
                                handleClickDeleteComment(comment._id)
                              }
                            >
                              <DeleteIcon style={{ fontSize: "17px" }} />
                              Delete comment
                            </div>
                          )}
                          {isAuth && (
                            <div
                              className="reply_comment_btn"
                              onClick={() =>
                                handleClickReplyComment(comment._id)
                              }
                            >
                              <ChatBubbleOutlineIcon
                                style={{ fontSize: "20px" }}
                              />
                              <p>Reply</p>
                            </div>
                          )}
                        </div>
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
                        setEditingCommentId={setEditingCommentId}
                        editingCommentId={editingCommentId}
                        editingReplyId={editingReplyId}
                        setEditingReplyId={setEditingReplyId}
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
                        <div className="map_comment_bottom_container">
                          <div className="map_comment_bottom">
                            {comment.map_comment_owner === currentUserId && (
                              <div
                                className="edit_comment_btn"
                                onClick={() =>
                                  handleClickEditComment(comment._id)
                                }
                              >
                                <EditIcon style={{ fontSize: "17px" }} />
                                Edit comment
                              </div>
                            )}
                            {comment.map_comment_owner === currentUserId && (
                              <div
                                className="delete_comment_btn"
                                onClick={() =>
                                  handleClickDeleteComment(comment._id)
                                }
                              >
                                <DeleteIcon style={{ fontSize: "17px" }} />
                                Delete comment
                              </div>
                            )}
                            {isAuth && (
                              <div
                                className="reply_comment_btn"
                                onClick={() =>
                                  handleClickReplyComment(comment._id)
                                }
                              >
                                <ChatBubbleOutlineIcon
                                  style={{ fontSize: "20px" }}
                                />
                                <p>Reply</p>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* {comment.map_comment_owner === currentUserId && (
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
                      )} */}
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
