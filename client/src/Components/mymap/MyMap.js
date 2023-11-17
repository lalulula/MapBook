import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import dumMapJsonData from "../main/dum_data.json";
import "./mymap.css";
import MapPreview from "../mappreview/MapPreview";
import "bootstrap-icons/font/bootstrap-icons.css";
import SearchBar from "../searchbar/SearchBar";
import { getUserAPIMethod } from "../../api/client";
import Dropdown from 'react-dropdown';


const MyMap = () => {
  const [userData, setUserData] = useState(null); // State to store user data
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilterOption, setSearchFilterOption] = useState("");
  const searchFilterOps = ["MapName", "Topics", "Description"];
  const handleSeachFilter = (e) => {
    setSearchFilterOption(e.value);
  };
  const filteredMaps = dumMapJsonData.filter((map) => {
    return searchFilterOption === "MapName"
      ? map.map_name.toLowerCase().includes(searchTerm.toLowerCase())
      : searchFilterOption === "Topics"
        ? map.topic.toLowerCase().includes(searchTerm.toLowerCase())
        : map.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    if (isAuthenticated) {
      setUserData(user);
      console.log("Authenticated user:", user);
    } else {
      console.log("User is not authenticated");
    }

    // Use getUserAPIMethod to fetch???왜앙돼
    getUserAPIMethod()
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Error fetching user data: ", error);
      });
  }, [isAuthenticated, dispatch, navigate, user]);

  return (
    <div className="mymaps_main_container">
      <h1>{userData}'s Maps</h1>
      <div className="my_maps_top">
        <div className="my_maps_searchbar">
          <SearchBar onSearchChange={(term) => setSearchTerm(term)} />
        </div>
        <Dropdown
          options={searchFilterOps}
          value={searchFilterOption}
          placeholder="Search By.."
          className="search_filter_dropdown"
          onChange={handleSeachFilter}
        />      </div>

      <div className="mymaps_container">
        {filteredMaps.map((item, index) => (
          <MapPreview key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

export default MyMap;
