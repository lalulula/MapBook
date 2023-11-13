import { useState, useEffect } from "react";
import dummyComments from "./sample_data_comments.json";
import "./mapcomments.css";

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
                        <div className="comment">
                            <div className="user">user: {comment.user}</div>
                            <div className="comment_content">comment: {comment.comment}</div>
                        </div>
                    ))}
                </div>

                <div>
                    <input
                        id="map_comment"
                        type="text"
                        placeholder="Add a comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment}>Add</button>
                </div>
            </div>
        </div>
    )
}

export default MapComments;