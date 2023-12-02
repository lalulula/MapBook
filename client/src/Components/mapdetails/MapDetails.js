import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Dropdown, Divider } from "semantic-ui-react";

import "./mapdetails.css";
import MapTools from "../maptools/MapTools";
import MapComments from "../comments/MapComments";
import { getMapAPI } from "../../api/map";
import options_icon from "../../assets/img/options.png"

export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

const options = [
  { key: 1, text: 'Fork map', value: 1 },
  { key: 2, text: 'Export map', value: 2 },
  { key: 3, text: 'Share map', value: 3 },
  { key: 4, text: 'Edit map', value: 4 },
]

const MapDetails = () => {
  const { mapId } = useParams();
  const [currentMap, setCurrentMap] = useState(null);
  const navigate = useNavigate();

  const getMap = async () => {
    const data = await getMapAPI(mapId);
    setCurrentMap(data);
  };

  useEffect(() => {
    getMap();
  }, [currentMap]);

  if (!currentMap) {
    return (
      <></>
    )
  } else {
    return (
      <div className="map_details">
        <div className="map_details_container">
          <div className="name_options">
            <div className="name_topic">
              <div className="map_details_name">
                <h1>{currentMap.map_name}</h1>
              </div>
              <div className="map_details_topic">
                <h3>{currentMap.topic}</h3>
              </div>
            </div>
            {/* <div className="map_details_options">
              <img src={options}></img>
            </div> */}
            <Menu compact>
              <Dropdown
                options={options}
                simple
                item 
                icon="ellipsis horizontal"
                style={{
                  padding: "0 5px 0 10px",
                  // color: "whitesmoke",
                  // backgroundColor: "#5C5CFF",
                  // // borderRadius: "5px"
                }} 
              />
            </Menu>
          </div>
          <div className="map_image_comments">
            <div className="map_details_image"></div>
            <div className="map_details_comments"></div>
          </div>
          <Divider section inverted style={{margin: "20px 0"}}/>
          <div className="tools">
            <MapTools />
          </div>
        </div>
      </div>
    );
  };
};

export default MapDetails;
