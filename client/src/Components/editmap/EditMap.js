import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./editmap.css";
import { getMapAPI } from "../../api/map";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import mapboxgl from "mapbox-gl"; // Import mapboxgl
import optionsIcon from "../../assets/img/options.png";
import { Divider } from "semantic-ui-react";
import Dropdown from "react-dropdown";
import Checkbox from "@mui/material/Checkbox";
import { grey, blueGrey } from "@mui/material/colors";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Textarea from "@mui/joy/Textarea";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";

const EditMap = () => {
  const { id } = useParams();
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
  const [optionsMenuVisible, setOptionsMenuVisible] = useState(false);

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoieXVuYWhraW0iLCJhIjoiY2xtNTgybXd2MHdtMjNybnh6bXYweGNweiJ9.cfBakJXxub4ejba076E2Cw";

  const getMap = async () => {
    const data = await getMapAPI(id);
    setCurrentMap(data);

    if (currentMap != null) {
      let url = currentMap.file_path;
      let fileName = url.substring(57, url.indexOf("geojson") + 7).replaceAll('%20', ' ');
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

  const handleToggleOptions = (e) => {
    // e.stopPropagation();
    // setOptionsMenuVisible(!optionsMenuVisible);
  };

  const handleMapNameChange = (name) => {
    //setOptions({ ...options, name });
  };
  const handleMapDescriptionChange = (description) => {
    //setOptions({ ...options, description });
  };
  const handleTopicClick = (topic) => {
    // const newVal = topic.value;
    // setOptions({ ...options, topic: newVal });
  };
  const handleCustomTopic = (customTopic) => {
    // setOptions({ ...options, customTopic });
  };

  const handleTemplateClick = (template) => {
    // const newVal = template.value;

    // setOptions({ ...options, template: newVal });
  };
  const handleCircleHeatMapDataChange = (circleData) => {
    const newVal = circleData;
    setOptions({ ...options, circleHeatMapData: newVal });
  };
  const handlePrivacy = (e) => {
    // setOptions({ ...options, isPrivate: e.target.checked });
  };
  const topics = [
    "Economy",
    "Education",
    "Environmental",
    "Geography",
    "Health",
    "History",
    "Social",
    "Other",
  ];

  const templates = [
    "Bar Chart",
    "Circle Map",
    "Heat Map",
    "Pie Chart",
    "Thematic Map",
  ];
  const template = options["template"];
  const [mapImage, setMapImage] = useState(null);

  useEffect(() => {
    if (!isMapLoaded && id != undefined) {
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
    <div className="editmap_details">
      {currentMap && (
        <div className="editmap_details_container">
          <div className="editmap_left">
            <div className="addmapdata_left_sidebar">
              <div>
                <FormControl>
                  <h3>Map Name</h3>
                  <Input
                    value={options.name}
                    onChange={(e) => handleMapNameChange(e.target.value)}
                    name="map_name"
                    placeholder="Enter Map Name"
                  />
                </FormControl>
              </div>
              <div>
                <FormControl>
                  <h3>Description</h3>
                  <Textarea
                    value={options.description}
                    onChange={(e) => handleMapDescriptionChange(e.target.value)}
                    name="map_description"
                    placeholder="Enter Map Description"
                    minRows={4}
                    maxRows={4}
                    endDecorator={
                      <Typography level="body-xs" sx={{ ml: "auto" }}>
                        {/* {options.description.length} character(s) */}
                      </Typography>
                    }
                  />
                  <FormHelperText>Brief Description of the Map</FormHelperText>
                </FormControl>
              </div>

              <div>
                <h3>Topic</h3>
                <Dropdown
                  options={topics}
                  value={options.topic}
                  placeholder="Select Topic"
                  className=""
                  onChange={handleTopicClick}
                />

                {options.topic === "Other" && (
                  <Input
                    sx={{ marginTop: "0.5rem" }}
                    value={options.customTopic}
                    placeholder="Enter Custom Topic"
                    onChange={(e) => handleCustomTopic(e.target.value)}
                  />
                )}
                <h3>Templates</h3>
                <Dropdown
                  options={templates}
                  placeholder="Select Template"
                  className=""
                  onChange={handleTemplateClick}
                  value={options.template}
                />
              </div>

              <div>
                <h3>Visibility</h3>
                <FormControlLabel
                  value="private"
                  control={
                    <Checkbox
                      onChange={handlePrivacy}
                      sx={{
                        color: grey[800],
                        "&.Mui-checked": {
                          color: blueGrey[600],
                        },
                      }}
                    />
                  }
                  label="Private"
                  labelPlacement="end"
                  color="white"
                />
              </div>
            </div>
          </div>
          <div className="editmap_middle">
            <div className="editmap_name_options">
              <div className="editmap_name_topic">
                <div className="editmap_details_name">
                  <h1>{currentMap.map_name}</h1>
                </div>
                <div className="editmap_details_topic">
                  <h3>{currentMap.topic}</h3>
                </div>
                <div className="editmap_details_name" style={{ color: "#b8c5c9" }}>
                  <h5>Posted by {currentMap.user_id}</h5>
                </div>
              </div>
              <div className="editmap_options_icon">
                <img style={{ width: "30px", height: "30px" }} src={optionsIcon} onClick={handleToggleOptions} />
                {optionsMenuVisible && (
                  <div className="mappreview_options_menu">
                    <ul>
                      <li>Fork Map</li>
                      <Divider style={{ margin: "0" }} />
                      <li>Share Map</li>
                      <Divider style={{ margin: "0" }} />
                      <li>Export Map</li>
                      <Divider style={{ margin: "0" }} />
                      <li>Edit Map</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="editmap_map">
              <div ref={mapContainerRef} id="map" style={{ width: '800px', height: '500px', float: 'right' }} ></div>
            </div>
          </div>
          <div className="editmap_right">
            this is the right
          </div>
        </div>
      )}
    </div>
  );
};

export default EditMap;
