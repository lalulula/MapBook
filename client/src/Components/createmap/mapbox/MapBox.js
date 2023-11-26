import React, { useEffect, useRef, useState } from "react";
import ReactMapGL, { Source, Layer } from "react-map-gl";
import mapboxgl from "mapbox-gl"; // Import mapboxgl
import "./mapbox.css";
import uk from './uk.geojson'


const MapBox = () => {
  const DEFAULT_GEOJSON = "https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/california.geojson";
  const [lng, setLng] = useState(-122.48);
  const [lat, setLat] = useState(37.84);
  const [zoom, setZoom] = useState(12);
  const [viewport, setViewport] = useState({
    latitude: 38.88,
    longitude: -98,
    zoom: 3,
  });
  const MAPBOX_TOKEN =
    "pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw";

  const mapboxStyle = {
    position: "absolute",
    // top: 0,
    bottom: 0,
    left: 0,
    width: "80%",
    height: "70%",
  };
  const mapContainerRef = useRef(null);
  useEffect(() => {
    let map;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    if (mapContainerRef.current) {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
      });
    }
    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    map.on("load", () => {
      map.addSource("counties", {
        type: "vector",
        //url: "mapbox://mapbox.82pkq93d",
        url: DEFAULT_GEOJSON
      });

      // TODO : We need to import a geojson file here, not a url,
      // TODO)... but somehow the url gets called even though the datatype is a geojson
      // map.on("load", () => {
      //   // Add a new source for the geojson file
      //   map.addSource("geojson-data", {
      //     type: "geojson",
      //     data: geojson,
      //   });
      // });

      map.addLayer(
        {
          id: "counties",
          type: "fill",
          source: "counties",
          "source-layer": "original",
          paint: {
            "fill-outline-color": "rgba(0,0,0,0.1)",
            "fill-color": "rgba(0,0,0,0.1)",
          },
        },
        "building"
      );

      map.addLayer(
        {
          id: "counties-highlighted",
          type: "fill",
          source: "counties",
          "source-layer": "original",
          paint: {
            "fill-outline-color": "#484896",
            "fill-color": "#6e599f",
            "fill-opacity": 0.75,
          },
          filter: ["in", "FIPS", ""],
        },
        "building"
      );

      // map.on("click", (e) => {
      //   console.log(e);
      //   const bbox = [
      //     [e.point.x - 5, e.point.y - 5],
      //     [e.point.x + 5, e.point.y + 5],
      //   ];

      //   const selectedFeatures = map.queryRenderedFeatures(bbox, {
      //     layers: ["counties"],
      //   });

      //   const fips = selectedFeatures.map((feature) => feature.properties.FIPS);

      //   map.setFilter("counties-highlighted", ["in", "FIPS", ...fips]);
      // });

      // Add a click event listener to the map
      map.on('click', 'your-geojson-layer', (e) => {
        // Handle the click event here
        const feature = e.features[0];
        console.log('Clicked feature:', feature);
      });
    });
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} id="map" style={mapboxStyle}>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
    </div>
  );
};

export default MapBox;