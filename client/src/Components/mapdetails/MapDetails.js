import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import data from "../main/dum_data.json";

import "./mapdetails.css";
import MapTools from "../maptools/MapTools";
import MapComments from "../comments/MapComments";

const MapDetails = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [currentMap, setCurrentMap] = useState({});
  //will make an api call to get the id of a map
  const curr = data.filter((obj) => obj._id == id);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentMap(curr[0]);
  }, []);

  return (
    <div className="map_details">
      <div className="map_details_container">
        <span
          className="back_btn_mapdetail"
          onClick={() => navigate("/mainpage")}
        >
          <i className="bi bi-arrow-left" />
          &nbsp;&nbsp;MainPage
        </span>
        <div className="mapdetails_title">
          <h1>{currentMap.map_name}</h1>
        </div>
        <div className="mapdetails_middle">
          <div className="mapdetails_left">
            <img alt="" src={currentMap.map_img} />
            <MapTools
              style={{ width: "70%" }}
              isEdit={false}
              currentMap={currentMap}
            />
          </div>
          <div className="mapdetails_right">
            <MapComments />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDetails;
