import React, { useState } from "react";
import JSZip from "jszip";
import * as shapefile from "shapefile";
import { useSelector } from "react-redux";
import { FileInput, Label } from "flowbite-react";
import { useNavigate } from "react-router-dom";

function ImportFilePage({
  setSelectedMapFile,
  setImportDataOpen,
  isMapbookData,
  setIsMapbookData,
}) {
  const [backgroundColor, setBackgroundColor] = useState("fff");
  const [textColor, setTextColor] = useState("rgba(128, 128, 128)");
  const [createTextColor, setCreateTextColor] = useState("rgba(128, 128, 128)");
  const [cursor, setCursor] = useState("auto");
  const [selectedFile, setSelectedFile] = useState(null);
  const userId = useSelector((state) => state.user.id);
  const navigate = useNavigate();
  const processFile = async (file) => {
    try {
      const texts = await file.text();
      let parsedData;

      if (file.name.endsWith(".json") || file.name.endsWith(".geojson")) {
        parsedData = JSON.parse(texts);
      } else if (file.name.endsWith(".kml")) {
        var tj = require("./togeojson");
        var kml = new DOMParser().parseFromString(texts, "text/xml");
        parsedData = JSON.parse(JSON.stringify(tj.kml(kml), null, 4));
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
          for (const data in geojson.features) {
            var i = 0;

            var name = "NAME_";

            for (i = 0; i < 10; i++) {
              if (geojson.features[data].properties[name + i] === undefined) {
                i--;
                break;
              }
            }
            var feature_name = geojson.features[data].properties[name + i];

            const keys = Object.keys(geojson.features[data].properties);

            for (let j = 0; j < keys.length; j++) {
              delete geojson.features[data].properties[keys[j]];
            }

            geojson.features[data].properties["name"] = feature_name;
          }

          parsedData = geojson;
        } catch (error) {
          // Handle any errors that may occur during file processing
          console.error("Error processing the ZIP file:", error);
        }
      }
      // Check if the "template" key exists at the top level
      if ("mapbook_template" in parsedData) {
        setSelectedMapFile(parsedData);
        setIsMapbookData(true);
      } else {
        const newGeojsonData = {
          ...parsedData,
          mapbook_mapname: "",
          mapbook_description: "",
          mapbook_template: "",
          mapbook_circleheatmapdata: "",
          mapbook_topic: "",
          mapbook_customtopic: "",
          mapbook_visibility: "",
          mapbook_datanames: [], //piebar
          mapbook_heatrange: { from: 0, to: 0 }, // heat range
          mapbook_heat_selectedcolors: [], // heat color
          mapbook_themedata: [], //Color + data name
          mapbook_owner: userId,
        };

        setSelectedMapFile(newGeojsonData);
      }
    } catch (error) {
      console.error("Error loading GeoJSON file:", error);
    }
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    setBackgroundColor("#fff");
    setCursor("auto");
    const files = e.dataTransfer.files;
    setSelectedFile(files[0]);
    await processFile(files[0]);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setBackgroundColor("rgba(128, 128, 128, 0.3)");
    setCursor("pointer");
  };

  const handleDragLeave = () => {
    setBackgroundColor("#fff");
    setCursor("auto");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    await processFile(file);
  };
  return (
    <div
      style={{
        border: "1px gray dashed",
        // padding: "4rem 4rem 2rem 4rem",
        backgroundColor,
        transition: "background-color 0.2s ease",
      }}
      onMouseOver={() => {
        setBackgroundColor("rgba(128, 128, 128, 0.3)");
        setCursor("pointer");
      }}
      onMouseOut={() => {
        setBackgroundColor("#fff");
        setCursor("auto");
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Label
        data-cy="dropzone-label"
        onMouseOver={() => {
          setCursor("pointer");
        }}
        htmlFor="dropzone-file"
        style={{
          color: "#000",
          borderColor: "#000",
          cursor: "pointer",
        }}
      >
        <div
          className="cypress_click"
          style={{
            display: " flex",
            justifyContent: " space-evenly",
            margin: "2rem 2rem 0 2rem",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            style={{
              display: " block",
              overflow: "hidden",
              width: "2rem",
              height: "2rem",
            }}
          >
            <path
              stroke="gray"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ color: "rgba(128, 128, 128)" }}>
            <span
              data-cy="dropzone" //for cypress
              style={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Click to upload
            </span>{" "}
            or{" "}
            <span style={{ fontWeight: "bold", fontSize: "20px" }}>
              drag and drop
            </span>
          </span>

          <span
            style={{
              color: "rgba(128, 128, 128)",
              fontWeight: "300",
              fontSize: "13px",
            }}
          >
            File types - .geojson .json .kml .shp
          </span>
        </div>
        <FileInput
          className="dropzone"
          id="dropzone-file"
          style={{ display: "none" }}
          onChange={handleFileChange}
          // className="importfilepage_fileInput"
        />
      </Label>
      {selectedFile && (
        <div
          data-cy="selected-file" //cypress
          style={{
            color: "rgba(128, 128, 128)",
            marginTop: "10px",
            fontWeight: "400",
            fontSize: "15px",
            textAlign: "center",
          }}
          // className="importfilepage_container"
        >
          Selected File :{" "}
          <span
            style={{
              color: "#1f6baf",
              marginTop: "10px",
              fontWeight: "600",
            }}
          >
            {selectedFile.name}
          </span>
          <br />
          <div
            className="cypress_click_create"
            style={{
              color: createTextColor,
              marginTop: "1rem",
              fontWeight: "600",
              fontSize: "15px",
              textAlign: "center",
              cursor,
            }}
            onMouseOver={() => {
              setCursor("pointer");
              setCreateTextColor("#1f6baf");
            }}
            onMouseOut={() => {
              setCursor("auto");
              setCreateTextColor("rgba(128, 128, 128)");
            }}
            onClick={() => setImportDataOpen(false)}
          >
            Create Map
          </div>
        </div>
      )}

      <div
        style={{
          color: textColor,
          marginTop: "1rem",
          fontWeight: "400",
          fontSize: "10px",
          textAlign: "center",
          textDecoration: "underline",
          cursor,
          marginBottom: "1rem ",
        }}
        onMouseOver={() => {
          setCursor("pointer");
          setTextColor("#1f6baf");
        }}
        onMouseOut={() => {
          setCursor("auto");
          setTextColor("rgba(128, 128, 128)");
        }}
        onClick={() => navigate("/mainpage")}
      >
        Return to Main Page
      </div>
    </div>
  );
}

export default ImportFilePage;
