import { useState, useEffect } from "react";
import dummyComments from "./sample_data_comments.json";
import "./socialcomments.css";
import defaultImg from "../../assets/img/defaultProfileImg.jpg";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from "react-router-dom";
import { createSocialCommentAPIMethod, deleteSocialCommentAPIMethod, getAllExistingSocialCommentsAPI, getAllSocialCommentsAPI, updateSocialCommentAPIMethod } from "../../api/comment";
import { useSelector } from "react-redux";
import { getAllUsersAPIMethod } from "../../api/user";



const SocialComments = () => {
    const [allUsers, setAllUsers] = useState(null);
    const [comments, setComments] = useState([]);
    const [postComments, setPostComments] = useState([]);
    const [finalComments, setFinalComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentText, setCommentText] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [isReplying, setIsReplying] = useState(false);
    const [replyingCommentId, setReplyingCommentId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [newReply, setNewReply] = useState('');
    const { id } = useParams();
    const [showingComment, setShowingComment] = useState(false);
    const currentUserId = useSelector((state) => state.user.id);
    const [fComments, setFcomments] = useState([]);

    const handleAddComment = () => {
        if (newComment.trim() !== '') {
            const newCommentObject = {
                social_comment_content: newComment,
                social_comment_owner: currentUserId,
                social_post_id: id
            };
            setComments([...comments, newCommentObject]);
            setPostComments([...postComments, newCommentObject._id]);
            setFinalComments([...finalComments, newCommentObject]);
            createSocialCommentAPIMethod(newCommentObject);
            setNewComment('');
        }

        //createCommentAPI(newCommentObject)
    };

    const handleDeleteComment = (commentId) => {
        /* const updatedComments = sampleComments.filter((comment) => comment._id !== commentId);
        setSampleComments(updatedComments); */
        const filteredComments = finalComments.filter((c) => c._id !== commentId);
        setFinalComments(filteredComments);
        setPostComments(filteredComments.map((c) => c._id));
        deleteSocialCommentAPIMethod(commentId);
        //deleteCommentAPI(commentId)
    };

    const handleClickEditComment = (commentId) => {
        setEditingCommentId(commentId);
        const commentToEdit = finalComments.find((comment) => comment._id === commentId);
        setCommentText(commentToEdit.social_comment_content);
        //setIsEditingComment(!isEditingComment);
    }

    const handleEditCommentSave = (commentId) => {
        const newCom = { social_comment_content: commentText };
        updateSocialCommentAPIMethod(commentId, newCom);

        const temp = {
            social_comment_content: commentText,
            social_comment_owner: currentUserId
        }

        const updatedComments = finalComments.map((c) =>
            c._id === commentId ? temp : c
        );

        setFinalComments(updatedComments);
        setComments(updatedComments);
        setPostComments(updatedComments.map((c) => c._id));
        setEditingCommentId(null);
        //updateCommentAPI(commentId), won't need updatedComments variable
    }

    const handleReplyComment = (commentId) => {
        /* setReplyingCommentId(commentId);
        console.log(commentId); */
    }

    const handleClickReplyComment = () => {
        /* if (replyText.trim() !== '') {
            const newReplyObject = {
                _id: sampleReplies.length + 1,
                user: 'sam',
                reply: replyText,
                commentId: replyingCommentId,
            };
            setSampleReplies([...sampleReplies, newReplyObject]);
            setReplyText('');
        }
        //createCommentAPI(newCommentObject) */
    }

    const refresh = () => {
        setShowingComment(!showingComment);
        const commentsArr = comments.filter((c) => postComments.includes(c._id));
        setFinalComments(commentsArr);
    }

    const getCommentUser = (userId) => {
        const ret = allUsers.find((u) => (
            u._id === userId
        ));
        console.log("ret: ", ret);
        return ret && ret.username;
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
        /* const fetchPostComments = async () => {
            try {
                const comments = await getAllSocialCommentsAPI(id);
                setPostComments(comments);
                const comments2 = await getAllExistingSocialCommentsAPI();
                setComments(comments2);
            } catch (error) {
                console.error('Error fetching post comments:', error);
            }
        }
        fetchPostComments(); */
    }, []);

    return (
        <div className="social_comments">
            <div className="social_comments_container">
                <div className="show_post_comments_container">
                    <hr className="show_post_comments_hr"></hr>
                    <button onClick={refresh} className="show_post_comments">{showingComment ? "Hide Comments" : "Show Comments"}</button>
                    <hr className="show_post_comments_hr"></hr>

                </div>
                {showingComment && (
                    <div>
                        <h3>Comments</h3>
                        <hr id="socialcommentsline"></hr>
                        {finalComments.map((comment) => (
                            <div className="social_comment">
                                <div className="social_comment_header">
                                    <img className="social_comment_profile_img" src={defaultImg} />
                                    <div className="user">{getCommentUser(comment.social_comment_owner)}</div>
                                </div>

                                {editingCommentId === comment._id ? (
                                    <div>
                                        <textarea className="edit_comment_input" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                                        <button className="save_comment_changes" onClick={() => handleEditCommentSave(comment._id)}>
                                            save
                                        </button>
                                        {/* <div className="comment_replies">
                                        {sampleReplies.map((reply) => (
                                            <div>
                                                {reply.commentId == comment._id && (
                                                    <div className="comment_reply">
                                                        <div className="comment_reply_top">
                                                            <img className="social_comment_profile_img" src={defaultImg} />
                                                            {reply.user}
                                                        </div>
                                                        {reply.reply}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                        )}
                                    </div> */}
                                        <div className="social_comment_bottom">
                                            <div className="edit_comment_btn" onClick={() => handleClickEditComment(comment._id)}>
                                                <EditIcon />
                                                Edit comment
                                            </div>
                                            <div className="delete_comment_btn" onClick={() => handleDeleteComment(comment._id)}>
                                                <DeleteIcon />
                                                Delete comment
                                            </div>
                                            <div className="delete_comment_btn" onClick={() => handleReplyComment(comment._id)}>
                                                <ChatBubbleOutlineIcon />
                                                Reply
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p>{comment.social_comment_content}</p>
                                        {/* <div className="comment_replies">
                                            {sampleReplies.map((reply) => (
                                                <div>
                                                    {reply.commentId == comment._id && (
                                                        <div className="comment_reply">
                                                            <div className="comment_reply_top">
                                                                <img className="social_comment_profile_img" src={defaultImg} />
                                                                {reply.user}
                                                            </div>
                                                            {reply.reply}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                            )}
                                            {replyingCommentId === comment._id && (
                                                <div>
                                                    <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                                                    <button onClick={() => handleClickReplyComment(comment._id)}>reply</button>
                                                </div>
                                            )}
                                        </div> */}
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
                                                {/* <div className="delete_comment_btn" onClick={() => handleReplyComment(comment._id)}>
                                            <ChatBubbleOutlineIcon />
                                            Reply
                                        </div> */}
                                            </div>
                                        )
                                        }

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