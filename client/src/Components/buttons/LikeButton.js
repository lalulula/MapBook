import "./likebutton.css";
import React, { useState } from "react";

function LikeButton() {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    setLiked((prevLiked) => !prevLiked);
    setLikes((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));
  };

  return (
    <div>
      <button
        className={`like-button ${liked ? "liked" : ""}`}
        onClick={handleLikeClick}
      >
        {likes} Likes
      </button>
    </div>
  );
}

export default LikeButton;