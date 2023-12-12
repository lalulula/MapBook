import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getSocialPostAPIMethod,
  likeSocialPostAPIMethod,
} from "../../api/social";
import "./buttons.css";

function LikeButton({ id, currentPost, isAuth }) {
  const currentUserId = useSelector((state) => state.user.id);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Check if currentPost and social_users_liked are defined
    if (currentPost && currentPost.social_users_liked) {
      setLikes(currentPost.social_users_liked.length);
      setLiked(currentPost.social_users_liked.includes(currentUserId));
    }
  }, [currentPost, currentUserId]);

  useEffect(() => {
    getSocialPostAPIMethod(id).then((post) => {
      setLikes(post.social_users_liked.length);
    });
  }, []);

  const handleLikeClick = () => {
    const userIdJson = { userId: currentUserId };

    setLiked((prevLiked) => !prevLiked);
    setLikes((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));
    likeSocialPostAPIMethod(id, userIdJson).then(() =>
      console.log("liked in social post details!")
    );
  };

  return (
    <div>
      <button
        className={`like-button ${liked ? "liked" : ""}`}
        onClick={handleLikeClick}
        disabled={!isAuth}
      >
        {likes} Likes
      </button>
    </div>
  );
}

export default LikeButton;
