import React, { useEffect, useState } from "react";
import MapPreview from "../mappreview/MapPreview";
import SearchBar from "../searchbar/SearchBar";
import Dropdown from "react-dropdown";
import Lottie from "lottie-react";
import NoMapAni from "../../assets/Lottie/NoMaps.json";
import MainPageLoading from "../../assets/Lottie/MainPageLoading.json";
import Typewriter from "typewriter-effect";
import { getAllMapsAPI } from "../../api/map";
import "./main.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import TrendingMaps from "./TrendingMaps";
import { useNavigate } from "react-router-dom";
import { deleteMapPostAPIMethod } from "../../api/map";

const MainPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilterOption, setSearchFilterOption] = useState("Search by");
  const [allMaps, setAllMaps] = useState([]);
  const [mainPageLoading, setMainPageLoading] = useState(true);
  const [trendingMaps, setTrendingMaps] = useState(null);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const searchFilterOps = ["Map Name", "Topics", "Description"];
  const handleSeachFilter = (e) => {
    setSearchFilterOption(e.value);
  };
  useEffect(() => {
    getAllMapsAPI()
      .then((m) => {
        const revMaps = m.reverse();
        setAllMaps(revMaps);
      })
      .finally(() => {
        setTimeout(() => {
          setMainPageLoading(false);
        }, 3000);
      });
  }, []);
  useEffect(() => {
    const copiedMaps = [...allMaps];
    const sortedMapByViewCount = copiedMaps.sort(
      (a, b) => parseFloat(b.view_count) - parseFloat(a.view_count)
    );
    setTrendingMaps(sortedMapByViewCount.slice(0, 7));
  }, [allMaps]);
  useEffect(() => {
  }, [searchFilterOption]);

  // const filteredMaps = allMaps.filter((map) => {
  //   if (map.map_name.includes(searchTerm)) {
  //     console.log("FDJFKSDJFLDSFJSKL");
  //   }
  //   const isVisible = map.is_visible === true;
  //   return searchFilterOption === "Map Name" ||
  //     searchFilterOption === "Search by"
  //     ? isVisible &&
  //     map.map_name.toLowerCase().includes(searchTerm.toLowerCase())
  //     : searchFilterOption === "Topics"
  //       ? isVisible && map.topic.toLowerCase().includes(searchTerm.toLowerCase())
  //       : isVisible &&
  //       map.map_description.toLowerCase().includes(searchTerm.toLowerCase());
  // });

  const filteredMaps = allMaps.filter((map) => {
    const isVisible = map.is_visible === true;
    if (searchFilterOption === "Map Name" || searchFilterOption === "Search by") {
      return isVisible && map.map_name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (map.topic.toLowerCase().includes(searchTerm.toLowerCase())) {
      return isVisible && map.topic.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return isVisible && map.map_description.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  const handleDeleteMapPost = async (mapId) => {
    try {
      const res = await deleteMapPostAPIMethod(mapId);
      if (res) {
        setShowDeleteConfirmationModal(false);
        const filteredMaps = allMaps.filter((m) => m._id !== mapId);
        setAllMaps(filteredMaps);
      } else {
        alert("Error deleting post", res);
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);
    }
  };

  return (
    <div className="mainpage_container">
      {showDeleteConfirmationModal != false && (
        <div className="maps_overlay"></div>
      )}
      <div className="mainpage_trending_header">
        Trending Maps &nbsp;&nbsp;
        <span className="mainpage_trending_subheader">
          Hover to explore the most popular maps.
        </span>
      </div>
      <TrendingMaps trendingMaps={trendingMaps} />
      <hr style={{ width: "100%" }} />
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
          {console.log("FILTERED MAPS: ", filteredMaps)}
          {filteredMaps.length !== 0 &&
            filteredMaps.map((item, index) => (
              <div className="mainpage_mappreview_container">
                <MapPreview key={index} data={item} showDeleteConfirmationModal={showDeleteConfirmationModal} setShowDeleteConfirmationModal={setShowDeleteConfirmationModal} />
                {showDeleteConfirmationModal == item._id && (
                  <div className="mappreview_delete_confirmation_modal">
                    <div className="mappreview_delete_confirmation_modal_top">
                      Are you sure you want to delete this post?
                    </div>
                    <div className="mappreview_delete_confirmation_modal_bottom">
                      <button
                        className="mappreview_delete_confirm"
                        onClick={() => handleDeleteMapPost(item._id)}
                      >
                        Yes
                      </button>
                      <button
                        className="mappreview_cancel_delete"
                        onClick={() =>
                          setShowDeleteConfirmationModal(false)
                        }
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
    </div>
  );
};

export default MainPage;

/* {mainPageLoading ? (
  <div style={{ textAlign: "center", marginTop: "8rem" }}>
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
        opacity: 0.5,
      }}
    />
  </div>
) : ( */
