// import React, { useState, useEffect, useRef, useCallback } from "react";
// import ReactMapboxGL, { Source, Layer } from "react-map-gl";
// import * as shapefile from "shapefile"; // Import the shapefile library
// import JSZip from "jszip";
// import MapTool from "../maptools/MapTools";
// import Popup from "reactjs-popup";
// import { useNavigate } from "react-router-dom";
// import "reactjs-popup/dist/index.css";
// const MAPBOX_TOKEN =
//   "pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw";
// const DEFAULT_GEOJSON =
//   "https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson";

// const Step3 = ({ prevStep }) => {
//   const [viewport, setViewport] = useState({
//     width: "100vw",
//     height: "90vh",
//     latitude: 44.065256,
//     longitude: -125.075801,
//     zoom: 5,
//   });
//   const fileInput = useRef(null);
//   const [selectedMapFile, setSelectedMapFile] = useState(DEFAULT_GEOJSON);
//   const [fileName, setFileName] = useState("init.geojson");
//   const handleLoadMap = () => {
//     fileInput.current.click();
//   };

//   const handleMapChange = async (e) => {
//     try {
//       const file = e.target.files[0];
//       setFileName(file.name);

//       const texts = await file.text();

//       // uploadedFile -> type: json object
//       let uploadedFile;

//       if (file.name.endsWith(".json") || file.name.endsWith(".geojson")) {
//         uploadedFile = JSON.parse(texts);
//       } else if (file.name.endsWith(".kml")) {
//         var tj = require("./togeojson");
//         var kml = new DOMParser().parseFromString(texts, "text/xml");
//         uploadedFile = JSON.parse(JSON.stringify(tj.kml(kml), null, 4));
//       } else if (file.name.endsWith(".zip")) {
//         try {
//           const zip = new JSZip();
//           const zipContents = await zip.loadAsync(file); // Load the ZIP file asynchronously
//           // Find the .shp and .dbf files in the ZIP archive
//           let shpBuffer, dbfBuffer;
//           for (const fileName in zipContents.files) {
//             if (fileName.endsWith(".shp")) {
//               shpBuffer = await zipContents.files[fileName].async(
//                 "arraybuffer"
//               );
//             } else if (fileName.endsWith(".dbf")) {
//               dbfBuffer = await zipContents.files[fileName].async(
//                 "arraybuffer"
//               );
//             }
//           }
//           // Process shpBuffer and dbfBuffer here
//           // You can use a library like 'shapefile' to read the contents

//           const geojson = await shapefile.read(shpBuffer, dbfBuffer);
//           // console.log(geojson.features[0]);
//           for (const data in geojson.features) {
//             var i = 0;
//             var name = "NAME_";
//             for (i = 0; i < 10; i++) {
//               if (geojson.features[data].properties[name + i] === undefined) {
//                 i--;
//                 break;
//               }
//             }

//             geojson.features[data].properties.name =
//               geojson.features[data].properties[name + i];
//           }

//           uploadedFile = geojson;
//         } catch (error) {
//           // Handle any errors that may occur during file processing
//           console.error("Error processing the ZIP file:", error);
//         }
//       }
//       setSelectedMapFile(uploadedFile);
//     } catch (error) {
//       setSelectedMapFile(DEFAULT_GEOJSON);
//       console.log(error);
//     }
//   };

//   const [hoverInfo, setHoverInfo] = useState(null);
//   const onHover = useCallback((e) => {
//     const {
//       features,
//       point: { x, y },
//     } = e;
//     const hoveredFeature = features && features[0];
//     setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });
//   }, []);
//   // MAPBOX STATE-END
//   const [mapCreated, setMapCreated] = useState(true);
//   const navigate = useNavigate();
//   const handleAddMap = () => {
//     console.log("Add Map");
//   };
//   return (
//     <>
//       <div>
//         <span>{fileName}</span>
//         <button onClick={handleLoadMap}>Load Map</button>
//         <input
//           type="file"
//           id="mapFile"
//           ref={fileInput}
//           onChange={handleMapChange}
//           style={{ display: "none" }}
//           accept=".json, .geojson, .kml, .zip"
//         />
//       </div>
//       <div className="step3_maptools">
//         <MapTool />
//       </div>
//       <div className="mapbox">
//         <ReactMapboxGL
//           style={{ height: "inherit", width: "inherit" }}
//           initialViewState={{
//             longitude: -122.4,
//             latitude: 37.8,
//             zoom: 3,
//           }}
//           onViewportChange={setViewport}
//           mapStyle="mapbox://styles/mapbox/outdoors-v11"
//           mapboxAccessToken={MAPBOX_TOKEN}
//         >
//           {selectedMapFile && (
//             <Source
//               id="geoSource"
//               type="geojson"
//               generateId={true}
//               data={selectedMapFile}
//             >
//               <Layer
//                 type="fill"
//                 source="geoSource"
//                 paint={{
//                   "fill-color": "#0080ff",
//                   "fill-opacity": 0.4,
//                   "fill-outline-color": "#000000",
//                 }}
//               />
//               <Layer
//                 type="symbol"
//                 source="geoSource"
//                 layout={{
//                   "text-field": ["get", "name"],
//                 }}
//               />
//               <Layer
//                 id="outline"
//                 type="line"
//                 source="geoSource"
//                 paint={{
//                   "line-color": "#000",
//                   "line-width": 3,
//                 }}
//               />
//             </Source>
//           )}
//         </ReactMapboxGL>
//         <div className="btn_container">
//           {/* <button onClick={prevStep} className="before_btn">
//             Go Back
//           </button> */}
//           <Popup
//             trigger={<button className="next_btn">Add Map</button>}
//             modal
//             nested
//             closeOnDocumentClick={false}
//             closeOnEscape={false}
//           >
//             {(close) => (
//               <div className="create_map_modal">
//                 {mapCreated ? (
//                   <div className="create_map_modal_content">
//                     <h3> Map Successfully Created! Explore Other Maps!</h3>
//                   </div>
//                 ) : (
//                   <div>Error Creating Map</div>
//                 )}
//                 <div>
//                   <button onClick={() => navigate("/mainpage")}>
//                     Go to MainPage
//                   </button>
//                 </div>
//               </div>
//             )}
//           </Popup>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Step3;
// Try2
import React, { useEffect, useRef, useState } from "react";
import ReactMapGL, { Source, Layer } from "react-map-gl";
import mapboxgl from "mapbox-gl"; // Import mapboxgl
import "./mapbox/mapbox.css";
import uk from "./mapbox/uk.geojson";

const Step3 = ({ selectedMapFile }) => {
  const DEFAULT_GEOJSON =
    "https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/california.geojson";
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

  // const mapboxStyle = {
  //   position: "absolute",
  //   // top: 0,
  //   bottom: 0,
  //   left: 0,
  //   width: "80%",
  //   height: "70%",
  // };
  const mapContainerRef = useRef(null);
  useEffect(() => {
    console.log(selectedMapFile);
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
        // console.log(e);
        const bbox = [
          [e.point.x, e.point.y],
          [e.point.x, e.point.y],
        ];

        const selectedFeatures = map.queryRenderedFeatures(bbox, {
          layers: ["counties"],
        });

        const names = selectedFeatures.map(
          (feature) => feature.properties.name
        );
        console.log("fips: ", names);
        map.setFilter("counties-highlighted", ["in", "name", ...names]);
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
    <div className="mapbox">
      <div
        ref={mapContainerRef}
        style={{ height: "inherit", width: "inherit" }}
        // style={mapboxStyle}
      >
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
    </div>
  );
};

export default Step3;
