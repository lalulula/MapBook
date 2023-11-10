import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import data from "../main/dum_data.json";
import "./mapdetails.css";
import Comments from "../comments/Comments";

const MapDetails = () => {
    const [user, setUser] = useState(null);
    const { id } = useParams();
    //will make an api call to get the id of a map

    return (
        <div className="map_details">
            <div className="map_details_container">
                <div className="title">
                    <h1>TITLE</h1>
                </div>
                <div className="middle">
                    <div className="left">
                        <img src="/img/dum.jpg"></img>
                    </div>
                    <div className="right">
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