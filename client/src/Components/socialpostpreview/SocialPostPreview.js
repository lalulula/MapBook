import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./socialpostpreview.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import { getUserById } from "../../api/user";
import { likeSocialPostAPIMethod } from "../../api/social";
import { useSelector } from "react-redux";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  deleteSocialPostAPIMethod,
} from "../../api/social";

const SocialPostPreview = ({ data, socialPosts, setSocialPosts, showDeleteConfirmationModal, setShowDeleteConfirmationModal, handleDeleteSocialPost }) => {
  const navigate = useNavigate();
  const [postOwner, setPostOwner] = useState(null);
  const currentUserId = useSelector((state) => state.user.id);
  const [liked, setLiked] = useState(
    data.social_users_liked.includes(currentUserId)
  );
  var [numLikes, setNumLikes] = useState(data.social_users_liked.length);
  const user = useSelector((state) => state.user);


  const handleToSocialDetails = (id) => {
    navigate(`/socialpostdetails/${id}`);
  };

  const handleLikeSocialPost = (postId) => {
    if (!liked) {
      setNumLikes(numLikes + 1);
    } else if (liked) {
      setNumLikes(numLikes - 1);
    }
    setLiked(!liked);
    const userIdJson = { userId: currentUserId };
    likeSocialPostAPIMethod(postId, userIdJson).then(
      console.log("post liked!")
    );
  };

  const handleClickDeleteSocialPost = (id) => {
    if (showDeleteConfirmationModal) {
      setShowDeleteConfirmationModal(false);
      return;
    } else {
      setShowDeleteConfirmationModal(id);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentOwner = await getUserById(data.post_owner);
        setPostOwner(currentOwner);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [data.post_owner]);

  return (
    <div className="social_post_preview_container">
      <div className="social_post_preview_container_left">
        {liked ? (
          <FavoriteIcon
            onClick={() => handleLikeSocialPost(data._id)}
            style={{ color: "red" }}
          />
        ) : (
          <FavoriteBorderIcon onClick={() => handleLikeSocialPost(data._id)} />
        )}
        {numLikes}
      </div>
      <div
        className="social_post_preview_container_middle"
        onClick={() => handleToSocialDetails(data._id)}
      >
        <div className="owner_name">
          Posted by {postOwner != null ? postOwner["username"] : "Unknown User"}
        </div>
        {/* {console.log(postOwner['username'])} */}
        <div className="social_post_title">
          <h3>{data.title}</h3>
        </div>
        <div className="num_comments">
          <CommentIcon />
          &nbsp;&nbsp;{data.social_comments.length} comments
        </div>
      </div>
      <div className="social_post_preview_container_right">
        {data.post_images.length > 0 && (
          <img
            className="social_post_preview_img"
            alt=""
            src={data.post_images[0]}
          />
        )}
      </div>
      {user.user.is_admin && (
        <div className="socialpostpreview_admin_delete">
          <div className="socialpostpreview_admin_delete_inner">
            {showDeleteConfirmationModal && (
              <div className="socialpostpreview_overlay"></div>
            )}
            <DeleteIcon
              onClick={() => handleClickDeleteSocialPost(data._id)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPostPreview;
