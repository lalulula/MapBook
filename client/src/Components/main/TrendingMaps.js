import React, { useEffect, useState } from "react";
import "./trendingmap.css";
import { useNavigate } from "react-router-dom";

const TrendingMaps = ({ trendingMaps }) => {
  const [mapHovered, setMapHovered] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(trendingMaps);
  }, [trendingMaps]);

  if (!trendingMaps) {
    return null;
  }

  const repeatedMaps = Array.from({ length: trendingMaps.length }, () => [
    ...trendingMaps,
  ]).flat();
  const handleShowMapDetail = (id) => {
    navigate(`/mapdetails/${id}`);
  };

  return (
    <div className="slider">
      <div className="slide_track">
        {repeatedMaps.map((map, index) => (
          <div
            className="slide"
            key={index}
            onMouseEnter={() => setMapHovered(index)}
            onMouseLeave={() => setMapHovered(null)}
          >
            <img
              className={mapHovered === index ? "hoveredImage" : ""}
              src={map.mapPreviewImg}
              alt={`Map ${index + 1}`}
            />
            {mapHovered === index && (
              <div
                className="trendingmap_preview"
                onClick={() => handleShowMapDetail(map._id)}
              >
                <div>
                  <span className="trending_mapname">{map.map_name}</span>
                  <br />
                  <span className="trending_maptopic">{map.topic}</span>
                  <br />
                  <span className="trending_mapdescription">
                    by {map.map_description}
                  </span>
                </div>
                <div>
                  <div className="trending_likes_views">
                    <i className="bi bi-heart" /> &nbsp;
                    {map.map_users_liked.length} &nbsp;
                    <i className="bi bi-eye" /> &nbsp;
                    {map.view_count}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingMaps;
