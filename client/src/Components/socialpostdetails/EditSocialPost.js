import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSocialPostAPIMethod,
  editSocialPostAPIMethod,
} from "../../api/social";
import Dropdown from "react-dropdown";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";

const EditSocialPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editedPost, setEditedPost] = useState({
    title: "",
    post_content: "",
    topic: "",
    customTopic: "",
    post_images: [],
  });
  const [showModal, setShowModal] = useState(false);
  const topics = [
    "Economy",
    "Education",
    "Environmental",
    "Geography",
    "Health",
    "History",
    "Social",
    "Other",
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentPost = await getSocialPostAPIMethod(id);
        setEditedPost(currentPost);
      } catch (error) {
        console.error("Error fetching social post:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleEditSocialPost = async () => {
    try {
      await editSocialPostAPIMethod(id, editedPost);
      alert("Edit Post Successfully");
      handleBackToPost();
    } catch (error) {
      alert("Error updating social post:", error);
    }
  };
  const handleTopicClick = (topic) => {
    const newVal = topic.value;
    setEditedPost({ ...editedPost, topic: newVal });
  };

  const handleChange = (e) => {
    setEditedPost({ ...editedPost, [e.target.name]: e.target.value });
  };
  const handleRemoveImage = (index) => {
    let uploadedImages = editedPost.post_images;
    let newUploadedImages = [
      ...uploadedImages.slice(0, index),
      ...uploadedImages.slice(index + 1),
    ];
    setEditedPost(newUploadedImages);
  };
  const handleClickCancel = () => {
    setShowModal(true);
  };
  const handleBackToPost = () => {
    navigate(-1);
  };

  return (
    <div className="editsocialpost_page">
      {showModal && (
        <div className="editsocialpost_modal_cancel">
          <div className="editsocialpost_modal_content">
            <h3>Are You Sure You Want To Cancel?</h3>
            <h6>(Your draft will not be saved)</h6>
          </div>

          <div className="editsocialpost_modal_container">
            <button onClick={handleBackToPost}>Yes</button>
            <button
              className="editsocialpost_goback"
              onClick={() => setShowModal(false)}
            >
              Go back
            </button>
          </div>
        </div>
      )}
      <div className="editsocialpost_container">
        <div className="editsocialpost_header">
          <h2>Edit Post</h2>
        </div>
        <div className="editsocialpost_container_inner">
          <div>
            <h3 className="editsocialpost_title">Title</h3>
            <div className="editsocialpost_top">
              <input
                type="text"
                name="title"
                value={editedPost.title || ""}
                onChange={handleChange}
                className="editsocialpost_other_topic_input"
              />
              {editedPost.topic === "Other" && (
                <input
                  value={editedPost.customTopic}
                  placeholder="Enter a custom Topic"
                  onChange={handleTopicClick}
                  className="editsocialpost_other_topic_input"
                  name="customTopic"
                />
              )}
              <Dropdown
                options={topics}
                value={editedPost.topic}
                placeholder="Select Topic"
                className="create_map_dropdown"
                onChange={handleTopicClick}
              />
            </div>
          </div>

          <h3>Description</h3>
          <div className="social_post_description">
            <textarea
              placeholder="Enter discussion here"
              value={editedPost.post_content || ""}
              onChange={handleChange}
              name="post_content"
              className="editsocialpost_description_textarea"
            />
          </div>

          {editedPost.post_images.map((img, index) => (
            // <div className="editsocialpost_image_container">
            //   <CancelTwoToneIcon
            //     className="remove_uploaded_image"
            //     onClick={() => handleRemoveImage(index)}
            //   />
            //   <img
            //     key={index}
            //     src={img.data}
            //     alt={`Uploaded${editedPost.post_images.length}`}
            //     className="uploaded_image"
            //     style={{ width: "100px", height: "100px" }}
            //   />
            // </div>
            <img
              key={index}
              src={img.data}
              alt={`Uploaded ${editedPost.post_images.length}`}
              className="uploaded-image"
              style={{ width: "100px", height: "100px" }}
            />
          ))}
        </div>
        <br />
        <hr className="editsocialpost_hr"></hr>
        <div className="editsocialpost_bottom">
          <button onClick={handleClickCancel} className="editsocialpost_cancel">
            Cancel
          </button>
          <button
            onClick={handleEditSocialPost}
            className="editsocialpost_submit"
          >
            Edit Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSocialPost;
