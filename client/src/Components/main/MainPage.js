import React, { useEffect, useState } from "react";
import "./main.css";
import MapPreview from "../mappreview/MapPreview";
import "bootstrap-icons/font/bootstrap-icons.css";
import SearchBar from "../searchbar/SearchBar";
import Dropdown from "react-dropdown";
import Lottie from "lottie-react";
import NoMapAni from "../../assets/Lottie/NoMaps.json";
import MainPageLoading from "../../assets/Lottie/MainPageLoading.json";
import { getAllMapsAPI } from "../../api/map";
import Typewriter from "typewriter-effect";

const MainPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilterOption, setSearchFilterOption] = useState("");
  const [allMaps, setAllMaps] = useState([]);
  const [mainPageLoading, setMainPageLoading] = useState(true);
  const searchFilterOps = ["Map Name", "Topics", "Description"];
  const handleSeachFilter = (e) => {
    setSearchFilterOption(e.value);
  };
  useEffect(() => {
    // console.log(searchFilterOption);
  }, [searchFilterOption]);

  const filteredMaps = allMaps.filter((map) => {
    // Check if map is visible
    const isVisible = map.is_visible === true;
    // Check search filter conditions and visibility
    return searchFilterOption === "Map Name" ||
      searchFilterOption === "Search by"
      ? isVisible &&
          map.map_name.toLowerCase().includes(searchTerm.toLowerCase())
      : searchFilterOption === "Topics"
      ? isVisible && map.topic.toLowerCase().includes(searchTerm.toLowerCase())
      : isVisible &&
        map.map_description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    getAllMapsAPI()
      .then((m) => {
        setAllMaps(m);
      })
      .finally(() => {
        setTimeout(() => {
          setMainPageLoading(false);
        }, 3000);
      });
  }, []);

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
      {mainPageLoading ? (
        <div style={{ textAlign: "center" }}>
          <div>
            <Typewriter
              onInit={(typewriter) => {
                typewriter.typeString("Loading all maps..").start();
              }}
            />
          </div>
          <Lottie
            animationData={MainPageLoading}
            style={{
              height: 350,
              width: 350,
              opacity: 0.6,
            }}
          />
        </div>
      ) : (
        <div className="mainpage_maps_container">
          <div className="mainpage_maps">
            {filteredMaps.length !== 0 &&
              filteredMaps.map((item, index) => (
                <MapPreview key={index} data={item} />
              ))}
            {console.log("filteredMaps:", filteredMaps)}
          </div>

          {filteredMaps.length === 0 && (
            <div className="mainpage_maps_no_search_container">
              <div className="mainpage_maps_no_search">
                <br />
                <h1>No search results for '{searchTerm}'</h1>
                <br />
              </div>
              <Lottie
                animationData={NoMapAni}
                style={{
                  height: 300,
                  width: 300,
                  position: "absolute",
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MainPage;
