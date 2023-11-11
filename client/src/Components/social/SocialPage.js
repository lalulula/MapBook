import React from "react";
import "./socialpage.css";
import data from "../social/sample_data_social.json";
import SocialPostPreview from "../socialpostpreview/SocialPostPreview";
import SearchBar from "../searchbar/SearchBar";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { Button } from '@mui/material';

const SocialPage = () => {
  const options = [
    'one', 'two', 'three'
  ];
  return (
    <div className="socialpage">
      <div className="socialpage_container">
        <div className="socialpage_top">
          <div className="socialpostdetails_top_left">
            <h1>Social Page</h1>
          </div>
          <div className="socialpage_top_right">
            <div className="create_new_post">
              <Button variant="outlined" style={{ borderColor: "white", color: 'white' }}>Create new map</Button>
            </div>
            <div className="searchbar">
              <SearchBar />
            </div>
            <div className="sort_by">
              <Dropdown options={options} placeholder="Sort by" className="social_page_dropdown" />
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
