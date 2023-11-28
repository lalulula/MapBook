import React, { useEffect, useRef, useState } from "react";
import ReactMapGL, { Source, Layer } from "react-map-gl";
import mapboxgl from "mapbox-gl"; // Import mapboxgl
import "./mapbox/mapbox.css";

const Step3 = ({ selectedMapFile }) => {
  const [lng, setLng] = useState(-122.48);
  const [lat, setLat] = useState(37.84);
  const [zoom, setZoom] = useState(12);
  const [showModalThematic, setShowModalThematic] = useState(false);
  const [showModalBar, setShowModalBar] = useState(false);
  const [showModalPie, setShowModalPie] = useState(false);
  const [showModalCircle, setShowModalCircle] = useState(false);
  const [showModalHeat, setShowModalHeat] = useState(false);
  const [feature, setFeature] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [mapInformation, setMapInformation] = useState({
    mapbook_mapname: "",
    mapbook_template: "",
    mapbook_topic: "",
    mapbook_customtopic: "",
    mapbook_visibility: false,
    mapbook_datanames: [],
    mapbook_heatrange: {},
    mapbook_heat_selectedcolors: [],
    mapbook_themedata: [],
  });

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw";

  const handleClickRegion = () => {
    if (selectedMapFile["mapbook_template"] === "Bar Chart")
      setShowModalBar(!showModalBar);
    else if (selectedMapFile["mapbook_template"] === "Thematic Map")
      setShowModalThematic(!showModalThematic);
  };

  useEffect(() => {
    setMapInformation({
      mapbook_mapname: selectedMapFile["mapbook_mapname"],
      mapbook_template: selectedMapFile["mapbook_template"],
      mapbook_topic: selectedMapFile["mapbook_topic"],
      mapbook_customtopic: selectedMapFile["mapbook_customtopic"],
      mapbook_visibility: selectedMapFile["mapbook_visibility"],
      mapbook_datanames: selectedMapFile["mapbook_datanames"],
      mapbook_heatrange: selectedMapFile["mapbook_heatrange"],
      mapbook_heat_selectedcolors:
        selectedMapFile["mapbook_heat_selectedcolors"],
      mapbook_themedata: selectedMapFile["mapbook_themedata"],
    });
  }, []);
  useEffect(() => {
    console.log(mapInformation);
    console.log(selectedMapFile);
  }, [mapInformation]);

  const handleAddData = (e) => {
    e.preventDefault();
    console.log(
      "selectedmapfile specific: ",
      selectedMapFile["features"].filter((m) => m === feature)
    );
    console.log("feature in handleadddata: ", feature);
    feature[0]["properties"]["mapbook_data"] = { data_value: inputData };
    handleClickRegion();
  };

  const mapContainerRef = useRef(null);
  useEffect(() => {
    // console.log(selectedMapFile);
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
      console.log("selectedMapFile: ", selectedMapFile);
      map.addSource("counties", {
        type: "geojson",
        // data: "https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/california.geojson"
        data: selectedMapFile,
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
          // "source-layer": "original",
          paint: {
            // "fill-color": "rgba(0.5,0.5,0,0.4)",
            "fill-color": "#ff0088",
            "fill-opacity": 0.4,
            "fill-outline-color": "#000000",
            // "fill-outline-opacity": 0.8
          },
        }
        // "building"
      );

      map.addLayer(
        {
          id: "counties-highlighted",
          type: "fill",
          source: "counties",
          // "source-layer": "original",
          paint: {
            "fill-outline-color": "#484896",
            "fill-color": "#6e599f",
            "fill-opacity": 0.75,
          },
          filter: ["in", "name", ""],
        }
        // "building"
      );

      map.on("click", (e) => {
        console.log(e);
        const bbox = [
          [e.point.x, e.point.y],
          [e.point.x, e.point.y],
        ];

        const selectedFeatures = map.queryRenderedFeatures(bbox, {
          layers: ["counties"],
        });

        // TODO: modify datas
        // check code below.
        // console.log("selectedFeatures: ", selectedFeatures[0])
        // selectedFeatures[0]["properties"]["mapbook_data"] = { data_value: 1 }
        console.log("selectedFeatures: after modify: ", selectedFeatures[0]);

        setFeature(selectedFeatures);

        const names = selectedFeatures.map(
          (feature) => feature.properties.name
        );
        console.log("fips: ", names);
        map.setFilter("counties-highlighted", ["in", "name", ...names]);
        handleClickRegion();
      });

      // // Add a click event listener to the map
      // map.on('click', 'your-geojson-layer', (e) => {
      //   // Handle the click event here
      //   console.log("event e: ", e)

      //   const feature = e.features[0];
      //   console.log('Clicked feature:', feature);
      // });
    });
  }, []);

  return (
    <div className="step3_container">
      <div
        ref={mapContainerRef}
        id="map"
        // style={mapboxStyle}
        style={{ height: "inherit", width: "inherit" }}
      >
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        {showModalThematic && (
          <div className="add_map_data_modal">
            <div
              className="close_add_map_data_modal"
              onClick={handleClickRegion}
            >
              close
            </div>
            <form onSubmit={handleAddData}>
              <label>
                data:
                <input
                  type="text"
                  /* value={newComment} */
                  onChange={(e) => setInputData(e.target.value)}
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
        {showModalBar && (
          <div className="add_map_data_modal">
            <div
              className="close_add_map_data_modal"
              onClick={handleClickRegion}
            >
              close
            </div>
            <form onSubmit={handleAddData}>
              <label>
                data for bar:
                <input
                  type="text"
                  /* value={newComment} */
                  onChange={(e) => setInputData(e.target.value)}
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3;
