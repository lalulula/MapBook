import { useState, useEffect } from "react";
import dummyComments from "./sample_data_comments.json";
import "./socialcomments.css";
import defaultImg from "../../assets/img/defaultProfileImg.jpg";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from "react-router-dom";
import { createSocialCommentAPIMethod, deleteSocialCommentAPIMethod, getAllExistingSocialCommentsAPI, getAllSocialCommentsAPI, getSocialCommentAPI, updateSocialCommentAPIMethod } from "../../api/comment";
import { useSelector } from "react-redux";



const SocialComment = ({ id }) => {
    const [user, setUser] = useState(null);
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
    const [showingComment, setShowingComment] = useState(false);
    const currentUserId = useSelector((state) => state.user.id);
    const [currentComment, setCurrentComment] = useState(null);

    const handleDeleteComment = (commentId) => {
        /* const updatedComments = sampleComments.filter((comment) => comment._id !== commentId);
        setSampleComments(updatedComments); */
        const filteredComments = finalComments.filter((c) => c._id !== commentId);
        setFinalComments(filteredComments);
        setPostComments(filteredComments.map((c) => c._id));
        deleteSocialCommentAPIMethod(commentId);
    };

    const handleClickEditComment = (commentId) => {
        setEditingCommentId(commentId);
        setCommentText(currentComment.social_comment_content);
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
        console.log("UPDATED COMMENTS: ", updatedComments);

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
    //will call get all comments api and then filter based on the mapId

    useEffect(() => {
        const fetchCurrentComment = async () => {
            try {
                const comment = await getSocialCommentAPI(id);
                setCurrentComment(comment);
            } catch (error) {
                console.error('Error fetching post comments:', error);
            }
        }
        fetchCurrentComment();
    }, []);

    console.log("current comment: ", currentComment);

    return (
        <div className="social_comments">
            {currentComment && (
                <div>
                    <h3>Comments</h3>
                    <hr id="socialcommentsline"></hr>
                    <div className="social_comment">
                        <div className="social_comment_header">
                            <img className="social_comment_profile_img" src={defaultImg} />
                            <div className="user">{currentComment.social_comment_owner}</div>
                        </div>
                        {editingCommentId === currentComment._id ? (
                            <div>
                                <textarea className="edit_comment_input" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                                <button className="save_comment_changes" onClick={() => handleEditCommentSave(currentComment._id)}>
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
                                    <div className="edit_comment_btn" onClick={() => handleClickEditComment(currentComment._id)}>
                                        <EditIcon />
                                        Edit comment
                                    </div>
                                    <div className="delete_comment_btn" onClick={() => handleDeleteComment(currentComment._id)}>
                                        <DeleteIcon />
                                        Delete comment
                                    </div>
                                    <div className="delete_comment_btn" onClick={() => handleReplyComment(currentComment._id)}>
                                        <ChatBubbleOutlineIcon />
                                        Reply
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p>{currentComment.social_comment_content}</p>
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
                                {currentComment.social_comment_owner == currentUserId && (
                                    <div className="social_comment_bottom">
                                        <div className="edit_comment_btn" onClick={() => handleClickEditComment(currentComment._id)}>
                                            <EditIcon />
                                            Edit comment
                                        </div>
                                        <div className="delete_comment_btn" onClick={() => handleDeleteComment(currentComment._id)}>
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
                </div>
            )}


        </div>
    )
}

export default SocialComment;