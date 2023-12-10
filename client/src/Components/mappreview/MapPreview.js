import React, { useState } from "react";
import "./mapPreview.css";
import { useNavigate } from "react-router-dom";

const MapPreview = ({ data }) => {
  // console.log("data: ", data);
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
    <div className="mappreview_container" onClick={() => handleEdit(data._id)}>
      {optionsMenuVisible && (
        <div className="mappreview_options_menu">
          <ul>
            <li className="mappreview_handle_fork" onClick={handleFork}>
              Fork
            </li>
            <li onClick={handleShare}>Share</li>
            <li onClick={handleExport}>Export</li>
          </ul>
        </div>
      )}
      <i
        onClick={toggleOptionsMenu}
        className="bi bi-three-dots-vertical"
        style={{ color: "black" }}
      ></i>
      <img
        className="mappreview_img"
        src={data.mapPreviewImg}
        alt={data.map_name}
      />
      <div className="mappreview_content">
        <div className="mappreview_name_container">
          <div className="mappreview_name">{data.map_name}</div>
        </div>
        <div className="mappreview_topic">{data.topic}</div>
        <div className="mappreview_count_container">
          <div className="mappreview_like">
            Liked by {data.map_users_liked.length} users
          </div>
          <div className="mappreview_no_comment">
            {data.map_comments.length} comments
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPreview;
