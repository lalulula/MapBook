import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSocialPostAPIMethod,
  editSocialPostAPIMethod,
} from "../../api/social";
import Dropdown from "react-dropdown";
import { easeInOut, motion } from "framer-motion"
import ImageIcon from "@mui/icons-material/Image";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";

const EditSocialPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedFileObj, setUploadedFileObj] = useState([]);
  const [editedPost, setEditedPost] = useState({
    title: "",
    post_content: "",
    topic: "",
    customTopic: "",
    post_owner: "",
    view_count: 1,
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
    console.log("USEEFFECT CALLED");
    const fetchData = async () => {
      try {
        const currentPost = await getSocialPostAPIMethod(id);
        setEditedPost(currentPost);
        // setUploadedImages(currentPost.post_images);
      } catch (error) {
        console.error("Error fetching social post:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleEditSocialPost = async () => {
    if (editedPost.title.trim().length == 0 || editedPost.post_content.trim().length == 0) {
      setShowErrorMessage(true);
      return;
    }
    console.log("EDITED POST: ", editedPost);
    try {
      await editSocialPostAPIMethod(id, editedPost);
      setShowSuccess(true);

      setTimeout(() => {
        handleBackToPost();
      }, 1500); // Adjust the delay as needed
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
    let uploaded = editedPost.post_images;
    let newUploadedImages = [
      ...uploaded.slice(0, index),
      ...uploaded.slice(index + 1),
    ];
    const newEditedPost = { ...editedPost, post_images: newUploadedImages }
    setEditedPost(newEditedPost);
  };
  const handleClickCancel = () => {
    setShowModal(true);
  };
  const handleBackToPost = () => {
    navigate(-1);
  };

  const handleImageUpload = (event) => {
    const files = event.target.files; // Get the first file from the selected files
    if (files.length >= 0) {
      const newImages = Array.from(files).map((file) => ({
        data: URL.createObjectURL(file),
        file,
      }));
      setEditedPost({
        ...editedPost,
        post_images: [...editedPost.post_images, newImages[0].data],
      });
    }
  };

  return (
    <div className="editsocialpost_page">
      {console.log("SDFDSKFJ:", editedPost.post_images)}
      <motion.div
        initial={{ x: '200%' }}
        animate={{ x: !showErrorMessage ? '200%' : 0 }}
        transition={{ type: 'tween', duration: 0.5, ease: easeInOut }}
        exit={{ x: '-100%' }}
        style={{
          position: 'fixed',
          padding: '20px',
          zIndex: '100',
          top: '140px'
        }}
        className="createsocialpost_error_message">
        Please fill everything out!
        <div
          className="createsocialpost_error_message_close" onClick={() => setShowErrorMessage(false)}>
          X
        </div>
      </motion.div>
      <motion.div
        initial={{ x: '200%' }}
        animate={{ x: !showSuccess ? '200%' : 0 }}
        transition={{ type: 'tween', duration: 0.5, ease: easeInOut }}
        exit={{ x: '-100%' }}
        style={{
          position: 'fixed',
          padding: '20px',
          zIndex: '100',
          top: '140px'
        }}
        className="editsocialpost_error_message">
        Success!
        <div
          className="editsocialpost_error_message_close" onClick={() => setShowErrorMessage(false)}>
          X
        </div>
      </motion.div>
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
          <div className="editsocialpost_img_container">
            <label htmlFor="imageUpload" className="upload_label">
              <ImageIcon />
              Upload Image
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*" // Only image files are allowed
              onChange={handleImageUpload}
              className="upload-input"
            />
            <div className="editsocialpost_images">
              {editedPost.post_images.map((img, index) => (
                <div className="createsocialpost_image_container">
                  <CancelTwoToneIcon
                    className="remove_uploaded_image"
                    onClick={() => handleRemoveImage(index)}
                  />
                  {/* {typeof img === 'object' ? (
                    <img
                      key={index}
                      src={img.data}
                      alt={`nothing`}
                      className="uploaded_image"
                      style={{ width: "100px", height: "100px" }}
                    />
                  ) : (
                    <img
                      key={index}
                      src={img}
                      alt={`nothing`}
                      className="uploaded_image"
                      style={{ width: "100px", height: "100px" }}
                    />
                  )} */}
                  {typeof img === "string" && (
                    <img
                      key={index}
                      src={img}
                      alt={`nothing`}
                      className="uploaded_image"
                      style={{ width: "100px", height: "100px" }}
                    />
                  )}

                </div>
              ))}
            </div>

          </div>
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
