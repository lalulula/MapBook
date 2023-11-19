import React from "react";
import "./socialpostdetails.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import data from "../social/sample_data_social.json";
import SocialComments from "../comments/SocialComments";
import { getSocialPostAPIMethod } from "../../api/client";

const SocialPostDetails = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [currentPost, setCurrentPost] = useState({});
  //   //will make an api call to get the id of a social post
  //   const curr = data.filter((obj) => obj._id === id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentPost = await getSocialPostAPIMethod(id);
        setCurrentPost(currentPost);
      } catch (error) {
        console.error("Error fetching social posts:", error); //TODO: Add error handling when error happens fetching.(Render screen)
      }
    };
    fetchData();
  }, []);

  return (
    <div className="socialpostdetails">
      <div className="socialpostdetails_container">
        <div className="socialpostdetails_top">
          <div className="socialpostdetails_top_left">
            <img
              className="socialpostdetails_profile_img"
              src="https://us-tuna-sounds-images.voicemod.net/d347dbc8-e6b8-4f85-bb64-8dcb234f5730-1674067639225.jpg"
            />
            <div className="socialpostdetails_top_left_container">
              <h1>{currentPost.title}</h1>
              <div className="socialpostdetails_user">{currentPost.user}</div>
            </div>
          </div>

          <div className="socialpostdetails_top_right">{currentPost.topic}</div>
        </div>
        <div className="socialpostdetails_middle">
          <div className="socialpostdetails_middle_left">
            <img id="post_details_img" src={currentPost.post_images} />
          </div>
          <div className="socialpostdetails_middle_right">
            {currentPost.post_content}
          </div>
        </div>
        <div className="socialpostdetails_bottom">
          <SocialComments />
        </div>
      </div>
    </div>
  );
};

export default SocialPostDetails;
