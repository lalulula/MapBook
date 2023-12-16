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
import Typewriter from "typewriter-effect";
import { getMapsAPI } from "../../api/map";
import MainPageLoading from "../../assets/Lottie/MapsLoading.json";
import { deleteMapPostAPIMethod } from "../../api/map";

const MyMap = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null); // State to store user data
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated); //Token of user : when logged in
  const user = useSelector((state) => state.user.user); // User Obj --> can extract data from this and use it
  const [myMapsLoading, setMyMapsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilterOption, setSearchFilterOption] = useState("");
  const searchFilterOps = ["MapName", "Topics", "Description"];
  const [myMaps, setMyMaps] = useState([]);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

  const handleSeachFilter = (e) => {
    setSearchFilterOption(e.value);
  };

  const filteredMaps = myMaps.filter((map) => {
    //change to allMaps.filter
    return searchFilterOption === "Map Name" ||
      searchFilterOption === "Search by"
      ? map.map_name.toLowerCase().includes(searchTerm.toLowerCase())
      : searchFilterOption === "Topics"
        ? map.topic.toLowerCase().includes(searchTerm.toLowerCase())
        : map.map_description.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const handleDeleteMapPost = async (mapId) => {
    try {
      console.log("removing map post");
      const res = await deleteMapPostAPIMethod(mapId);
      if (res) {
        setShowDeleteConfirmationModal(false);
        const filteredMaps = myMaps.filter((m) => m._id !== mapId);
        setMyMaps(filteredMaps);
      } else {
        alert("Error deleting post", res);
      }
    } catch (error) {
      console.error("Error handling delete operation:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setUserData(user);
      //setMyMaps(user.maps_created);
      getMapsAPI(user._id)
        .then((m) => {
          setMyMaps(m);
        })
        .finally(() => {
          setTimeout(() => {
            setMyMapsLoading(false);
          }, 2000);
        });
      console.log("Authenticated user:", user);
    } else {
      console.log("User is not authenticated");
    }
  }, [isAuthenticated, dispatch, navigate, user]);

  return (
    <div className="mymaps_main_container">
      {showDeleteConfirmationModal != false && (
        <div className="maps_overlay"></div>
      )}
      {!myMapsLoading && <h1>{user.username}'s Maps</h1>}
      {myMapsLoading ? (
        <div
          style={{
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "8rem",
          }}
        >
          <Lottie
            animationData={MainPageLoading}
            style={{
              height: 350,
              width: 350,
              opacity: 0.6,
            }}
          />
          <div>
            <Typewriter
              onInit={(typewriter) => {
                typewriter.typeString("Loading maps..").start();
              }}
            />
          </div>
        </div>
      ) : myMaps.length !== 0 ? (
        <>
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
          <div className="mymaps_container">
            {filteredMaps.map((item, index) => (
              <div className="mymap_mappreview_container">
                <MapPreview key={index} data={item} showDeleteConfirmationModal={showDeleteConfirmationModal} setShowDeleteConfirmationModal={setShowDeleteConfirmationModal} />
                {console.log("showDeleteconfimationmodal: ", showDeleteConfirmationModal)}
                {console.log("item._id: ", item._id)}
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
        </>
      ) : (
        myMaps.length === 0 && (
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
            <div
              className="nomap_txt_btn"
              onClick={() => navigate("/createmap")}
            >
              Go to Create Map Page
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default MyMap;
