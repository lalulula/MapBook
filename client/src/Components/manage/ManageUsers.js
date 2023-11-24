import React, { useState, useEffect } from "react";
import "./manage.css";

import SearchBar from "../searchbar/SearchBar";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllUsersAPIMethod } from "../../api/user";

const ManageUsers = () => {
  const options = ["Date joined", "Name", "Username"];
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    // const fetchData = async () => {
    //   const users = await getAllUsersAPIMethod();
    //   setAllUsers(users);
    //   try {
    //   } catch (error) {
    //     alert("Error fetching user data:", error);
    //   }
    // };
    // fetchData();
  }, []);
  return (
    <div className="manage_users">
      <div className="manage_users_container">
        <div className="manage_users_top">
          <div className="manage_users_top_left">
            <h1>All Users</h1>
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
          {allUsers &&
            allUsers.map((user, index) => (
              <div className="manage_users_user">
                <div className="manage_users_name">{user.name}</div>
                <div className="manage_users_username">{user.username}</div>
                <div className="manage_users_user_email">{user.user_email}</div>
                <div className="manage_users_date_created">
                  Joined on {user.date_created}
                </div>
                <div className="user_delete">
                  <DeleteIcon />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
