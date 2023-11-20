// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./socialpostpreview.css";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import CommentIcon from "@mui/icons-material/Comment";

// const SocialPostPreview = ({ data }) => {
//   const navigate = useNavigate();

//   const handleToSocialDetails = (id) => {
//     navigate(`/socialpostdetails/${id}`);
//   };
//   console.log(data);
//   useEffect(() => {
//     console.log(data.post_images);
//   }, [data]);
//   return (
//     <div
//       className="social_post_preview_container"
//       onClick={() => handleToSocialDetails(data._id)}
//     >
//       <div className="social_post_preview_container_left">
//         <FavoriteBorderIcon />
//         {data.social_users_liked.length}
//       </div>
//       <div className="social_post_preview_container_middle">
//         <div className="owner_name">Posted by {data.username}</div>
//         <div className="social_post_title">
//           <h3>{data.title}</h3>
//         </div>
//         <div className="num_comments">
//           <CommentIcon />
//           &nbsp;&nbsp;{data.social_comments.length} comments
//         </div>
//       </div>
//       <div className="social_post_preview_container_right">
//         <img
//           className="social_post_preview_img"
//           alt=""
//           src={data.post_images[0]}
//         />
//       </div>
//     </div>
//   );
// };

// export default SocialPostPreview;
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./socialpostpreview.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import { useSelector } from "react-redux";
const SocialPostPreview = ({ data }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const handleToSocialDetails = (id) => {
    navigate(`/socialpostdetails/${id}`);
  };
  console.log(data);
  useEffect(() => {
    console.log(data.post_images);
  }, [data]);
  return (
    <div
      className="social_post_preview_container"
      onClick={() => handleToSocialDetails(data._id)}
    >
      <div className="social_post_preview_container_left">
        <FavoriteBorderIcon />
        {data.social_users_liked.length}
      </div>
      <div className="social_post_preview_container_middle">
        <div className="owner_name">Posted by {data.post_owner}</div>
        <div className="social_post_title">
          <h3>{data.title}</h3>
        </div>
        <div className="num_comments">
          <CommentIcon />
          &nbsp;&nbsp;{data.social_comments.length} comments
        </div>
      </div>
      <div className="social_post_preview_container_right">
        <img
          className="social_post_preview_img"
          alt=""
          src={data.post_images[0]}
        />
      </div>
    </div>
  );
};

export default SocialPostPreview;
