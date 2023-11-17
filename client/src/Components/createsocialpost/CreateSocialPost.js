import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createsocialpost.css";
import Dropdown from "react-dropdown";

const CreateSocialPost = () => {
  const navigate = useNavigate();
  const [options, setOptions] = useState({
    title: "",
    text: "",
    topic: "",
    customTopic: "",
  });
  const handleTitleChange = (title) => {
    setOptions({ ...options, title });
  };
  const handleTextChange = (text) => {
    setOptions({ ...options, text });
  };
  const handleTopicClick = (topic) => {
    const newVal = topic.value;
    setOptions({ ...options, topic: newVal });
  };
  const handleCustomTopic = (customTopic) => {
    setOptions({ ...options, customTopic });
  };
  const handleSocialPostCreate = () => {
    console.log(options);
    // navigate("/socialpage");
  };

  const handleImageUpload = (event) => {
    /* const file = event.target.files[0]; // Get the first file from the selected files
        if (file) {
          const reader = new FileReader();
    
          reader.onload = (e) => {
            // Pass the uploaded image data to the parent component
            onImageUpload(e.target.result);
          };
    
          reader.readAsDataURL(file);
        } */
  };

  useEffect(() => {}, []);

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
              placeholder="Enter title here"
              value={options.name}
              onChange={(e) => handleTitleChange(e.target.value)}
              name="title"
            />
          </div>
          <br />
          <h3>Description</h3>
          <div className="social_post_description">
            <textarea
              placeholder="Enter discussion here"
              value={options.text}
              onChange={(e) => handleTextChange(e.target.value)}
              name="text"
            />
          </div>
          <br />
          <div className="social_post_img">
            <label htmlFor="imageUpload" className="upload-label">
              Choose an Image
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*" // Specify that only image files are allowed
              onChange={handleImageUpload}
              className="upload-input"
            />
          </div>
          <br></br>
          <div className="social_post_bottom">
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
              />
            )}
            <button
              onClick={handleSocialPostCreate}
              className="social_post_button"
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
