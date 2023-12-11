import React, { useState } from "react";
import "./mapPreview.css";
import { useNavigate } from "react-router-dom";
import { fb, storage } from "../../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
export const HOME_URL = process.env.REACT_APP_HOME_URL;


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
    console.log(HOME_URL+'/mapdetails/' + data._id);
    navigator.clipboard.writeText(HOME_URL+'/mapdetails/' + data._id);
    // TODO: copyed popup 
    
    console.log("Share clicked");
  };





  // Convert data to GEOJSON //
  function saveGeoJSONToFile(geoJSONObject, filename) {
    const geoJSONString = JSON.stringify(geoJSONObject);
    // console.log("geoJSONString: ", geoJSONString)
    const newGeoJson = new File([geoJSONString], filename, {
      type: "application/json",
    });
    return newGeoJson;
  }

  function downloadGeoJSON(geoJSONObject, filename) {
    const newGeoJson = saveGeoJSONToFile(geoJSONObject, filename);
    // console.log(newGeoJson)
    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(newGeoJson);
    link.download = filename;
    // Append the link to the body -> trigger click event to start the download
    document.body.appendChild(link);
    link.click();
    // RM link from DOM
    document.body.removeChild(link);
    // console.log(`GeoJSON saved as ${filename}`);
    return newGeoJson;
  }

  const handleExport = async (e) => {
    // Handle export action
    e.stopPropagation();


    let url = data.file_path;
    // get file name from url
    let fileName = url
      .substring(57, url.indexOf("geojson") + 7)
      .replaceAll("%20", " ");
    // console.log(fileName)
    const mapUrl = await getDownloadURL(ref(storage, fileName));

    // This can be downloaded directly:
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.onload = (event) => {
      // console.log("response: ", xhr.response);
      downloadGeoJSON(xhr.response, data.map_name + ".geojson")
      // setSelectedMapFile(xhr.response);


    };
    xhr.open("GET", mapUrl);
    xhr.send();

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
