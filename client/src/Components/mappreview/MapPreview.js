import React from "react";
import "./mapPreview.css";
import dumImg from "../../assets/img/dum.jpg";
import { useNavigate } from "react-router-dom";


const MapPreview = ({ data }) => {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    console.log("CLICKED ON MAP PREVIEW");
    navigate(`/mapdetails/${id}`);
  }

  return (
    <div className="map_preview_container" onClick={() => handleEdit(data._id)}>
      <h1>{data._id}</h1>
      <h3>{data.map_name}</h3>
      <img className="map_preview_img" src={dumImg} alt={data.map_name} />
      <p>{data.topic}</p>
      <p>Liked by {data.map_users_liked} users</p>
      <p>{data.map_comment_count} comments</p>
    </div>
  );
};

export default MapPreview;
