import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactMapboxGL, { Source, Layer } from "react-map-gl";
import * as shapefile from "shapefile"; // Import the shapefile library
import JSZip from "jszip";
import MapTool from "../maptools/MapTools";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useNavigate } from "react-router-dom";
const MAPBOX_TOKEN =
  "pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw";
const DEFAULT_GEOJSON =
  "https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson";

const Step3 = ({ prevStep }) => {
  // MAPBOX STATE-BEGIN
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "90vh",
    latitude: 44.065256,
    longitude: -125.075801,
    zoom: 5,
  });
  const fileInput = useRef(null);
  const [selectedMapFile, setSelectedMapFile] = useState(DEFAULT_GEOJSON);
  const [fileName, setFileName] = useState("init.geojson");
  const handleLoadMap = () => {
    fileInput.current.click();
  };

  const handleMapChange = async (e) => {
    try {
      const file = e.target.files[0];
      setFileName(file.name);

      const texts = await file.text();

      // uploadedFile -> type: json object
      let uploadedFile;

      if (file.name.endsWith(".json") || file.name.endsWith(".geojson")) {
        uploadedFile = JSON.parse(texts);
      } else if (file.name.endsWith(".kml")) {
        var tj = require("./togeojson");
        var kml = new DOMParser().parseFromString(texts, "text/xml");
        uploadedFile = JSON.parse(JSON.stringify(tj.kml(kml), null, 4));
      } else if (file.name.endsWith(".zip")) {
        try {
          const zip = new JSZip();
          const zipContents = await zip.loadAsync(file); // Load the ZIP file asynchronously
          // Find the .shp and .dbf files in the ZIP archive
          let shpBuffer, dbfBuffer;
          for (const fileName in zipContents.files) {
            if (fileName.endsWith(".shp")) {
              shpBuffer = await zipContents.files[fileName].async(
                "arraybuffer"
              );
            } else if (fileName.endsWith(".dbf")) {
              dbfBuffer = await zipContents.files[fileName].async(
                "arraybuffer"
              );
            }
          }
          // Process shpBuffer and dbfBuffer here
          // You can use a library like 'shapefile' to read the contents

          const geojson = await shapefile.read(shpBuffer, dbfBuffer);
          // console.log(geojson.features[0]);
          for (const data in geojson.features) {
            var i = 0;
            var name = "NAME_";
            for (i = 0; i < 10; i++) {
              if (geojson.features[data].properties[name + i] === undefined) {
                i--;
                break;
              }
            }

            geojson.features[data].properties.name =
              geojson.features[data].properties[name + i];
          }

          uploadedFile = geojson;
        } catch (error) {
          // Handle any errors that may occur during file processing
          console.error("Error processing the ZIP file:", error);
        }
      }
      setSelectedMapFile(uploadedFile);
    } catch (error) {
      setSelectedMapFile(DEFAULT_GEOJSON);
      console.log(error);
    }
  };
  const [hoverInfo, setHoverInfo] = useState(null);
  const onHover = useCallback((e) => {
    const {
      features,
      point: { x, y },
    } = e;
    const hoveredFeature = features && features[0];
    setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });
  }, []);

  // MAPBOX STATE-END
  const [mapCreated, setMapCreated] = useState(true);
  const navigate = useNavigate();
  return (
    <>
      <div>
        <span>{fileName}</span>
        <button onClick={handleLoadMap}>Load Map</button>
        <input
          type="file"
          id="mapFile"
          ref={fileInput}
          onChange={handleMapChange}
          style={{ display: "none" }}
          accept=".json, .geojson, .kml, .zip"
        />
      </div>
      <MapTool />
      <div className="mapbox">
        <ReactMapboxGL
          initialViewState={{
            longitude: -122.4,
            latitude: 37.8,
            zoom: 3,
          }}
          onViewportChange={setViewport}
          mapStyle="mapbox://styles/mapbox/outdoors-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {selectedMapFile && (
            <Source
              id="geoSource"
              type="geojson"
              generateId={true}
              data={selectedMapFile}
            >
              <Layer
                type="fill"
                source="geoSource"
                paint={{
                  "fill-color": "#0080ff",
                  "fill-opacity": 0.4,
                  "fill-outline-color": "#000000",
                }}
              />
              <Layer
                type="symbol"
                source="geoSource"
                layout={{
                  "text-field": ["get", "name"],
                }}
              />
              <Layer
                id="outline"
                type="line"
                source="geoSource"
                paint={{
                  "line-color": "#000",
                  "line-width": 3,
                }}
              />
            </Source>
          )}
        </ReactMapboxGL>

        <button onClick={prevStep} className="before_btn">
          Back To Step2
        </button>
        <Popup
          trigger={<button className="next_btn">Add Map</button>}
          modal
          nested
        >
          {(close) => (
            <div className="create_map_modal">
              {mapCreated ? (
                <div className="create_map_modal_content">
                  Map Successfully Created! Explore Other Maps
                </div>
              ) : (
                <div>Error Creating Map</div>
              )}
              <div>
                <button onClick={() => navigate("/mainpage")}>
                  Go to MainPage
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </>
  );
};

export default Step3;
