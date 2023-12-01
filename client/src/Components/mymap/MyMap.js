import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MapPreview from "../mappreview/MapPreview";
import SearchBar from "../searchbar/SearchBar";
import Dropdown from "react-dropdown";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./mymap.css";
import Lottie from "lottie-react";
import NoMapAni from "../../assets/Lottie/NoMaps.json";
import dumMapJsonData from "../main/dum_data.json";
import { getMapsAPI } from "../../api/map";

const MyMap = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null); // State to store user data
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated); //Token of user : when logged in
  const user = useSelector((state) => state.user.user); // User Obj --> can extract data from this and use it

  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilterOption, setSearchFilterOption] = useState("");
  const searchFilterOps = ["MapName", "Topics", "Description"];
  const [myMaps, setMyMaps] = useState([]);

  const handleSeachFilter = (e) => {
    setSearchFilterOption(e.value);
  };

  const filteredMaps = myMaps.filter((map) => { //change to allMaps.filter
    return (searchFilterOption === "Map Name" || searchFilterOption === "Search by")
      ? map.map_name.toLowerCase().includes(searchTerm.toLowerCase())
      : searchFilterOption === "Topics"
        ? map.topic.toLowerCase().includes(searchTerm.toLowerCase())
        : map.map_description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    if (isAuthenticated) {
      setUserData(user);
      //setMyMaps(user.maps_created);
      getMapsAPI(user._id).then((m) => {
        setMyMaps(m);
      })
      console.log("Authenticated user:", user);
    } else {
      console.log("User is not authenticated");
    }
  }, [isAuthenticated, dispatch, navigate, user]);



  return (
    <div className="mymaps_main_container">
      <h1>{user.username}'s Maps</h1>
      {myMaps.length !== 0 && (
        <div className="mymaps_top">
          <div className="mymaps_searchbar">
            <SearchBar onSearchChange={(term) => setSearchTerm(term)} />
          </div>

          <Dropdown
            options={searchFilterOps}
            value={searchFilterOption}
            placeholder="Search By.."
            className="search_filter_dropdown"
            onChange={handleSeachFilter}
          />
        </div>
      )}
      {myMaps.length === 0 ? (
        <div className="nomaps_container">
          <br />
          <h1>
            You don't have any maps yet! Click Create Map to Make your Maps!
          </h1>
          <Lottie
            animationData={NoMapAni}
            style={{
              height: 300,
              width: 300,
            }}
          />
          <br />
          <div className="nomap_txt_btn" onClick={() => navigate("/createmap")}>
            Go to Create Map Page
          </div>
        </div>
      ) : (
        <div className="mymaps_container">
          {filteredMaps.map((item, index) => (
            <MapPreview key={index} data={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMap;
