import "./searchBar.css";
import React from "react";

const SearchBar = () => {
  return (
    <div className="search_bar_wrapper">
      <i className="search_icon bi bi-globe-americas" />
      <input
        className="search_bar"
        type="search"
        placeholder="Search Maps"
        onChange={(e) => {
          console.log(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchBar;
