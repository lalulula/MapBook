import React from "react";
import "./socialpostdetails.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SocialComments from "../comments/SocialComments";
import { useSelector } from "react-redux";
import {
  deleteSocialPostAPIMethod,
  getSocialPostAPIMethod,
  editSocialPostAPIMethod,
} from "../../api/social";
import { getUserById } from "../../api/user";
import LikeButton from "../buttons/LikeButton";
import defaultUserImg from "../../assets/img/user.png";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const SocialPostDetails = () => {
  const { id } = useParams();
  const [currentPost, setCurrentPost] = useState({});
  const user = useSelector((state) => state.user.user);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();
  const [postOwner, setPostOwner] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentPost.post_images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + currentPost.post_images.length) % currentPost.post_images.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentPost = await getSocialPostAPIMethod(id);
        const post_owner_data = await getUserById(currentPost.post_owner);
        setCurrentPost(currentPost);
        setPostOwner(post_owner_data);
        const updatedViewCount = currentPost.view_count + 1;
        const updatedPost = { ...currentPost, view_count: updatedViewCount };

        await editSocialPostAPIMethod(currentPost._id, updatedPost);
        if (currentPost.post_owner === user._id) {
          setIsOwner(true);
        }
      } catch (error) {
        console.error("Error fetching social posts:", error);
      }
    };
    fetchData();
  }, [id, user._id]);

  const handleDeleteSocialPost = async () => {
    try {
      console.log("removing social post");
      const deleteSuccess = await deleteSocialPostAPIMethod(currentPost._id);

      if (deleteSuccess) {
        navigate("/socialpage");
      } else {
        alert("Error deleting post");
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);
    }
  };
  const handleEditSocialPost = async () => {
    navigate(`/editsocialpost/${currentPost._id}`);
  };
  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${day}\n${hours}:${minutes}`;

    return formattedDateTime;
  };
  function renderImages(images) {
    let arr = [];
    for (let i = 0; i < images.length; i++) {
      arr.push(
        <img
          id="post_details_img"
          src={images[i]}
          alt=""
        />
      )
    }
    return arr;
  }

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
              src={
                postOwner != null ? postOwner["profile_img"] : defaultUserImg
              }
            />
            <div className="socialpostdetails_top_left_container">
              <div className="socialpostdetails_top_left_title_container">
                <h1>{currentPost.title}</h1>
                {currentPost.topic === "" ? (
                  <></>
                ) : (
                  <div className="socialpostdetails_topic">
                    {currentPost.topic === "Other"
                      ? `${currentPost.topic} - ${currentPost.customTopic}`
                      : `${currentPost.topic}`}
                  </div>
                )}
              </div>
              <div className="socialpostdetails_user">
                post by{" "}
                {postOwner != null ? postOwner["username"] : "Unknown User"}
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
                  {currentPost.view_count + 1}
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
                {/* <LikeButton id={id} currentPost={currentPost} /> */}
              </>
            )}
            <LikeButton id={id} currentPost={currentPost} />
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
              //renderImages(currentPost.post_images)
              <div className="post_details_img_container">
                {currentPost.post_images.length > 1 && <ArrowBackIosNewIcon onClick={nextImage} className="nextImg" />}
                <img id="post_details_img" src={currentPost.post_images[currentIndex]} />
                {currentPost.post_images.length > 1 && <ArrowForwardIosIcon onClick={prevImage} className="prevImg" />}
              </div>

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
