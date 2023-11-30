import { useState, useEffect } from "react";
import dummyComments from "./sample_data_comments.json";
import "./socialcomments.css";
import defaultImg from "../../assets/img/defaultProfileImg.jpg";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from "react-router-dom";
import { createSocialCommentAPIMethod, deleteSocialCommentAPIMethod, getAllExistingSocialCommentsAPI, getAllSocialCommentsAPI, updateSocialCommentAPIMethod } from "../../api/comment";
import { getAllUsersAPIMethod } from "../../api/user";
import { useSelector } from "react-redux";
import { getUserById } from "../../api/user";
import SocialReplies from "./SocialReplies";

const SocialComments = () => {
    const [allUsers, setAllUsers] = useState(null);
    const [comments, setComments] = useState([]);
    const [postComments, setPostComments] = useState([]);
    const [finalComments, setFinalComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentText, setCommentText] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const { id } = useParams();
    const [showingComment, setShowingComment] = useState(false);
    const [replyingCommentId, setReplyingCommentId] = useState(null);
    const [tempCommentId, setTempCommentId] = useState(null);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

    const currentUserId = useSelector((state) => state.user.id);

    const handleAddComment = async () => {
        if (newComment.trim() !== '') {
            const newCommentObject = {
                social_comment_content: newComment,
                social_comment_owner: currentUserId,
                social_post_id: id
            };
            setComments([...comments, newCommentObject]);

            const result = await createSocialCommentAPIMethod(newCommentObject);
            // console.log(result)

            newCommentObject["_id"] = result._id;
            let tempPostComments = postComments
            tempPostComments.push(newCommentObject._id)
            setPostComments(tempPostComments);

            let userData = await getUserInfo(newCommentObject["social_comment_owner"])
            newCommentObject["username"] = userData["username"]
            newCommentObject["profile_img"] = userData["profile_img"]

            let tempCommentArray = finalComments;
            tempCommentArray.push(newCommentObject)

            setFinalComments(tempCommentArray);

            setNewComment('');
        }
    };

    const handleClickDeleteComment = (commentId) => {
        if (showDeleteConfirmationModal) {
            setShowDeleteConfirmationModal(false);
            return;
        } else {
            setShowDeleteConfirmationModal(commentId);
        }

    }

    const handleDeleteComment = (commentId) => {
        setShowDeleteConfirmationModal(false);
        const filteredComments = finalComments.filter((c) => c._id !== commentId);
        setFinalComments(filteredComments);
        setPostComments(filteredComments.map((c) => c._id));
        deleteSocialCommentAPIMethod(commentId);
    };

    const handleClickEditComment = (commentId) => {
        if (editingCommentId != null) {
            setEditingCommentId(null);
        } else {
            setEditingCommentId(commentId);
        }
        const commentToEdit = finalComments.find((comment) => comment._id === commentId);
        setCommentText(commentToEdit.social_comment_content);
    }

    const handleEditCommentSave = (commentId) => {
        const newCom = finalComments.find((c) => c._id == commentId);
        newCom["social_comment_content"] = commentText;
        updateSocialCommentAPIMethod(commentId, newCom);
        const updatedComments = finalComments.map((c) =>
            c._id === commentId ? newCom : c
        );

        setFinalComments(updatedComments);
        setComments(updatedComments);
        setPostComments(updatedComments.map((c) => c._id));
        setEditingCommentId(null);
    }

    const handleClickReplyComment = (cid) => {
        setReplyingCommentId(cid);
        setTempCommentId(cid);
    }

    const getUserInfo = async (comment) => {
        if (comment != null) {
            const user = await getUserById(comment);
            return user;
        }
        return null;
    }

    const refresh = async () => {
        const arr = comments.filter((c) => postComments.includes(c._id));
        for (let i = 0; i < arr.length; i++) {
            try {
                if (arr[i]["username"] == null) {
                    let userData = await getUserInfo(arr[i]["social_comment_owner"])
                    arr[i]["username"] = userData["username"]
                    arr[i]["profile_img"] = userData["profile_img"]
                }
            } catch (error) {
                console.error("Error fetching userData posts:", error);
            }
        }
        setFinalComments(arr);
    }

    const handleClickShowComment = () => {
        refresh();
        setShowingComment(!showingComment);
    }

    useEffect(() => {
        getAllExistingSocialCommentsAPI().then((c) => { //get comments that have social_post_id == id
            setComments(c);
        })

        getAllSocialCommentsAPI(id).then((c) => {
            setPostComments(c);
        })

        getAllUsersAPIMethod().then((u) => {
            setAllUsers(u);
        })
    }, []);

    //will call get all comments api and then filter based on the mapId

    return (
        <div className="social_comments">
            <div className="social_comments_container">
                <div className="show_post_comments_container">
                    <hr className="show_post_comments_hr"></hr>
                    <button onClick={handleClickShowComment} className="show_post_comments">{showingComment ? "Hide Comments" : "Show Comments"}</button>
                    <hr className="show_post_comments_hr"></hr>

                </div>
                {showingComment && (
                    <div>
                        <h3>Comments</h3>
                        <hr id="socialcommentsline"></hr>
                        {finalComments.map((comment, i) => (
                            <div className="social_comment" key={i}>
                                <div className="social_comment_header">
                                    <img className="social_comment_profile_img" src={comment.profile_img != null ? comment.profile_img : defaultImg} />
                                    <div className="user">{comment.username != null ? comment.username : "Unknown User"}</div>
                                </div>
                                {editingCommentId === comment._id ? (
                                    <div>
                                        <textarea className="edit_comment_input" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                                        <button className="save_comment_changes" onClick={() => handleEditCommentSave(comment._id)}>
                                            save
                                        </button>
                                        <div className="social_comment_replies_container">
                                            <SocialReplies commentId={comment._id} replyingCommentId={replyingCommentId} tempCommentId={tempCommentId} />
                                        </div>
                                        <div className="comment_tools">
                                            {comment.social_comment_owner == currentUserId && (
                                                <div className="social_comment_bottom">
                                                    <div className="edit_comment_btn" onClick={() => handleClickEditComment(comment._id)}>
                                                        <EditIcon />
                                                        Edit comment
                                                    </div>
                                                    <div className="delete_comment_btn" onClick={() => handleDeleteComment(comment._id)}>
                                                        <DeleteIcon />
                                                        Delete comment
                                                    </div>
                                                </div>
                                            )
                                            }
                                            <div className="reply_comment_btn" onClick={() => handleClickReplyComment(comment._id)}>
                                                <ChatBubbleOutlineIcon />
                                                Reply
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="social_comment_content">{comment.social_comment_content}</p>
                                        <div className="social_comment_replies_container">
                                            <SocialReplies commentId={comment._id} replyingCommentId={replyingCommentId} setReplyingCommentId={setReplyingCommentId} tempCommentId={tempCommentId} />
                                        </div>
                                        <div className="comment_tools">
                                            {showDeleteConfirmationModal == comment._id && (
                                                <div className="delete_confirmation_modal">
                                                    <div className="delete_confirmation_modal_top">
                                                        Are you sure you want to delete this comment?
                                                    </div>
                                                    <div className="delete_confirmation_modal_bottom">
                                                        <button className="delete_comment_confirm" onClick={() => handleDeleteComment(comment._id)}>
                                                            Yes
                                                        </button>
                                                        <button className="cancel_delete_comment" onClick={() => setShowDeleteConfirmationModal(false)}>
                                                            No
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {comment.social_comment_owner == currentUserId && (
                                                <div className="social_comment_bottom">
                                                    <div className="edit_comment_btn" onClick={() => handleClickEditComment(comment._id)}>
                                                        <EditIcon />
                                                        Edit comment
                                                    </div>
                                                    <div className="delete_comment_btn" onClick={() => handleClickDeleteComment(comment._id)}>
                                                        <DeleteIcon />
                                                        Delete comment
                                                    </div>
                                                </div>
                                            )
                                            }
                                            <div className="reply_comment_btn" onClick={() => handleClickReplyComment(comment._id)}>
                                                <ChatBubbleOutlineIcon />
                                                Reply
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                )}

                {showingComment && (
                    <div className="social_comments_bottom">
                        <textarea
                            id="social_comment"
                            type="text"
                            placeholder="Add a comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}>
                        </textarea>
                        <button className="social_comment_button" onClick={handleAddComment}>Post</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SocialComments;