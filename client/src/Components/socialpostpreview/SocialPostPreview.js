import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./socialpostpreview.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import { getUserById } from "../../api/user";

const SocialPostPreview = ({ data }) => {
  const navigate = useNavigate();
  const [postOwner, setPostOwner] = useState(null);

  const handleToSocialDetails = (id) => {
    navigate(`/socialpostdetails/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentOwner = await getUserById(data.post_owner);
        setPostOwner(currentOwner);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data.post_owner]);
  return (
    <div
      className="social_post_preview_container"
      onClick={() => handleToSocialDetails(data._id)}
    >
      <div className="social_post_preview_container_left">
        <FavoriteBorderIcon />
        {data.social_users_liked.length}
      </div>
      <div className="social_post_preview_container_middle">
        <div className="owner_name">Posted by {data.post_owner}</div>
        <div className="social_post_title">
          <h3>{data.title}</h3>
        </div>
        <div className="num_comments">
          <CommentIcon />
          &nbsp;&nbsp;{data.social_comments.length} comments
        </div>
      </div>
      <div className="social_post_preview_container_right">
        <img
          className="social_post_preview_img"
          alt=""
          src={data.post_images[0]}
        />
      </div>
    </div>
  );
};

export default SocialPostPreview;
