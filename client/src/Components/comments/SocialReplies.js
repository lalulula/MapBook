import React, { useEffect, useState } from "react";
import { createSocialReplyAPIMethod, getAllExistingSocialCommentsAPI, getAllExistingSocialRepliesAPI, getAllSocialRepliesAPI, updateSocialReplyAPIMethod } from "../../api/comment";
import { getAllUsersAPIMethod } from "../../api/user";
import { useSelector } from "react-redux";

const SocialReplies = ({ commentId, replyingCommentId, setReplyingCommentId }) => {
    console.log("commentId in socialreplies: ", commentId);

    const [allExistingReplies, setAllExistingReplies] = useState([]);
    const [allReplies, setAllReplies] = useState([]);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [newReply, setNewReply] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [editingReplyId, setEditingReplyId] = useState(null);
    const currentUserId = useSelector((state) => state.user.id);

    const handleClickReplyComment = async () => {
        if (newReply.trim() !== '') {
            const newReplyObject = {
                social_reply_content: newReply,
                social_reply_owner: currentUserId,
                social_comment_id: commentId,
            };
            console.log("created a new reply!");
            const result = await createSocialReplyAPIMethod(newReplyObject);
            console.log("result: ", result);
            newReplyObject["_id"] = result._id;
            setAllReplies([...allReplies, newReplyObject]);
            setNewReply('');
            setReplyingCommentId(null);
        }
        //createCommentAPI(newCommentObject)
    }

    const handleClickDottedMenu = (replyId) => {
        if (dropdownVisible != false) {
            setDropdownVisible(false);
        } else {
            setDropdownVisible(replyId);
        }
    }

    const handleClickEditReply = (replyId) => {
        if (editingReplyId != null) {
            setEditingReplyId(null);
        } else {
            setEditingReplyId(replyId);
        }
        setDropdownVisible(null);
        const replyToEdit = allReplies.find((r) => r._id == replyId);
        setReplyText(replyToEdit.social_reply_content);
    }

    const handleEditReplySave = (replyId) => {
        const newRep = allReplies.find((c) => c._id == replyId);
        newRep["social_reply_content"] = replyText;
        updateSocialReplyAPIMethod(replyId, newRep);
        const updatedReplies = allReplies.map((c) => (
            c._id == replyId ? newRep : c
        ));
        setAllReplies(updatedReplies);
        setEditingReplyId(null);
    }

    useEffect(() => {
        getAllExistingSocialRepliesAPI().then((r) => {
            setAllExistingReplies(r);
        });
        getAllSocialRepliesAPI(commentId).then((r) => {
            setAllReplies(r);
        });
        getAllUsersAPIMethod().then((u) => {
            setAllUsers(u);
        })
    }, []);

    return (
        <div className="social_comment_replies">
            {allReplies.length > 0 && allReplies.map((reply, i) => (
                <div className="social_comment_reply" key={i}>
                    <div className="social_comment_header">
                        <img className="social_comment_profile_img" src={(allUsers.length > 0 && allUsers.find((u) => u._id == reply.social_reply_owner)).profile_img} />
                        <p className="user">{(allUsers.length > 0 && allUsers.find((u) => u._id == reply.social_reply_owner)).username}</p>
                    </div>
                    <p className="social_comment_content">
                        {editingReplyId === reply._id ? (
                            <div className="">
                                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                                <button className="save_reply_changes" onClick={() => handleEditReplySave(reply._id)}>
                                    save
                                </button>
                            </div>
                        ) : (
                            <div>
                                {reply.social_reply_content}
                                <div className="social_reply_dotted_menu" onClick={() => handleClickDottedMenu(reply._id)}>
                                    ...
                                </div>
                                {dropdownVisible == reply._id && (
                                    <div className="social_reply_dropdown">
                                        <div className="edit_reply_button" onClick={() => handleClickEditReply(reply._id)}>
                                            Edit
                                        </div>
                                        <hr style={{ "width": "100%" }}></hr>
                                        <div className="delete_reply_button">
                                            Delete
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </p>
                </div>
            ))}
            {replyingCommentId == commentId && (
                <div className="reply_text_field">
                    <textarea
                        id="social_comment_reply_input"
                        type="text"
                        placeholder="Write your reply"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}>
                    </textarea>
                    <button onClick={handleClickReplyComment}>Post</button>
                </div>
            )}
        </div>
    )
}

export default SocialReplies;