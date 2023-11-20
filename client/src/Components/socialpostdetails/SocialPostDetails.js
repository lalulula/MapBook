import React from "react";
import "./socialpostdetails.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SocialComments from "../comments/SocialComments";
import { useSelector } from "react-redux";
import {
  deleteSocialPostAPIMethod,
  getSocialPostAPIMethod,
} from "../../api/social";
import LikeButton from "../buttons/LikeButton";

const SocialPostDetails = () => {
  const { id } = useParams();
  const [currentPost, setCurrentPost] = useState({});
  const user = useSelector((state) => state.user.user);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentPost = await getSocialPostAPIMethod(id);
        setCurrentPost(currentPost);
        if (currentPost.post_owner === user._id) {
          setIsOwner(true);
        }
        console.log(currentPost.post_images.length);
      } catch (error) {
        console.error("Error fetching social posts:", error); //TODO: Add error handling when error happens fetching.(Render screen)
      }
    };
    fetchData();
  }, [isOwner]);
  const handleDeleteSocialPost = async () => {
    try {
      console.log("removing social post");
      const deleteSuccess = await deleteSocialPostAPIMethod(currentPost._id);

      if (deleteSuccess) {
        navigate("/socialpage");
      } else {
        // The delete operation failed
        console.log("Delete operation failed");
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);
    }
  };
  const handleEditSocialPost = async () => {
    console.log("Editing Social Posdt Data");
    navigate(`/editsocialpost/${currentPost._id}`);
  };
  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${day}\n${hours}:${minutes}`;

    return formattedDateTime;
  };

  return (
    <div className="socialpostdetails">
      <div className="socialpostdetails_container">
        <span
          className="back_btn_socialdetail"
          onClick={() => navigate("/socialpage")}
        >
          <i className="bi bi-arrow-left" />
          &nbsp;&nbsp;Return to Social
        </span>
        <div className="socialpostdetails_top">
          <div className="socialpostdetails_top_left">
            <img
              alt=""
              className="socialpostdetails_profile_img"
              src="https://us-tuna-sounds-images.voicemod.net/d347dbc8-e6b8-4f85-bb64-8dcb234f5730-1674067639225.jpg"
            />
            <div className="socialpostdetails_top_left_container">
              <div className="socialpostdetails_top_left_title_container">
                <h1>{currentPost.title}</h1>
                <div className="socialpostdetails_topic">
                  {currentPost.topic === "Other"
                    ? `${currentPost.topic} - ${currentPost.customTopic}`
                    : `${currentPost.topic}`}
                </div>
              </div>
              <div className="socialpostdetails_user">
                post by {user.username}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <h6>{formatDate(currentPost.created_at)}</h6>
                <div>
                  <i className="bi bi-eye" /> &nbsp;
                  {currentPost.view_count}
                </div>
              </div>
            </div>
          </div>

          <div className="socialpostdetails_top_right_container">
            {isOwner && (
              <>
                <button
                  className="social_edit_btn"
                  onClick={() => handleEditSocialPost()}
                >
                  edit
                </button>
                <button
                  className="social_edit_btn"
                  onClick={() => handleDeleteSocialPost()}
                >
                  delete
                </button>
                <LikeButton />
              </>
            )}
          </div>
        </div>
        <div className="socialpostdetails_middle">
          <div
            className={
              currentPost.post_images && currentPost.post_images.length === 0
                ? ""
                : "socialpostdetails_middle_left"
            }
          >
            {currentPost.post_images && currentPost.post_images.length > 0 ? (
              <img
                id="post_details_img"
                src={currentPost.post_images[0]}
                alt=""
              />
            ) : (
              <div></div>
            )}
          </div>

          <div className="socialpostdetails_middle_right">
            {currentPost.post_content}
          </div>
        </div>

        <div className="socialpostdetails_bottom">
          {/* NOTE) loop through currentPost.social_comments (will contain ID) */}
          <SocialComments id={id} />
        </div>
      </div>
    </div>
  );
};

export default SocialPostDetails;
