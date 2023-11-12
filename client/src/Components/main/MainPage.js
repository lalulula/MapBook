import React from "react";
import dumMapJsonData from "./dum_data.json";
import "./main.css";
import MapPreview from "../mappreview/MapPreview";
import "bootstrap-icons/font/bootstrap-icons.css";
import SearchBar from "../searchbar/SearchBar";

const MainPage = () => {
  return (
    <div className="main_container">
      <SearchBar />
      <div className="main_maps_container">
        {dumMapJsonData.map((item, index) => (
          <MapPreview key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
