import { useState, useEffect } from "react";
import dummyComments from "./dummy_comments.json";
import "./comments.css";

const Comments = () => {
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
                {console.log(dummyComments)}
                {dummyComments.map((comment) => (
                    <div className="comment">
                        <div className="user">user: {comment.user}</div>
                        <div className="comment_content">comment: {comment.comment}</div>
                    </div>
                ))}
                <div>
                    <input
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

export default Comments;