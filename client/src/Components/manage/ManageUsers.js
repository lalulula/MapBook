import React, { useState, useEffect } from "react";
import "./manage.css";

import SearchBar from "../searchbar/SearchBar";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllUsersAPIMethod, adminRemoveUserAPIMethod } from "../../api/user";

const ManageUsers = () => {
  const options = ["Date joined", "Name", "Username"];
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const users = await getAllUsersAPIMethod();
      setAllUsers(users);
      try {
      } catch (error) {
        alert("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);
  const handleDeleteUser = async (id) => {
    try {
      console.log("removing user account");
      const deleteSuccess = await adminRemoveUserAPIMethod(id);
      console.log(deleteSuccess);
      if (deleteSuccess) {
        alert("Delete user with id:", id);
        // TODO : not refresh ->Fix it auto reload
        window.location.reload();
      } else {
        alert("Error removing user account ");
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
            <h1>All Users</h1>
          </div>
          <div className="manage_users_top_right">
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
          {allUsers &&
            allUsers.map((user, index) => (
              <div className="manage_users_user">
                <div className="manage_users_username">{user.username}</div>
                <div className="manage_users_user_email">{user.email}</div>
                <div className="manage_users_date_created">
                  Joined on {formatDate(user.created_at)}
                </div>
                <div className="user_delete">
                  <DeleteIcon onClick={() => handleDeleteUser(user._id)} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
