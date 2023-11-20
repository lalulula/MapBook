import { useState, useEffect } from "react";
import dummyComments from "./sample_data_comments.json";
import "./socialcomments.css";
import defaultImg from "../../assets/img/defaultProfileImg.jpg";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const SocialComments = () => {
    const [user, setUser] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [isReplying, setIsReplying] = useState(false);
    const [replyingCommentId, setReplyingCommentId] = useState(null);
    const [replyText, setReplyText] = useState(null);
    const [newReply, setNewReply] = useState('');


    const [sampleComments, setSampleComments] = useState([
        { _id: 1, user: 'bobby', comment: 'This is the first comment' },
        { _id: 2, user: 'sammy', comment: 'This is the second comment' },
    ]);

    const [sampleReplies, setSampleReplies] = useState([
        { _id: 1, user: 'jon', reply: 'reply to comment 1', commentId: 1 },
        { _id: 2, user: 'jill', reply: 'another reply to comment 1', commentId: 1 },
        { _id: 3, user: 'jass', reply: 'and again another reply to comment 1', commentId: 1 },
        { _id: 4, user: 'yunah', reply: 'reply to comment 2', commentId: 2 },
        { _id: 5, user: 'haneul', reply: 'another reply to comment 2', commentId: 2 },
    ])

    const handleAddComment = () => {
        if (newComment.trim() !== '') {
            const newCommentObject = {
                _id: sampleComments.length + 1,
                user: 'jill',
                comment: newComment,
            };
            setSampleComments([...sampleComments, newCommentObject]);
            setNewComment('');
        }
        //createCommentAPI(newCommentObject)
    };

    const handleDeleteComment = (commentId) => {
        const updatedComments = sampleComments.filter((comment) => comment._id !== commentId);
        setSampleComments(updatedComments);
        //deleteCommentAPI(commentId)
    };

    const handleClickEditComment = (commentId) => {
        setEditingCommentId(commentId);
        const commentToEdit = sampleComments.find((comment) => comment._id === commentId);
        setCommentText(commentToEdit.comment);
        //setIsEditingComment(!isEditingComment);
    }

    const handleEditCommentSave = (commentId) => {
        console.log("commentId: ", commentId);
        const updatedComments = sampleComments.map((comment) =>
            comment._id === commentId ? { ...comment, comment: commentText } : comment
        );
        setSampleComments(updatedComments);
        setEditingCommentId(null);
        //updateCommentAPI(commentId), won't need updatedComments variable
    }

    const handleReplyComment = (commentId) => {
        setReplyingCommentId(commentId);
        console.log(commentId);
    }

    const handleClickReplyComment = () => {
        if (replyText.trim() !== '') {
            const newReplyObject = {
                _id: sampleReplies.length + 1,
                user: 'sam',
                reply: replyText,
                commentId: replyingCommentId,
            };
            setSampleReplies([...sampleReplies, newReplyObject]);
            setReplyText('');
        }
        //createCommentAPI(newCommentObject)
    }

    /* useEffect(() => {
        getSocialCommentsAPI(id).then((c) => { //get comments that have social_post_id == id
            setComments(c);
        })
    }, []); */


    //will call get all comments api and then filter based on the mapId

    return (
        <div className="social_comments">
            <div className="social_comments_container">
                <div>
                    <h3>Comments</h3>
                    <hr id="socialcommentsline"></hr>
                    {sampleComments.map((comment) => (
                        <div className="social_comment">
                            <div className="social_comment_header">
                                <img className="social_comment_profile_img" src={defaultImg} />
                                <div className="user">{comment.user}</div>
                            </div>

                            {editingCommentId === comment._id ? (
                                <div>
                                    <textarea className="edit_comment_input" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                                    <button className="save_comment_changes" onClick={() => handleEditCommentSave(comment._id)}>
                                        save
                                    </button>
                                    <div className="comment_replies">
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
                                    </div>
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
                                    <p>{comment.comment}</p>
                                    <div className="comment_replies">
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
                                    </div>
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
                            )}

                        </div>
                    ))}
                </div>

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
            </div>
        </div>
    )
}

export default SocialComments;