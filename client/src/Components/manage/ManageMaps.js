import React, { useState, useEffect } from "react";
import "./manage.css";

import SearchBar from "../searchbar/SearchBar";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import DeleteIcon from "@mui/icons-material/Delete";

const ManageMaps = () => {
  const options = ["Date joined", "Name", "Username"];
  const [allMaps, setAllMaps] = useState([]);
  useEffect(() => {
    // const fetchData = async () => {
    //   const maps = await getAllUsersAPIMethod();
    //   setAllMaps(maps);
    //   try {
    //   } catch (error) {
    //     alert("Error fetching map data:", error);
    //   }
    // };
    // fetchData();
  }, []);
  return (
    <div className="manage_users">
      <div className="manage_users_container">
        <div className="manage_users_top">
          <div className="manage_users_top_left">
            <h1>All Maps</h1>
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
          {allMaps &&
            allMaps.map((map, index) => (
              <div className="manage_users_user">
                <div className="manage_users_name">{map.name}</div>
                <div className="manage_users_username">{map.username}</div>
                <div className="manage_users_user_email">{map.user_email}</div>
                <div className="manage_users_date_created">
                  Created at {map.date_created}
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

export default ManageMaps;
