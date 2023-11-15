import React, { useState } from "react";
import dumMapJsonData from "./dum_data.json";
import "./main.css";
import MapPreview from "../mappreview/MapPreview";
import "bootstrap-icons/font/bootstrap-icons.css";
import SearchBar from "../searchbar/SearchBar";

const MainPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="main_container">
      <SearchBar onSearchChange={(term) => setSearchTerm(term)} />
      <div className="main_maps_container">
        {dumMapJsonData.map((item, index) => (
          <MapPreview key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
