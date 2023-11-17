import React, { useEffect, useState } from "react";
import "./socialpage.css";
import data from "../social/sample_data_social.json";
import SocialPostPreview from "../socialpostpreview/SocialPostPreview";
import SearchBar from "../searchbar/SearchBar";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import samplePostData from "./sample_data_social.json";

const SocialPage = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilterOption, setSearchFilterOption] = useState("");
  const searchFilterOps = ["Title", "Topics", "Description"];
  const handleSeachFilter = (e) => {
    setSearchFilterOption(e.value);
  };

  const filteredPosts = samplePostData.filter((post) => {
    return searchFilterOption === "Title"
      ? post.social_post_name.toLowerCase().includes(searchTerm.toLowerCase())
      : searchFilterOption === "Topics"
        ? post.topic.toLowerCase().includes(searchTerm.toLowerCase())
        : post.post_text.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="socialpage">
      <div className="socialpage_container">
        <div className="socialpage_top">
          <div className="socialpostdetails_top_left">
            <h1>Social Page</h1>
          </div>
          <div className="socialpage_top_right">
            <div className="create_new_post">
              <Button onClick={() => navigate('/createsocialpost')} variant="outlined" style={{ borderColor: "white", color: 'white', marginRight: "10px" }}>Create new post</Button>
            </div>
            <div className="searchbar">
              <SearchBar onSearchChange={(term) => setSearchTerm(term)} />
            </div>
            <div className="sort_by">
              <Dropdown options={options} placeholder="Sort by" className="social_page_dropdown" />
            </div>
          </div>
        </div>
        <div className="socialpage_middle">
          {filteredPosts.map((item, index) => (
            <SocialPostPreview key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialPage;
