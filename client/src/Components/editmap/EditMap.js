import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import "./editmap.css";
import MapTools from "../maptools/MapTools";
import data from "../main/dum_data.json";
import Header from "../header/Header";

const EditMap = () => {
  const { id } = useParams();
  const [currentMap, setCurrentMap] = useState({});
  const curr = data.filter((obj) => obj._id == id);

  useEffect(() => {
    setCurrentMap(curr[0])
  }, []);

  console.log(currentMap);

  return (
    <div className="edit_map">
      <div className="title">
        <h1>{currentMap.map_name}</h1>
      </div>
      <MapTools style={{width: "70%"}} isEdit={true}/>
      <div className="map">
        <img src={currentMap.map_img}></img>
      </div>
    </div>
  )
}

export default EditMap;