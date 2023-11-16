import React, { useState } from "react";
import "./mapPreview.css";
import dumImg from "../../assets/img/dum.jpg";
import { useNavigate } from "react-router-dom";

const MapPreview = ({ data }) => {
  const navigate = useNavigate();
  const [optionsMenuVisible, setOptionsMenuVisible] = useState(false);

  const handleEdit = (id) => {
    console.log("CLICKED ON MAP PREVIEW");
    navigate(`/mapdetails/${id}`);
  };

  const toggleOptionsMenu = (e) => {
    e.stopPropagation();
    setOptionsMenuVisible(!optionsMenuVisible);
  };

  const handleFork = (e) => {
    // Handle fork action
    e.stopPropagation();
    console.log("Fork clicked");
  };

  const handleShare = (e) => {
    // Handle share action
    e.stopPropagation();
    console.log("Share clicked");
  };

  const handleExport = (e) => {
    // Handle export action
    e.stopPropagation();
    console.log("Export clicked");
  };

  return (
    <div className="map_preview_container" onClick={() => handleEdit(data._id)}>
      <img className="map_preview_img" src={dumImg} alt={data.map_name} />
      <div className="content">
        <div className="map_name_container">
          <div className="map_name">{data.map_name}</div>
          <div className="map_options" onClick={toggleOptionsMenu}>
            <i
              className="bi bi-three-dots-vertical"
              style={{ color: "black" }}
            ></i>
          </div>
        </div>
        <div className="map_topic">{data.topic}</div>
        <div className="map_count_container">
          <div className="map_like">Liked by {data.map_users_liked} users</div>
          <div className="map_no_comment">
            {data.map_comment_count} comments
          </div>
        </div>

        {optionsMenuVisible && (
          <div className="options_menu">
            <ul>
              <li onClick={handleFork}>Fork</li>
              <li onClick={handleShare}>Share</li>
              <li onClick={handleExport}>Export</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPreview;
