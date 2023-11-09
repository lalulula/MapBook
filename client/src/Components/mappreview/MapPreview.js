import React from "react";

const MapPreview = ({ data, defaultImg }) => {
  return (
    <div className="card">
      <img src={data.map_img ? data.map_img : defaultImg} alt={data.map_name} />
      <h3>{data.map_name}</h3>
      <p>{data.topic}</p>
      <p>Liked by {data.map_users_liked} users</p>
      <p>{data.map_comment_count} comments</p>
    </div>
  );
};

export default MapPreview;
