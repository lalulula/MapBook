import React, { useEffect, useState } from "react";
import {
  createMapPostReplyAPIMethod,
  deleteMapPostReplyAPIMethod,
  getAllExistingMapPostRepliesAPIMethod,
  getAllMapPostRepliesAPIMethod,
  updateMapPostReplyAPIMethod,
} from "../../api/map";
import { getAllUsersAPIMethod } from "../../api/user";
import { useSelector } from "react-redux";

const MapReplies = ({
  commentId,
  replyingCommentId,
  setReplyingCommentId,
  setEditingCommentId,
  editingCommentId,
  editingReplyId,
  setEditingReplyId,
}) => {
  const [allExistingReplies, setAllExistingReplies] = useState([]);
  const [allReplies, setAllReplies] = useState([]);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [newReply, setNewReply] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const currentUserId = useSelector((state) => state.user.id);

  const handleClickReplyComment = async () => {
    if (newReply.trim() !== "") {
      const newReplyObject = {
        map_reply_content: newReply,
        map_reply_owner: currentUserId,
        map_comment_id: commentId,
      };
      const result = await createMapPostReplyAPIMethod(newReplyObject);
      newReplyObject["_id"] = result._id;
      setAllReplies([...allReplies, newReplyObject]);
      setNewReply("");
      setReplyingCommentId(null);
    }
  };

  const handleClickDottedMenu = (replyId) => {
    if (dropdownVisible != false) {
      setDropdownVisible(false);
    } else {
      setDropdownVisible(replyId);
    }
  };

  const handleClickEditReply = (replyId) => {
    setEditingCommentId(null);
    setReplyingCommentId(null);
    if (editingReplyId == replyId) {
      setEditingReplyId(null);
    } else {
      setEditingReplyId(replyId);
    }
    setDropdownVisible(false);
    const replyToEdit = allReplies.find((r) => r._id == replyId);
    setReplyText(replyToEdit.map_reply_content);
  };

  const handleEditRepliesave = (replyId) => {
    const newRep = allReplies.find((c) => c._id == replyId);
    newRep["map_reply_content"] = replyText;
    updateMapPostReplyAPIMethod(replyId, newRep);
    const updatedReplies = allReplies.map((c) =>
      c._id == replyId ? newRep : c
    );
    setAllReplies(updatedReplies);
    setEditingReplyId(null);
    setDropdownVisible(false);
  };

  const handleClickDeleteReply = (replyId) => {
    setDropdownVisible(false);
    if (showDeleteConfirmationModal) {
      setShowDeleteConfirmationModal(false);
      return;
    } else {
      setShowDeleteConfirmationModal(replyId);
    }
  };

  const handleDeleteReply = (replyId) => {
    const filteredReplies = allReplies.filter((c) => c._id !== replyId);
    setAllReplies(filteredReplies);
    deleteMapPostReplyAPIMethod(replyId);
    setDropdownVisible(false);
  };

  useEffect(() => {
    getAllExistingMapPostRepliesAPIMethod().then((r) => {
      setAllExistingReplies(r);
    });
    getAllMapPostRepliesAPIMethod(commentId).then((r) => {
      setAllReplies(r);
    });
    getAllUsersAPIMethod().then((u) => {
      setAllUsers(u);
    });
  }, []);

  return (
    <div className="map_comment_replies_wrapper">
      {allReplies.length > -1 && (
        <div className="map_comment_replies">
          {allReplies.length > 0 &&
            allReplies.map((reply, i) => (
              <div className="map_comment_reply" key={i}>
                {allUsers.find((u) => u._id == reply.map_reply_owner) && (
                  <div>
                    <div className="map_comment_header">
                      <img
                        className="map_comment_profile_img"
                        src={
                          (
                            allUsers.length > 0 &&
                            allUsers.find((u) => u._id == reply.map_reply_owner)
                          ).profile_img
                        }
                      />
                      <p className="user">
                        {
                          (
                            allUsers.length > 0 &&
                            allUsers.find((u) => u._id == reply.map_reply_owner)
                          ).username
                        }
                      </p>
                    </div>
                    <p className="map_comment_content">
                      {editingReplyId === reply._id ? (
                        <div className="map_comment_content_textarea">
                          <textarea
                            className="map_comment_reply_input"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <button
                            className="save_reply_changes"
                            onClick={() => handleEditRepliesave(reply._id)}
                          >
                            save
                          </button>
                        </div>
                      ) : (
                        <div>
                          {showDeleteConfirmationModal == reply._id && (
                            <div className="mapcomments_delete_confirmation_modal">
                              <div className="delete_confirmation_modal_top">
                                Are you sure you want to delete this comment?
                              </div>
                              <div className="mapcomments_delete_confirmation_modal_bottom">
                                <button
                                  className="delete_comment_confirm"
                                  onClick={() => handleDeleteReply(reply._id)}
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
                          {reply.map_reply_content}
                          {reply.map_reply_owner == currentUserId && (
                            <div className="social_reply_dotted_menu_container">
                              {dropdownVisible && (
                                <div
                                  className="social_reply_dotted_menu_overlay"
                                  onClick={() => setDropdownVisible(false)}
                                ></div>
                              )}
                              <div
                                className="map_reply_dotted_menu"
                                onClick={() => handleClickDottedMenu(reply._id)}
                              >
                                ...
                              </div>
                            </div>
                          )}
                          {dropdownVisible === reply._id && (
                            <div className="social_reply_dropdown">
                              <div
                                className="edit_reply_btn"
                                onClick={() => handleClickEditReply(reply._id)}
                              >
                                Edit
                              </div>
                              <hr style={{ width: "100%", margin: "0" }}></hr>

                              <div
                                className="delete_reply_btn"
                                onClick={() =>
                                  handleClickDeleteReply(reply._id)
                                }
                              >
                                Delete
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))}
          {replyingCommentId == commentId && (
            <div className="reply_text_field">
              <textarea
                className="map_comment_reply_input"
                type="text"
                placeholder="Write your reply"
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
              ></textarea>
              <button
                className="post_reply_btn"
                onClick={handleClickReplyComment}
              >
                Post
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapReplies;
