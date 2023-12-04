import { useState, useEffect, useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Dropdown, Divider } from "semantic-ui-react";

import "./mapdetails.css";
import MapTools from "../maptools/MapTools";
import MapComments from "../comments/MapComments";
import { getMapAPI } from "../../api/map";
import options_icon from "../../assets/img/options.png"

import mapboxgl from "mapbox-gl"; // Import mapboxgl


export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

const options = [
  { key: 1, text: 'Fork map', value: 1 },
  { key: 2, text: 'Export map', value: 2 },
  { key: 3, text: 'Share map', value: 3 },
  { key: 4, text: 'Edit map', value: 4 },
]

const MapDetails = () => {
  const { mapId } = useParams();
  const [currentMap, setCurrentMap] = useState(null);
  const navigate = useNavigate();


  const MAPBOX_TOKEN =
    "pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw";
  const [lng, setLng] = useState(-122.48);
  const [lat, setLat] = useState(37.84);
  const [zoom, setZoom] = useState(3);
  const [hoverData, setHoverData] = useState("Out of range");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedMapFile, setSelectedMapFile] = useState();

  const getMap = async () => {
    console.log("getMap called")
    const data = await getMapAPI(mapId);
    setCurrentMap(data);


    if(currentMap != null){
      let url = currentMap.file_path;
      url = url.replaceAll("&", "&amp;")
      console.log(url)
      // let url = "https://storage.googleapis.com/mapbook-6abbc.appspot.com/PIEBAR%20TEST.geojson"
      let settings = { 
        mode: 'cors', 
        method: "GET", 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
      const res = await fetch(url, settings)
      console.log("res: ", res.text())
      // var json = await res.json();
     


      // console.log("json: ", json)
      
      // setSelectedMapFile()
      setIsMapLoaded(true);
    }
  };

  //////////////////////////////////////////
  
  // const mapContainerRef = useRef(null);

  // useEffect(() => {
  //   let map;

  //   mapboxgl.accessToken = MAPBOX_TOKEN;
  //   if (mapContainerRef.current) {
  //     map = new mapboxgl.Map({
  //       container: mapContainerRef.current,
  //       style: "mapbox://styles/mapbox/streets-v12",
  //       center: [lng, lat],
  //       zoom: zoom,
  //       preserveDrawingBuffer: true,
  //     });
  //   }

  //   map.on("idle", function () {
  //     map.resize();
  //   });
  //   map.on("move", () => {
  //     setLng(map.getCenter().lng.toFixed(4));
  //     setLat(map.getCenter().lat.toFixed(4));
  //     setZoom(map.getZoom().toFixed(2));
  //   });

  //   map.on("load", () => {

  //     map.addSource("counties", {
  //       type: "geojson",
  //       data: currentMap.file,
  //     });

  //     map.addLayer(
  //       {
  //         id: "counties",
  //         type: "fill",
  //         source: "counties",
  //         // "source-layer": "original",
  //         paint: {
  //           // "fill-color": "rgba(0.5,0.5,0,0.4)",
  //           "fill-color": "#ff0088",
  //           "fill-opacity": 0.4,
  //           "fill-outline-color": "#000000",
  //           // "fill-outline-opacity": 0.8
  //         },
  //       }
  //       // "building"
  //     );

  //     map.addLayer(
  //       {
  //         id: "counties-highlighted",
  //         type: "fill",
  //         source: "counties",
  //         // "source-layer": "original",
  //         paint: {
  //           "fill-outline-color": "#484896",
  //           "fill-color": "#6e599f",
  //           "fill-opacity": 0.75,
  //         },
  //         filter: ["in", "name", ""],
  //       }
  //       // "building"
  //     );

  //     map.addLayer({
  //       id: "data-labels",
  //       type: "symbol",
  //       source: "counties",
  //       layout: {
  //         "text-field": ["get", "name"],
  //         "text-size": 15,
  //       },
  //     });

  //     // map.on("click", (e) => {
  //     //   // console.log("this is e: ", e);
  //     //   const bbox = [
  //     //     [e.point.x, e.point.y],
  //     //     [e.point.x, e.point.y],
  //     //   ];

  //     //   const selectedFeatures = map.queryRenderedFeatures(bbox, {
  //     //     layers: ["counties"],
  //     //   });

  //     //   const names = selectedFeatures.map(
  //     //     (feature) => feature.properties.name
  //     //   );

  //     //   const newSelectedFeature = selectedMapFile["features"].filter(
  //     //     (f) => f["properties"].name === names[0]
  //     //   );

  //     //   setFeature(newSelectedFeature);

  //     //   setRegionName(names[0]);
  //     //   map.setFilter("counties-highlighted", ["in", "name", ...names]);
  //     //   handleClickRegion();
  //     // });

  //     map.on("mousemove", (event) => {
  //       const regions = map.queryRenderedFeatures(event.point, {
  //         layers: ["counties"],
  //       });

  //       if (regions.length > 0) {
  //         const tempFeature = selectedMapFile["features"].find(
  //           (m) => m["properties"].name === regions[0]["properties"].name
  //         );
  //         //console.log("tempFeature: ", tempFeature);
  //         var data = tempFeature["properties"].mapbook_data;
  //         if (data === undefined) {
  //           setHoverData("No data");
  //         } else {
  //           setHoverData(
  //             JSON.stringify(tempFeature["properties"].mapbook_data)
  //           );
  //         }
  //       }
  //     });
  //   });
  // }, []);

  /////////////////////////////////////////

  useEffect(() => {
    if(!isMapLoaded){
      getMap();
    }
  }, [currentMap]);

  if (!currentMap) {
    return (
      <></>
    )
  } else {
    return (
      <div className="map_details">
        <div className="map_details_container">
          <div className="name_options">
            <div className="name_topic">
              <div className="map_details_name">
                <h1>{currentMap.map_name}</h1>
              </div>
              <div className="map_details_topic">
                <h3>{currentMap.topic}</h3>
              </div>
            </div>
            <Menu compact>
              <Dropdown
                options={options}
                simple
                item 
                icon="ellipsis horizontal"
                style={{
                  padding: "0 5px 0 10px",
                }} 
              />
            </Menu>
          </div>
          <div className="map_image_comments">
            <div className="map_details_image"></div>
            <div className="map_details_comments"></div>
          </div>
          <Divider section inverted style={{margin: "20px 0"}}/>
          <div className="tools">
            <MapTools
              isEdit={false}
              currentMap={currentMap}
            />
          </div>
        </div>
      </div>
    );
  };
};

export default MapDetails;
