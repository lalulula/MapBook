import React, { useEffect, useState } from "react";
import dumMapJsonData from "./dum_data.json";
import "./main.css";
import MapPreview from "../mappreview/MapPreview";
import "bootstrap-icons/font/bootstrap-icons.css";
import SearchBar from "../searchbar/SearchBar";
import Dropdown from "react-dropdown";
import Lottie from "lottie-react";
import NoMapAni from "../../assets/Lottie/NoMaps.json";
import { getAllMapsAPI } from "../../api/map";


const MainPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilterOption, setSearchFilterOption] = useState("");
  const [allMaps, setAllMaps] = useState([]);
  const searchFilterOps = ["Map Name", "Topics", "Description"];
  const handleSeachFilter = (e) => {
    setSearchFilterOption(e.value);
  };
  useEffect(() => {
    // console.log(searchFilterOption);
  }, [searchFilterOption]);

  const defaultDropdownValue = "Map Name";
  const filteredMaps = allMaps.filter((map) => { //change to allMaps.filter
    console.log("search filter option: ", searchFilterOption);
    return (searchFilterOption === "Map Name" || searchFilterOption === "Search by")
      ? map.map_name.toLowerCase().includes(searchTerm.toLowerCase())
      : searchFilterOption === "Topics"
        ? map.topic.toLowerCase().includes(searchTerm.toLowerCase())
        : map.map_description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    getAllMapsAPI().then((m) => {
      setAllMaps(m);
    })
  }, [])


  return (
    <div className="mainpage_container">
      <div className="search_wrapper">
        <SearchBar onSearchChange={(term) => setSearchTerm(term)} />
        <Dropdown
          options={searchFilterOps}
          value={searchFilterOption}
          placeholder="Search By"
          className="mainpage_search_filter_dropdown"
          onChange={handleSeachFilter}
        />
      </div>

      <div className="mainpage_maps_container">
        <div className="mainpage_maps">
          {filteredMaps.length != 0 && filteredMaps.map((item, index) => (
            <MapPreview key={index} data={item} />
          ))}
        </div>

        {filteredMaps.length == 0 && (
          <div className="mainpage_maps_no_search_container">
            <div className="mainpage_maps_no_search">
              <br />
              <h1>
                No search results for '{searchTerm}'
              </h1>
              <br />
            </div>
            <Lottie
              animationData={NoMapAni}
              style={{
                height: 300,
                width: 300,
                position: "absolute"
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
