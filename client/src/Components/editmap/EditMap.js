import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./editmap.css";
import MapTools from "../maptools/MapTools";
import Header from "../header/Header";
import { getMapAPI } from "../../api/map";
import Map from "../createmap/Map";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import mapboxgl from "mapbox-gl"; // Import mapboxgl


const EditMap = () => {
  const { mapId } = useParams();
  console.log("MAP ID IN EDIT: ", mapId);
  const [currentMap, setCurrentMap] = useState(null);
  const [options, setOptions] = useState({});
  const [pieBarData, setPieBarData] = useState([""]); //data names for pie & bar
  const [themeData, setThemeData] = useState([{ dataName: "", color: "#000" }]); //Theme: color and dataname
  const [selectedColors, setSelectedColors] = useState([]); //HEATMAP: color for each range
  const [heatRange, setHeatRange] = useState({ from: 0, to: 0 }); //HEATMAP: range value
  const [importDataOpen, setImportDataOpen] = useState(true);
  const [showMapEdit, setShowMapEdit] = useState(false);
  const [test, setTest] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [lng, setLng] = useState(-122.48);
  const [lat, setLat] = useState(37.84);
  const [zoom, setZoom] = useState(3);
  const [hoverData, setHoverData] = useState("Out of range");
  const [selectedMapFile, setSelectedMapFile] = useState();
  const MAPBOX_TOKEN =
    "pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw";

  // const [selectedMapFile, setSelectedMapFile] = useState(null);

  /* useEffect(() => {
    // console.log("useEffect: selectedMapFile: ", selectedMapFile);
    const newGeojsonData = {
      ...selectedMapFile,
      mapbook_mapname: options.name,
      mapbook_description: options.description,
      mapbook_template: options.template,
      mapbook_circleheatmapdata: options.circleHeatMapData,
      mapbook_topic: options.topic,
      mapbook_customtopic: options.customTopic,
      mapbook_visibility: options.isPrivate,
      mapbook_datanames: pieBarData, //piebar
      mapbook_heatrange: heatRange, // heat range
      mapbook_heat_selectedcolors: selectedColors, // heat color
      mapbook_themedata: themeData, //Color + data name
    };
    setSelectedMapFile(newGeojsonData);
  }, [options, pieBarData, heatRange, selectedColors, themeData]); */

  const getMap = async () => {
    const data = await getMapAPI(mapId);
    setCurrentMap(data);

    if (currentMap != null) {
      let url = currentMap.file_path;
      // get file name from url
      let fileName = url.substring(57, url.indexOf("geojson") + 7).replaceAll('%20', ' ');
      // console.log(fileName)
      getDownloadURL(ref(storage, fileName))
        .then((url) => {

          // This can be downloaded directly:
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'json';
          xhr.onload = (event) => {
            // console.log("response: ", xhr.response);
            setSelectedMapFile(xhr.response)
          };
          xhr.open('GET', url);
          xhr.send();
        })
        .catch((error) => {
          console.log("error: ", error)
        });
      setIsMapLoaded(true);
    }
  };

  useEffect(() => {
    if (!isMapLoaded && mapId != undefined) {
      getMap();
    }
  }, [currentMap]);

  const mapContainerRef = useRef(null);

  useEffect(() => {
    console.log("selectedMapFile: useEffect: ", selectedMapFile);
    let map;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    if (mapContainerRef.current) {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
        preserveDrawingBuffer: true,
      });
    }
    if (map != null) {


      map.on("idle", function () {
        map.resize();
      });

      map.on("move", () => {
        setLng(map.getCenter().lng.toFixed(4));
        setLat(map.getCenter().lat.toFixed(4));
        setZoom(map.getZoom().toFixed(2));
      });

      map.on("load", () => {

        map.addSource("counties", {
          type: "geojson",
          data: selectedMapFile,
        });

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

        map.addLayer({
          id: "data-labels",
          type: "symbol",
          source: "counties",
          layout: {
            "text-field": ["get", "name"],
            "text-size": 15,
          },
        });


        map.on("mousemove", (event) => {
          const regions = map.queryRenderedFeatures(event.point, {
            layers: ["counties"],
          });

          if (regions.length > 0) {
            const tempFeature = selectedMapFile["features"].find(
              (m) => m["properties"].name === regions[0]["properties"].name
            );
            //console.log("tempFeature: ", tempFeature);
            var data = tempFeature["properties"].mapbook_data;
            if (data === undefined) {
              setHoverData("No data");
            } else {
              setHoverData(
                JSON.stringify(tempFeature["properties"].mapbook_data)
              );
            }
          }
        });
      });
    }
  }, [selectedMapFile]);

  return (
    <div className="editmap">
      {currentMap && (
        <div className="editmap_container">
          <div className="editmap_title">
            <h1>{currentMap.map_name}</h1>
          </div>
          <MapTools style={{ width: "70%" }} isEdit={true} />
          {/* <div className="editmap_map">
            <Map selectedMapFile={currentMap} options={options} setOptions={setOptions} setSelectedMapFile={setSelectedMapFile} pieBarData={currentMap.datanames} />
          </div> */}
        </div>
      )}

    </div>
  );
};

export default EditMap;
