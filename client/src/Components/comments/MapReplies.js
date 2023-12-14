import React, { useEffect, useState } from "react";
import { createMapPostReplyAPIMethod, deleteMapPostReplyAPIMethod, getAllExistingMapPostRepliesAPIMethod, getAllMapPostRepliesAPIMethod, updateMapPostReplyAPIMethod } from "../../api/map";
import { getAllUsersAPIMethod } from "../../api/user";
import { useSelector } from "react-redux";

const MapReplies = ({ commentId, replyingCommentId, setReplyingCommentId, setEditingCommentId, editingCommentId, editingReplyId, setEditingReplyId }) => {
    const [allExistingReplies, setAllExistingReplies] = useState([]);
    const [allReplies, setAllReplies] = useState([]);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [newReply, setNewReply] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const currentUserId = useSelector((state) => state.user.id);

    const handleClickReplyComment = async () => {
        if (newReply.trim() !== '') {
            const newReplyObject = {
                map_reply_content: newReply,
                map_reply_owner: currentUserId,
                map_comment_id: commentId,
            };
            const result = await createMapPostReplyAPIMethod(newReplyObject);
            newReplyObject["_id"] = result._id;
            setAllReplies([...allReplies, newReplyObject]);
            setNewReply('');
            setReplyingCommentId(null);
        }
    }

    const handleClickDottedMenu = (replyId) => {
        if (dropdownVisible != false) {
            setDropdownVisible(false);
        } else {
            setDropdownVisible(replyId);
        }
    }

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
    }

    const handleEditRepliesave = (replyId) => {
        const newRep = allReplies.find((c) => c._id == replyId);
        newRep["map_reply_content"] = replyText;
        updateMapPostReplyAPIMethod(replyId, newRep);
        const updatedReplies = allReplies.map((c) => (
            c._id == replyId ? newRep : c
        ));
        setAllReplies(updatedReplies);
        setEditingReplyId(null);
        setDropdownVisible(false);
    }

    const handleClickDeleteReply = (replyId) => {
        setDropdownVisible(false);
        if (showDeleteConfirmationModal) {
            setShowDeleteConfirmationModal(false);
            return;
        } else {
            setShowDeleteConfirmationModal(replyId);
        }
    }

    const handleDeleteReply = (replyId) => {
        const filteredReplies = allReplies.filter((c) => c._id !== replyId);
        setAllReplies(filteredReplies);
        deleteMapPostReplyAPIMethod(replyId);
        setDropdownVisible(false);
    }

    useEffect(() => {
        getAllExistingMapPostRepliesAPIMethod().then((r) => {
            setAllExistingReplies(r);
        });
        getAllMapPostRepliesAPIMethod(commentId).then((r) => {
            setAllReplies(r);
        });
        getAllUsersAPIMethod().then((u) => {
            setAllUsers(u);
        })
    }, []);

    return (
        <div className="map_comment_replies_wrapper">
            {allReplies.length > -1 && (
                <div className="map_comment_replies">
                    {allReplies.length > 0 && allReplies.map((reply, i) => (
                        <div className="map_comment_reply" key={i}>
                            {allUsers.find((u) => u._id == reply.map_reply_owner) && (
                                <div>
                                    <div className="map_comment_header">
                                        <img className="map_comment_profile_img" src={(allUsers.length > 0 && allUsers.find((u) => u._id == reply.map_reply_owner)).profile_img} />
                                        <p className="user">{(allUsers.length > 0 && allUsers.find((u) => u._id == reply.map_reply_owner)).username}</p>
                                    </div>
                                    <p className="map_comment_content">
                                        {editingReplyId === reply._id ? (
                                            <div className="map_comment_content_textarea">
                                                <textarea className="map_comment_reply_input" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                                                <button className="mapreplies_save_reply_changes" onClick={() => handleEditRepliesave(reply._id)}>
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
                                                            <button className="delete_comment_confirm" onClick={() => handleDeleteReply(reply._id)}>
                                                                Yes
                                                            </button>
                                                            <button className="mapcomments_cancel_delete_comment" onClick={() => setShowDeleteConfirmationModal(false)}>
                                                                No
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                {reply.map_reply_content}
                                                {reply.map_reply_owner == currentUserId && (
                                                    <div className="social_reply_dotted_menu_container">
                                                        {dropdownVisible && (
                                                            <div className="social_reply_dotted_menu_overlay" onClick={() => setDropdownVisible(false)}></div>
                                                        )}
                                                    <div className="map_reply_dotted_menu" onClick={() => handleClickDottedMenu(reply._id)}>
                                                        ...
                                                    </div>    
                                                    </div>
                                                )}
                                                {dropdownVisible === reply._id && (
                                                    <div className="social_reply_dropdown">
                                                        <div className="edit_reply_btn" onClick={() => handleClickEditReply(reply._id)}>
                                                            Edit
                                                        </div>
                                                        <hr style={{ "width": "100%", margin: "0" }}></hr>

                                                        <div className="delete_reply_btn" onClick={() => handleClickDeleteReply(reply._id)}>
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
                                onChange={(e) => setNewReply(e.target.value)}>
                            </textarea>
                            <button className="post_reply_btn" onClick={handleClickReplyComment}>Post</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default MapReplies;

// import React, { useEffect, useState } from "react";
// import { 
//     createMapPostReplyAPIMethod, 
//     deleteMapPostReplyAPIMethod, 
//     getAllExistingMapPostRepliesAPIMethod, 
//     getAllMapPostRepliesAPIMethod, 
//     updateMapPostReplyAPIMethod 
// } from "../../api/map";
// import { getAllUsersAPIMethod } from "../../api/user";
// import { useSelector } from "react-redux";

// import { Box, Typography } from "@mui/material";
// import FlexBetween from "../FlexBetween";
// import sendMessage from "../../assets/img/sendMessage.png";

// const MapReplies = ({ commentId, replyingCommentId, setReplyingCommentId, tempCommentId, setEditingCommentId }) => {
//     const [allExistingReplies, setAllExistingReplies] = useState([]);
//     const [allReplies, setAllReplies] = useState([]);
//     const [isReplying, setIsReplying] = useState(false);
//     const [replyText, setReplyText] = useState('');
//     const [newReply, setNewReply] = useState('');
//     const [allUsers, setAllUsers] = useState([]);
//     const [dropdownVisible, setDropdownVisible] = useState(false);
//     const [editingReplyId, setEditingReplyId] = useState(null);
//     const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
//     const currentUserId = useSelector((state) => state.user.id);

//     const handleClickReplyComment = async () => {
//         if (newReply.trim() !== '') {
//             const newReplyObject = {
//                 map_reply_content: newReply,
//                 map_reply_owner: currentUserId,
//                 map_comment_id: commentId,
//             };
//             console.log("created a new reply!");
//             const result = await createMapPostReplyAPIMethod(newReplyObject);
//             console.log("result: ", result);
//             newReplyObject["_id"] = result._id;
//             setAllReplies([...allReplies, newReplyObject]);
//             setNewReply('');
//             setReplyingCommentId(null);
//         }
//     }

//     const handleClickDottedMenu = (replyId) => {
//         if (dropdownVisible != false) {
//             setDropdownVisible(false);
//         } else {
//             setDropdownVisible(replyId);
//         }
//     }

//     const handleClickEditReply = (replyId) => {
//         if (editingReplyId == replyId) {
//             setEditingReplyId(null);
//         } else {
//             setEditingReplyId(replyId);
//         }
//         setDropdownVisible(false);
//         const replyToEdit = allReplies.find((r) => r._id == replyId);
//         setReplyText(replyToEdit.map_reply_content);
//     }

//     const handleEditReplySave = (replyId) => {
//         const newRep = allReplies.find((c) => c._id == replyId);
//         newRep["map_reply_content"] = replyText;
//         updateMapPostReplyAPIMethod(replyId, newRep);
//         const updatedReplies = allReplies.map((c) => (
//             c._id == replyId ? newRep : c
//         ));
//         setAllReplies(updatedReplies);
//         setEditingReplyId(null);
//         setDropdownVisible(false);
//     }

//     const handleClickDeleteReply = (replyId) => {
//         setDropdownVisible(false);
//         if (showDeleteConfirmationModal) {
//             setShowDeleteConfirmationModal(false);
//             return;
//         } else {
//             setShowDeleteConfirmationModal(replyId);
//         }
//     }

//     const handleDeleteReply = (replyId) => {
//         const filteredReplies = allReplies.filter((c) => c._id !== replyId);
//         setAllReplies(filteredReplies);
//         deleteMapPostReplyAPIMethod(replyId);
//         setDropdownVisible(false);
//     }

//     useEffect(() => {
//         getAllExistingMapPostRepliesAPIMethod().then((r) => {
//             setAllExistingReplies(r);
//         });
//         getAllMapPostRepliesAPIMethod(commentId).then((r) => {
//             setAllReplies(r);
//         });
//         getAllUsersAPIMethod().then((u) => {
//             setAllUsers(u);
//         })
//     }, []);

//     return (
//         <div className="social_comment_replies_wrapper">
//             {allReplies.length > -1 && (
//                 <div className="social_comment_replies">
//                     {allReplies.length > 0 && allReplies.map((reply, i) => (
//                         <Box mb="10px" ml="40px">
//                             <FlexBetween key={i} mb="15px">
//                                 <Box width="10%" alignSelf="start" mt="7px">
//                                     <img style={{width: "35px", height: "35px", borderRadius: "50%"}} src={
//                                         (allUsers.length > 0 && allUsers.find((u) => u._id == reply.map_reply_owner)).profile_img
//                                         }/>
//                                 </Box>
//                                 <Box width="80%">
//                                     <Box 
//                                         borderRadius="0 15px 15px 15px"
//                                         p="10px"
//                                         mb="5px"
//                                         backgroundColor="#323643"
//                                     >

//                                         <FlexBetween mb="10px">
//                                             <Box>
//                                                 <Typography fontSize="18px" fontWeight="bold" color="whitesmoke">
//                                                     {(allUsers.length > 0 && allUsers.find((u) => u._id == reply.map_reply_owner)).username}
//                                                 </Typography>
//                                             </Box>
//                                             <Box>
//                                                 {reply.map_reply_owner === currentUserId && editingReplyId == null && !showDeleteConfirmationModal && (
//                                                     <div className="map_reply_dotted_menu" onClick={() => handleClickDottedMenu(reply._id)}>
//                                                         ...
//                                                     </div>
//                                                 )}
//                                                 {dropdownVisible === reply._id && (
//                                                     <div className="map_reply_dropdown">
//                                                         <div className="edit_reply_btn" onClick={() => handleClickEditReply(reply._id)}>
//                                                             Edit
//                                                         </div>
//                                                         <hr style={{ "width": "100%" }}></hr>
//                                                         <div className="delete_reply_btn" onClick={() => handleClickDeleteReply(reply._id)}>
//                                                             Delete
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </Box>


//                                         </FlexBetween>


//                                         {editingReplyId === reply._id ? (
//                                         <FlexBetween>
//                                             <input
//                                             style={{
//                                                 backgroundColor: "#2A282E",
//                                                 outline: "0",
//                                                 boxShadow: "none",
//                                                 padding: "10px",
//                                                 color: "#b8c5c9",
//                                                 border: "none",
//                                                 borderRadius: "10px",
//                                                 width: "85%"
//                                             }}
//                                             type="text"
//                                             placeholder={reply.map_reply_content}
//                                             onChange={(e) => setReplyText(e.target.value)}
//                                             />
//                                             <Box 
//                                             onClick={() => handleEditReplySave(reply._id)}
//                                             >
//                                             <img className="btnimg" src={sendMessage} />
//                                             </Box>
//                                         </FlexBetween>
//                                     ) : (

//                                         <Typography fontSize="16px" color="whitesmoke">
//                                             {reply.map_reply_content}
//                                         </Typography>
//                                     )}
//                                     </Box>
//                                 </Box>
                                
//                                 <FlexBetween ml="10px" width="35%"></FlexBetween>
//                             </FlexBetween>

//                             {showDeleteConfirmationModal == reply._id && (
//                                 <div className="delete_confirmation_modal">
//                                     <div className="delete_confirmation_modal_top">
//                                         Are you sure you want to delete this Reply?
//                                     </div>
//                                     <div className="delete_confirmation_modal_bottom">
//                                         <button className="delete_comment_confirm" onClick={() => handleDeleteReply(reply._id)}>
//                                             Yes
//                                         </button>
//                                         <button className="cancel_delete_comment" onClick={() => setShowDeleteConfirmationModal(false)}>
//                                             No
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}
                                

//                         </Box>
//                     ))}
                    
//                 </div>
//             )}

//             <Box mb="10px" ml="40px">
//                 <FlexBetween mb="15px">
//                     <Box width="13%" alignSelf="start" mt="7px">
//                     </Box>
                                
//                     <Box width="80%">
//                         {replyingCommentId == commentId && (
//                             <div className="comment_box" style={{padding: "0", borderTop: "0", marginTop: "10px"}}>
                
//                                 <div className="comment_box_input">
//                                 <input
//                                     className="input_comment"
//                                     type="text"
//                                     placeholder="Add a reply..."
//                                     onChange={(e) => setNewReply(e.target.value)}
//                                 />
//                                 <div class="wrapper" onClick={handleClickReplyComment}>
//                                     <img className="btnimg" src={sendMessage} />
//                                 </div>
//                                 </div>
//                             </div>
                            
//                         )}
//                     </Box>
//                     <FlexBetween ml="10px" width="22%">
//                         <Typography 
//                         fontSize="12px"
//                         fontWeight="bold"
//                         color="#dadada"
//                         >
//                         </Typography>
//                     </FlexBetween>
//                 </FlexBetween>
//                 {/* <FlexBetween ml="10px" width="10%">
//                     <Typography 
//                     fontSize="12px"
//                     fontWeight="bold"
//                     color="#dadada"
//                     >
//                     </Typography>
//                 </FlexBetween> */}
//             </Box>
//         </div>
//     )
// }

// export default MapReplies;