import React from "react";
import "./searchBar.css";

const SearchBar = ({ onSearchChange }) => {
  return (
    <div className="search_bar_wrapper">
      <i className="search_icon bi bi-globe-americas" />
      <input
        className="search_bar"
        type="search"
        placeholder="Search Maps"
        onChange={(e) => {
          onSearchChange(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchBar;
