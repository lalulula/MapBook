import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import data from "../main/dum_data.json";
import "./mapdetails.css";
import Comments from "../comments/Comments";

const MapDetails = () => {
    const [user, setUser] = useState(null);
    const { id } = useParams();
    const [currentMap, setCurrentMap] = useState({});
    //will make an api call to get the id of a map
    const curr = data.filter((obj) => obj._id == id);

    useEffect(() => {
        setCurrentMap(curr[0])
    }, []);

    return (
        <div className="map_details">
            <div className="map_details_container">
                <div className="mapdetails_title">
                    <h1>{currentMap.map_name}</h1>
                </div>
                <div className="mapdetails_middle">
                    <div className="mapdetails_left">
                        <img src={currentMap.map_img}></img>
                    </div>
                    <div className="mapdetails_right">
                        <Comments />
                    </div>
                </div>
                <div className="toolbar">
                    <div className="likes">like</div>
                    <div className="comments">comment</div>
                    <div className="fork">fork</div>
                    <div className="export">export</div>
                    <div className="share">share</div>
                </div>
            </div>

        </div>
    )
}

export default MapDetails;