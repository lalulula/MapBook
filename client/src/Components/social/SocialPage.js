import React from "react";
import "./socialpage.css";
import data from "./dummy_data_social.json";
import SocialPostPreview from "../socialpostpreview/SocialPostPreview";

const SocialPage = () => {
  return (
    <div className="socialpage">
      <div className="socialpage_container">
        <div className="socialpage_top">
          <div className="socialpostdetails_top_left">
            <h1>Social Page</h1>
          </div>
          <div className="socialpage_top_right">
            <div className="create_new_post">
              create new post
            </div>
            <div className="searchbar">
              search bar
            </div>
            <div className="sort_by">
              sort by
            </div>
          </div>
        </div>
        <div className="socialpage_middle">
          {data.map((item, index) => (
            <SocialPostPreview key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  )
};

export default SocialPage;
