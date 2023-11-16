import React, { useEffect, useState } from "react";
import dumMapJsonData from "./dum_data.json";
import "./main.css";
import MapPreview from "../mappreview/MapPreview";
import "bootstrap-icons/font/bootstrap-icons.css";
import SearchBar from "../searchbar/SearchBar";
import Dropdown from "react-dropdown";

const MainPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilterOption, setSearchFilterOption] = useState("");
  const searchFilterOps = ["MapName", "Topics", "Description"];
  const handleSeachFilter = (e) => {
    setSearchFilterOption(e.value);
  };
  useEffect(() => {
    console.log(searchFilterOption);
  }, [searchFilterOption]);
  const filteredMaps = dumMapJsonData.filter((map) => {
    return searchFilterOption === "MapName"
      ? map.map_name.toLowerCase().includes(searchTerm.toLowerCase())
      : searchFilterOption === "Topics"
      ? map.topic.toLowerCase().includes(searchTerm.toLowerCase())
      : map.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="main_container">
      <div className="search_container">
        <SearchBar onSearchChange={(term) => setSearchTerm(term)} />
        <Dropdown
          options={searchFilterOps}
          value={searchFilterOption}
          placeholder="Search By.."
          className="search_filter_dropdown"
          onChange={handleSeachFilter}
        />
      </div>
      <div className="main_maps_container">
        {filteredMaps.map((item, index) => (
          <MapPreview key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
