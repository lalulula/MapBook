import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createsocialpost.css";
import Dropdown from "react-dropdown";
import { createSocialPostAPIMethod } from "../../api/social";
import { useSelector } from "react-redux";
import ImageIcon from '@mui/icons-material/Image';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';

const CreateSocialPost = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.id);
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

  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedFileObj, setUploadedFileObj] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // const uploadedFileObj = [];

  const [options, setOptions] = useState({
    title: "",
    post_content: "",
    topic: "",
    customTopic: "",
    // post_images: "",
    post_owner: "",
    view_count: 1,
  });
  const handleTitleChange = (title) => {
    setOptions({ ...options, title });
  };
  const handlePostContentChange = (post_content) => {
    setOptions({ ...options, post_content });
  };
  const handleTopicClick = (topic) => {
    const newVal = topic.value;
    setOptions({ ...options, topic: newVal });
  };
  const handleCustomTopic = (customTopic) => {
    setOptions({ ...options, customTopic });
  };

  const handleImageUpload = (event) => {

    let tempFileArray = uploadedFileObj;
    tempFileArray.push(event.target.files[0])
    setUploadedFileObj(tempFileArray);

    setOptions({
      ...options,
      post_images: uploadedFileObj,
    });

    const files = event.target.files; // Get the first file from the selected files
    if (files.length > 0) {
      const newImages = Array.from(files).map((file) => ({
        data: URL.createObjectURL(file),
        file,
      }));

      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const handleRemoveImage = (index) => {
    let newUploadedImages = [...uploadedImages.slice(0, index), ...uploadedImages.slice(index + 1)];
    setUploadedImages(newUploadedImages);
  }

  const handleSocialPostCreate = async () => {
    const newPost = { ...options, post_owner: userId };
    // console.log(newPost)
    const res = await createSocialPostAPIMethod(newPost);
    if (res.ok) {
      // const responseMsg = await res.json;
      navigate("/socialpage");
    } else {
      alert(`Error: ${res.status} - ${res.statusText}`);
    }
  };

  const handleClickCancel = () => {
    setShowModal(true);
  }



  return (
    <div className="createsocialpost_page">
      {showModal && (
        <div className="createsocialpost_modal_cancel">
          <div className="createsocialpost_modal_content">
            <h3>Are You Sure You Want To Cancel?</h3>
            <h6>(Your draft will not be saved)</h6>
          </div>

          <div className="createsocialpost_modal_container">
            <button className="createsocialpost_modal_cancel_btn" onClick={() => navigate('/socialpage')}>Yes</button>
            <button className="createsocialpost_goback" onClick={() => setShowModal(false)}>Go back</button>
          </div>
        </div>
      )}
      <div className="createsocialpost_container">
        <div className="createsocialpost_header">
          <h2>Create Social Post</h2>
        </div>
        <div className="createsocialpost_container_inner">
          <div className="createsocialpost_top">
            <Dropdown
              options={topics}
              value={options.topic}
              placeholder="Select Topic"
              className="create_map_dropdown"
              onChange={handleTopicClick}
            />
            {options.topic === "Other" && (
              <input
                value={options.customTopic}
                placeholder="Enter a custom Topic"
                onChange={(e) => handleCustomTopic(e.target.value)}
                className="createsocialpost_other_topic_input"
              />
            )}
          </div>
          <div className="createsocialpost_title">
            <input maxLength="100"
              placeholder="Enter title here"
              value={options.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              name="title"
              className="createsocialpost_title_input"
              required
            />
            <div className="createsocialpost_title_char_count">
              {options.title.length}/100
            </div>
          </div>
          <div className="createsocialpost_description">
            <textarea
              placeholder="Enter discussion here"
              value={options.post_content}
              onChange={(e) => handlePostContentChange(e.target.value)}
              name="post_content"
              className="createsocialpost_description_textarea"
            />
          </div>
          <div className="createsocialpost_img">
            <label htmlFor="imageUpload" className="upload-label">
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
            <div className="createsocialpost_images">
              {uploadedImages.map((img, index) => (
                <div className="createsocialpost_image_container">
                  <CancelTwoToneIcon className="remove_uploaded_image" onClick={() => handleRemoveImage(index)} />
                  <img
                    key={index}
                    src={img.data}
                    alt={`Uploaded ${index}`}
                    className="uploaded_image"
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              ))}
            </div>
          </div>
          <hr className="createsocialpost_hr"></hr>
          <div className="social_post_bottom">
            <button onClick={handleClickCancel} className="createsocialpost_cancel">
              Cancel
            </button>
            <button
              onClick={handleSocialPostCreate}
              className="createsocialpost_submit"
            /* disabled={options.title.trim() === ''} */
            >
              Post
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSocialPost;
