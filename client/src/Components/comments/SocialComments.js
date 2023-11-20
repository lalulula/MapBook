import { useState, useEffect } from "react";
import dummyComments from "./sample_data_comments.json";
import "./socialcomments.css";
import defaultImg from "../../assets/img/defaultProfileImg.jpg";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const SocialComments = () => {
    const [user, setUser] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (newComment.trim() !== '') {
            //createSocialCommentAPI() and id is the current comment id
            setComments([...comments, newComment]);
            setNewComment('');
        }
    };

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
                    {dummyComments.map((comment) => (
                        <div className="social_comment">
                            <div className="social_comment_header">
                                <img className="social_comment_profile_img" src={defaultImg} />
                                <div className="user">{comment.user}</div>
                            </div>
                            <div className="social_comment_content"> {comment.comment}</div>
                            <div className="social_comment_bottom">
                                <ChatBubbleOutlineIcon />
                                <p>Reply</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="social_comments_bottom">
                    {/* <input
                        id="social_comment"
                        type="text"
                        placeholder="Add a comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    /> */}
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