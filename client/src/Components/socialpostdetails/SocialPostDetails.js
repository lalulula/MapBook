import React from "react";
import "./socialpostdetails.css";

const SocialPostDetails = () => {
    return (
        <div className="socialpostdetails">
            <div className="socialpostdetails_container">
                <div className="socialpostdetails_top">
                    <div className="socialpostdetails_top_left">
                        <img className="mapdetails_profile_img" src="https://us-tuna-sounds-images.voicemod.net/d347dbc8-e6b8-4f85-bb64-8dcb234f5730-1674067639225.jpg" />
                        <h1>TITLE</h1>
                    </div>

                    <div className="socialpostdetails_top_right">top right</div>
                </div>
                <div className="socialpostdetails_middle">
                    <div className="socialpostdetails_middle_left">
                        middle left
                    </div>
                    <div className="socialpostdetails_middle_right">
                        midddle right
                    </div>
                </div>
                <div className="socialpostdetails_bottom">
                    bottom
                </div>
            </div>
        </div>
    )
};

export default SocialPostDetails;
