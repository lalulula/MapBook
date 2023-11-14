import { useState, useEffect } from "react";
import dummyComments from "./sample_data_comments.json";
import "./socialcomments.css";
import defaultImg from "../../assets/img/defaultProfileImg.jpg";

const SocialComments = () => {
    const [user, setUser] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (newComment.trim() !== '') {
            setComments([...comments, newComment]);
            setNewComment('');
        }
    };

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
                                <div className="user">user: {comment.user}</div>
                            </div>
                            <div className="social_comment_content">comment: {comment.comment}</div>
                        </div>
                    ))}
                </div>

                <div className="social_comment_bottom">
                    <input
                        id="social_comment"
                        type="text"
                        placeholder="Add a comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className="social_comment_button" onClick={handleAddComment}>Post</button>
                </div>
            </div>
        </div>
    )
}

export default SocialComments;