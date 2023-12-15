import React, { useEffect, useState } from "react";
import "./trendingmap.css";

const TrendingMaps = ({ trendingMaps }) => {
  useEffect(() => {
    console.log(trendingMaps);
  });

  const [mapHovered, setMapHovered] = useState(null);

  if (!trendingMaps) {
    return null;
  }
  const repeatedMaps = Array.from({ length: trendingMaps.length }, () => [
    ...trendingMaps,
  ]).flat();

  return (
    <div className="slider">
      <div className="slide_track">
        {repeatedMaps.map((map, index) => (
          <div
            className="slide"
            key={index}
            onMouseEnter={() => setMapHovered(true)}
            onMouseLeave={() => setMapHovered(false)}
          >
            <img
              className={mapHovered && "hoveredImage"}
              src={map.mapPreviewImg}
              alt={`Map ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingMaps;
