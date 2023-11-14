import { useState, useEffect } from "react";
import dummyComments from "./sample_data_comments.json";
import "./mapcomments.css";
import defaultImg from "../../assets/img/defaultProfileImg.jpg";


const MapComments = () => {
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
        <div className="comments">
            <div className="comments_container">
                <div>
                    {dummyComments.map((comment) => (
                        <div className="map_comment">
                            <div className="map_comment_header">
                                <img className="map_comment_profile_img" src={defaultImg} />
                                <div className="user">user: {comment.user}</div>
                            </div>
                            <div className="comment_content">comment: {comment.comment}</div>
                        </div>
                    ))}
                </div>

                <div className="map_comments_bottom">
                    <input
                        id="map_comment"
                        type="text"
                        placeholder="Add a comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className="map_comment_button" onClick={handleAddComment}>Post</button>
                </div>
            </div>
        </div>
    )
}

export default MapComments;