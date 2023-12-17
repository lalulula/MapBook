import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getSocialPostAPIMethod,
  likeSocialPostAPIMethod,
} from "../../api/social";
import { likeMapAPIMethod, getMapAPI } from "../../api/map";
import "./buttons.css";

function LikeButton({ id, currentPost, isAuth, postType }) {
  const currentUserId = useSelector((state) => state.user.id);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Check if currentPost and social_users_liked are defined
    if (postType === "Social") {
      if (currentPost && currentPost.social_users_liked) {
        setLikes(currentPost.social_users_liked.length);
        setLiked(currentPost.social_users_liked.includes(currentUserId));
      }
    } else if (postType === "Map") {
      if (currentPost && currentPost.current.map_users_liked) {
        setLikes(currentPost.current.map_users_liked.length);
        setLiked(currentPost.current.map_users_liked.includes(currentUserId));
      }
    }
  }, [currentPost, currentUserId]);

  useEffect(() => {
    if (postType === "Social") {
      getSocialPostAPIMethod(id).then((post) => {
        setLikes(post.social_users_liked.length);
      });
    } else if (postType === "Map") {
      getMapAPI(id).then((post) => {
        setLikes(post.map_users_liked.length);
      });
    }
  }, []);

  const handleLikeClick = () => {
    const userIdJson = { userId: currentUserId };

    setLiked((prevLiked) => !prevLiked);
    setLikes((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));

    if (postType === "Social") {
      likeSocialPostAPIMethod(id, userIdJson).then(() =>
        console.log("liked in social post details!")
      );
    } else if (postType === "Map") {
      likeMapAPIMethod(id, isAuth, userIdJson).then(() =>
        console.log("liked in map details!")
      );
    }
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
