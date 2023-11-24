import React, { useState, useEffect } from "react";
import "./manage.css";
import SearchBar from "../searchbar/SearchBar";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  deleteSocialPostAPIMethod,
  getAllSocialPostsAPIMethod,
} from "../../api/social";
import { getUserById } from "../../api/user";

const ManageSocials = () => {
  const options = ["Date joined", "Name", "Username"];
  const [allSocials, setAllSocials] = useState([]);
  const [postOwner, setPostOwner] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const socials = await getAllSocialPostsAPIMethod();
      setAllSocials(socials);
      // const currentOwner = await getUserById(data.post_owner);
      // setPostOwner(currentOwner);
      try {
      } catch (error) {
        alert("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);
  const handleDeleteSocialPost = async (id) => {
    try {
      console.log("removing social post");
      const deleteSuccess = await deleteSocialPostAPIMethod(id);

      if (deleteSuccess) {
        alert("Delete post with id:", id);
        // TODO : not refresh ->Fix it auto reload
        window.location.reload();
      } else {
        alert("Error deleting post");
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);
    }
  };
  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${day}\n${hours}:${minutes}`;

    return formattedDateTime;
  };
  return (
    <div className="manage_users">
      <div className="manage_users_container">
        <div className="manage_users_top">
          <div className="manage_users_top_left">
            <h1>All Social Posts</h1>
            {allSocials && allSocials.length}posts
          </div>
          <div className="manage_users_top_right">
            <div className="manage_users_searchbar">
              <SearchBar />
            </div>
            <div className="sort_by">
              <Dropdown
                options={options}
                placeholder="Sort by"
                className="manage_users_dropdown"
              />
            </div>
          </div>
        </div>
        <div className="manage_users_middle">
          {allSocials &&
            allSocials.map((social, index) => (
              <div className="manage_users_user">
                <div className="manage_users_username">{social.post_owner}</div>
                <div className="manage_users_name">{social.title}</div>
                <div className="manage_users_user_email">
                  {social.social_users_liked.length}likes
                  <br />
                  {social.social_comments.length}comments
                </div>
                <div className="manage_users_date_created">
                  Created at {formatDate(social.created_at)}
                </div>
                <div className="user_delete">
                  <DeleteIcon
                    onClick={() => handleDeleteSocialPost(social._id)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ManageSocials;
