import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSocialPostAPIMethod,
  editSocialPostAPIMethod,
} from "../../api/social";
import Dropdown from "react-dropdown";

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
      navigate(`/socialpage`);
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

  return (
    <div className="create_social_post_page">
      <div className="create_social_post_container">
        <div className="create_social_post_header">
          <h2>Create Social Post</h2>
        </div>
        <div className="create_social_post_container_inner">
          <div>
            <h3>Title</h3>
            <input
              type="text"
              name="title"
              value={editedPost.title || ""}
              onChange={handleChange}
            />
          </div>
          <br />
          <h3>Description</h3>
          <div className="social_post_description">
            <textarea
              placeholder="Enter discussion here"
              value={editedPost.post_content || ""}
              onChange={handleChange}
              name="post_content"
            />
          </div>
          <br />
          {/* <div className="social_post_img">
            <label htmlFor="imageUpload" className="upload-label">
              Choose an Image
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*" 
              onChange={handleImageUpload}
              className="upload-input"
            /> */}
          {editedPost.post_images.map((img, index) => (
            <img
              key={index}
              src={img.data}
              alt={`Uploaded ${index}`}
              className="uploaded-image"
              style={{ width: "100px", height: "100px" }}
            />
          ))}
        </div>
        <br></br>
        <div className="social_post_bottom">
          <Dropdown
            options={topics}
            value={editedPost.topic}
            placeholder="Select Topic"
            className="create_map_dropdown"
            onChange={handleTopicClick}
          />
          {editedPost.topic === "Other" && (
            <input
              value={editedPost.customTopic || ""}
              placeholder="Enter a custom Topic"
              onChange={handleChange}
              name="customTopic"
            />
          )}
          <button
            type="button"
            onClick={handleEditSocialPost}
            className="social_post_button"
          >
            Edit Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSocialPost;
