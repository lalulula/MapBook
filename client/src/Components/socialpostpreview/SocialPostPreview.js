import React from "react";
import dumImg from "../../assets/img/dum.jpg";
import { useNavigate } from "react-router-dom";
import "./socialpostpreview.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";

const SocialPostPreview = ({ data }) => {
  const navigate = useNavigate();

  const handleToSocialDetails = (id) => {
    navigate(`/socialpostdetails/${id}`);
  };

  return (
    <div
      className="social_post_preview_container"
      onClick={() => handleToSocialDetails(data._id)}
    >
      <div className="social_post_preview_container_left">
        <FavoriteBorderIcon />
        {data.social_users_liked}
      </div>
      <div className="social_post_preview_container_middle">
        <div className="owner_name">Posted by {data.user}</div>
        <div className="social_post_title">
          <h3>{data.title}</h3>
        </div>
        <div className="num_comments">
          <CommentIcon />
          View all {data.social_post_comment_count} replies
        </div>
      </div>
      <div className="social_post_preview_container_right">
        <img className="social_post_preview_img" src={data.post_images[0]} />
      </div>
    </div>
  );
};

export default SocialPostPreview;
