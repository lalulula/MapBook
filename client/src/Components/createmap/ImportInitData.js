// import React, { useState } from "react";
// import JSZip from "jszip";
// import * as shapefile from "shapefile"; // Import the shapefile library
// import { useSelector } from "react-redux";
// const ImportInitData = ({ setSkipSteps, setSelectedMapFile }) => {
//   const userId = useSelector((state) => state.user.id);
//   const handleFileChange = async (e) => {
//     try {
//       const file = e.target.files[0];
//       const texts = await file.text();
//       let parsedData;

//       if (file.name.endsWith(".json") || file.name.endsWith(".geojson")) {
//         parsedData = JSON.parse(texts);
//       } else if (file.name.endsWith(".kml")) {
//         var tj = require("./togeojson");
//         var kml = new DOMParser().parseFromString(texts, "text/xml");
//         parsedData = JSON.parse(JSON.stringify(tj.kml(kml), null, 4));
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

//           parsedData = geojson;
//         } catch (error) {
//           // Handle any errors that may occur during file processing
//           console.error("Error processing the ZIP file:", error);
//         }
//       }
//       // Check if the "template" key exists at the top level
//       if ("mapbook_template" in parsedData) {
//         setSkipSteps(true);
//         console.log(
//           'The "mapbook_template" key exists with value:',
//           parsedData.mapbook_template
//         );
//         // console.log(parsedData);
//         setSelectedMapFile(parsedData);
//       } else {
//         console.log(
//           'The "mapbook_template" key does not exist at the top level.'
//         );
//         const newGeojsonData = {
//           ...parsedData,
//           mapbook_mapname: "",
//           mapbook_description: "",
//           mapbook_template: "",
//           mapbook_circleheatmapdata: "",
//           mapbook_topic: "",
//           mapbook_customtopic: "",
//           mapbook_visibility: "",
//           mapbook_datanames: [], //piebar
//           mapbook_heatrange: { from: 0, to: 0 }, // heat range
//           mapbook_heat_selectedcolors: [], // heat color
//           mapbook_themedata: [], //Color + data name
//           mapbook_owner: userId,
//         };
//         setSelectedMapFile(newGeojsonData);
//       }
//     } catch (error) {
//       console.error("Error loading GeoJSON file:", error);
//     }
//   };

//   return (
//     <div className="import_init_data_contiainter">
//       <div className="back2main_modal_content">
//         <h3>Import your inital map data</h3>
//       </div>
//       <div className="modal_btn_container">
//         <button>
//           <input
//             type="file"
//             onChange={handleFileChange}
//             // accept=".json, .geojson"
//           />
//         </button>
//       </div>

//       {/* {renderFeatureInfo()} */}
//     </div>
//   );
// };

// export default ImportInitData;
import React, { useState } from "react";
import JSZip from "jszip";
import * as shapefile from "shapefile"; // Import the shapefile library
import { useSelector } from "react-redux";
const ImportInitData = ({ setSkipSteps, setSelectedMapFile }) => {
  const userId = useSelector((state) => state.user.id);
  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
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

          parsedData = geojson;
        } catch (error) {
          // Handle any errors that may occur during file processing
          console.error("Error processing the ZIP file:", error);
        }
      }
      // Check if the "template" key exists at the top level
      if ("mapbook_template" in parsedData) {
        setSkipSteps(true);
        console.log(
          'The "mapbook_template" key exists with value:',
          parsedData.mapbook_template
        );
        // console.log(parsedData);
        setSelectedMapFile(parsedData);
      } else {
        console.log(
          'The "mapbook_template" key does not exist at the top level.'
        );
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

  return (
    <div className="import_init_data_contiainter">
      <div className="back2main_modal_content">
        <h3>Import your inital map data</h3>
      </div>
      <div className="modal_btn_container">
        <button>
          <input
            type="file"
            onChange={handleFileChange}
            // accept=".json, .geojson"
          />
        </button>
      </div>

      {/* {renderFeatureInfo()} */}
    </div>
  );
};

export default ImportInitData;
