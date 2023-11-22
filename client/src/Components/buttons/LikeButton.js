import { unstable_ClassNameGenerator } from "@mui/material";
import { getSocialPostAPIMethod, likeSocialPostAPIMethod } from "../../api/social";
import "./likebutton.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function LikeButton({ id, currentPost }) {
  const currentUserId = useSelector((state) => state.user.id);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(currentPost.social_users_liked.includes(currentUserId));


  const handleLikeClick = () => {
    const userIdJson = { userId: currentUserId }

    setLiked((prevLiked) => !prevLiked);
    setLikes((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));
    likeSocialPostAPIMethod(id, userIdJson).then(
      console.log("liked in social post details!")
    );
  };

  useEffect(() => {
    getSocialPostAPIMethod(id).then((post) => {
      setLikes(post.social_users_liked.length);
    })
  }, []);

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
