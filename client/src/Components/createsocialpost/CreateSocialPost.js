import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createsocialpost.css";
import Dropdown from "react-dropdown";
import { createSocialPostAPIMethod } from "../../api/social";
import { useSelector } from "react-redux";
const CreateSocialPost = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
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
  const [options, setOptions] = useState({
    title: "",
    post_content: "",
    topic: "",
    customTopic: "",
    // post_images: "",
    post_owner: "",
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

    // const images = []
    // if(options["post_images"] != null){
    //   for(var i = 0; i < options["post_images"].length; i ++){
    //     images.push(options["post_images"])
    //   }
    // }

    // images.push(event.target.files[0])

    setOptions({
      ...options,
      post_images: event.target.files[0],
    });


    const files = event.target.files; // Get the first file from the selected files
    if (files.length > 0) {
 
      const newImages = Array.from(files).map((file) => ({
        data: URL.createObjectURL(file),
        file,
      }));

      setUploadedImages([...uploadedImages, ...newImages]);
    }

    console.log(options)
  };
  const handleSocialPostCreate = async () => {
    console.log(options);
    console.log(userId);

    const newPost = { ...options, post_owner: userId };
    const res = await createSocialPostAPIMethod(newPost);
    console.log(res);
    // Check if the response was successful (status code 2xx)
    if (res.ok) {
      const responseMsg = await res.json;
      console.log(responseMsg.message);
      navigate("/socialpage");
    } else {
      // If the response status is not successful, handle the error
      alert(`Error: ${res.status} - ${res.statusText}`);
    }
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
              placeholder="Enter title here"
              value={options.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              name="title"
            />
          </div>
          <br />
          <h3>Description</h3>
          <div className="social_post_description">
            <textarea
              placeholder="Enter discussion here"
              value={options.post_content}
              onChange={(e) => handlePostContentChange(e.target.value)}
              name="post_content"
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
              accept="image/*" // Only image files are allowed
              onChange={handleImageUpload}
              className="upload-input"
            />
            {uploadedImages.map((img, index) => (
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
