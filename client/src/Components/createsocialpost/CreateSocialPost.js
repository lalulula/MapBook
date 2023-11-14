import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createsocialpost.css";
import { grey, blueGrey } from "@mui/material/colors";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dropdown from "react-dropdown";
import Checkbox from "@mui/material/Checkbox";


const CreateSocialPost = () => {
    const navigate = useNavigate();
    const [options, setOptions] = useState({
        name: "",
        topic: "",
        customTopic: "",
        template: "",
        isPrivate: false,
    });
    const handleMapNameChange = (name) => {
        console.log(name);
        setOptions({ ...options, name });
    };
    const handleTopicClick = (topic) => {
        const newVal = topic.value;
        setOptions({ ...options, topic: newVal });
    };
    const handleCustomTopic = (customTopic) => {
        setOptions({ ...options, customTopic });
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
    }

    useEffect(() => {
        console.log(options.topic.value);
    }, [options]);

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

    const templates = [
        "Bar Chart",
        "Circle Map",
        "Heat Map",
        "Pie Chart",
        "Thematic Map",
    ];

    return (
        <div className="create_social_post_page">
            <div className="create_social_post_container">
                <div className="create_social_post_header">
                    <h2>Create Post</h2>
                </div>
                <div className="create_social_post_container_inner">
                    <div>
                        <h3>Title</h3>
                        <input
                            placeholder="Enter title here"
                            value={options.name}
                            onChange={(e) => handleMapNameChange(e.target.value)}
                            name="map_name"
                        />
                    </div>
                    <br />
                    <h3>Description</h3>
                    <div className="social_post_description">
                        <textarea placeholder="Enter your text here" />
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
                        <button onClick={() => navigate('/socialpage')} className="social_post_button">Post</button>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default CreateSocialPost;
