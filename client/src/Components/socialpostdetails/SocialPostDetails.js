import React from "react";
import "./socialpostdetails.css";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import data from "../social/sample_data_social.json";
import Comments from "../comments/Comments";

const SocialPostDetails = () => {
    const [user, setUser] = useState(null);
    const { id } = useParams();
    const [currentPost, setCurrentPost] = useState({});
    //will make an api call to get the id of a social post
    const curr = data.filter((obj) => obj._id == id);

    useEffect(() => {
        setCurrentPost(curr[0])
    }, []);

    return (
        <div className="socialpostdetails">
            <div className="socialpostdetails_container">
                <div className="socialpostdetails_top">
                    <div className="socialpostdetails_top_left">
                        <img className="socialpostdetails_profile_img" src="https://us-tuna-sounds-images.voicemod.net/d347dbc8-e6b8-4f85-bb64-8dcb234f5730-1674067639225.jpg" />
                        <div className="socialpostdetails_top_left_container">
                            <h1>{currentPost.social_post_name}</h1>
                            <div className="socialpostdetails_user">{currentPost.user}</div>
                        </div>
                    </div>

                    <div className="socialpostdetails_top_right">
                        {currentPost.topic}
                    </div>
                </div>
                <div className="socialpostdetails_middle">
                    <div className="socialpostdetails_middle_left">
                        <img id="post_details_img" src={currentPost.map_img} />
                    </div>
                    <div className="socialpostdetails_middle_right">
                        {currentPost.post_text}
                    </div>
                </div>
                <div className="socialpostdetails_bottom">
                    <Comments />
                </div>
            </div>
        </div>
    )
};

export default SocialPostDetails;
