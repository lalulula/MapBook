import React from "react";
import dumImg from "../../assets/img/dum.jpg";
import { useNavigate } from "react-router-dom";
import "./socialpostpreview.css";


const SocialPostPreview = ({ data }) => {
    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/mapdetails/${id}`);
    }

    return (
        <div className="social_post_preview_container" /* onClick={() => handleEdit(data._id)} */>
            <h1>{data._id}</h1>
            <h3>{data.map_name}</h3>
            <img className="social_post_preview_img" src={dumImg} alt={data.map_name} />
            <p>{data.topic}</p>
            <p>Liked by {data.map_users_liked} users</p>
            <p>{data.map_comment_count} comments</p>
        </div>
    );
};

export default SocialPostPreview;
