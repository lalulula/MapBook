// import React, { useEffect } from "react";
// import InputMapData from "./InputMapData";
// import { useState } from "react";
// import "./createmap.css";
// import { useNavigate } from "react-router-dom";
// import Popup from "reactjs-popup";
// import ImportInitData from "./ImportInitData";

// const CreateMap = () => {
//   const navigate = useNavigate();
//   const [options, setOptions] = useState({
//     name: "",
//     topic: "",
//     circleHeatMapData: "",
//     customTopic: "",
//     template: "",
//     isPrivate: false,
//   });
//   const [pieBarData, setPieBarData] = useState([""]); //data names for pie & bar
//   const [themeData, setThemeData] = useState([{ dataName: "", color: "#fff" }]); //Theme: color and dataname
//   const [selectedColors, setSelectedColors] = useState([]); //HEATMAP: color for each range
//   const [heatRange, setHeatRange] = useState({ from: 0, to: 0 }); //HEATMAP: range value
//   const [skipStep, setSkipSteps] = useState(false);
//   const [importDataOpen, setImportDataOpen] = useState(true);
//   const [showMapEdit, setShowMapEdit] = useState(false);
//   const DEFAULT_GEOJSON =
//     "https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson";

//   const [selectedMapFile, setSelectedMapFile] = useState(DEFAULT_GEOJSON);

//   useEffect(() => {
//     // console.log("useEffect: selectedMapFile: ", selectedMapFile);
//     const newGeojsonData = {
//       ...selectedMapFile,
//       mapbook_mapname: options.name,
//       mapbook_template: options.template,
//       mapbook_circleheatmapdata: options.circleHeatMapData,
//       mapbook_topic: options.topic,
//       mapbook_customtopic: options.customTopic,
//       mapbook_visibility: options.isPrivate,
//       mapbook_datanames: pieBarData, //piebar
//       mapbook_heatrange: heatRange, // heat range
//       mapbook_heat_selectedcolors: selectedColors, // heat color
//       mapbook_themedata: themeData, //Color + data name
//     };
//     setSelectedMapFile(newGeojsonData);
//   }, [options, pieBarData, heatRange, selectedColors, themeData]);

//   useEffect(() => {}, [skipStep]);

//   const closeImportDataPopup = () => {
//     setImportDataOpen(false);
//   };

//   return (
//     <div className="create_map_page">
//       {importDataOpen ? (
//         <></>
//       ) : (
//         <>
//           <Popup
//             trigger={
//               <span className="back_btn_createmap">
//                 <i className="bi bi-arrow-left" />
//                 &nbsp;&nbsp;MainPage
//               </span>
//             }
//             modal
//             nested
//             closeOnDocumentClick={false}
//             closeOnEscape={false}
//           >
//             {(close) => (
//               <div className="back2main_modal">
//                 <div className="back2main_modal_content">
//                   <h3>
//                     Are you sure you want to go to the mainpage?
//                     <br /> Your work will not be saved.
//                   </h3>
//                 </div>

//                 <div className="modal_btn_container">
//                   <button onClick={() => navigate("/mainpage")}>
//                     Go to Main Page
//                   </button>
//                   <button onClick={() => close()}>Keep Me on This Page</button>
//                 </div>
//               </div>
//             )}
//           </Popup>
//         </>
//       )}
//       <Popup
//         open={importDataOpen}
//         closeOnDocumentClick={false}
//         closeOnEscape={false}
//         onClose={closeImportDataPopup}
//       >
//         <div>
//           <ImportInitData
//             setSkipSteps={setSkipSteps}
//             setSelectedMapFile={setSelectedMapFile}
//           />
//           <div className="modal_btn_container">
//             <button onClick={() => setImportDataOpen(false)}>
//               Import Data File
//             </button>
//             <button onClick={() => navigate("/mainpage")}>
//               Return to Main Page
//             </button>
//           </div>
//         </div>
//       </Popup>

//       {importDataOpen ? null : (
//         <div
//           className={showMapEdit ? "map_add_data_container" : "createmap_steps"}
//           style={{
//             ...(showMapEdit
//               ? {} // empty style when showMapEdit is true
//               : {
//                   backgroundColor: "rgb(47, 47, 47)",
//                   margin: "0 5rem 0 5rem",
//                   width: "80%",
//                   height: "80%",
//                   padding: " 2rem 2rem 8rem 2rem",
//                   borderRadius: "10px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-around",
//                 }),
//           }}
//         >
//           <InputMapData
//             options={options}
//             setOptions={setOptions}
//             pieBarData={pieBarData}
//             setPieBarData={setPieBarData}
//             themeData={themeData}
//             setThemeData={setThemeData}
//             selectedColors={selectedColors}
//             setSelectedColors={setSelectedColors}
//             heatRange={heatRange}
//             setHeatRange={setHeatRange}
//             selectedMapFile={selectedMapFile}
//             setSelectedMapFile={setSelectedMapFile}
//             showMapEdit={showMapEdit}
//             setShowMapEdit={setShowMapEdit}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateMap;
import React, { useEffect } from "react";
import InputMapData from "./InputMapData";
import { useState } from "react";
import "./createMap.css";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import ImportInitData from "./ImportInitData";

const CreateMap = () => {
  const navigate = useNavigate();
  const [options, setOptions] = useState({
    name: "",
    topic: "",
    circleHeatMapData: "",
    customTopic: "",
    template: "",
    description: "",
    isPrivate: false,
  });
  const [pieBarData, setPieBarData] = useState([""]); //data names for pie & bar
  const [themeData, setThemeData] = useState([{ dataName: "", color: "#fff" }]); //Theme: color and dataname
  const [selectedColors, setSelectedColors] = useState([]); //HEATMAP: color for each range
  const [heatRange, setHeatRange] = useState({ from: 0, to: 0 }); //HEATMAP: range value
  const [skipStep, setSkipSteps] = useState(false);
  const [importDataOpen, setImportDataOpen] = useState(true);
  const [showMapEdit, setShowMapEdit] = useState(false);
  const DEFAULT_GEOJSON =
    "https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson";

  const [selectedMapFile, setSelectedMapFile] = useState(DEFAULT_GEOJSON);

  useEffect(() => {
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
  }, [options, pieBarData, heatRange, selectedColors, themeData]);

  useEffect(() => {}, [skipStep]);

  const closeImportDataPopup = () => {
    setImportDataOpen(false);
  };

  return (
    <div className="createmap_container">
      <Popup
        open={importDataOpen}
        closeOnDocumentClick={false}
        closeOnEscape={false}
        onClose={closeImportDataPopup}
      >
        <div>
          <ImportInitData
            setSkipSteps={setSkipSteps}
            setSelectedMapFile={setSelectedMapFile}
          />
          <div className="modal_btn_container">
            <button onClick={() => setImportDataOpen(false)}>
              Import Data File
            </button>
            <button onClick={() => navigate("/mainpage")}>
              Return to Main Page
            </button>
          </div>
        </div>
      </Popup>

      {importDataOpen ? null : (
        <div className="createmap_add_data_container">
          <InputMapData
            importDataOpen={importDataOpen}
            options={options}
            setOptions={setOptions}
            pieBarData={pieBarData}
            setPieBarData={setPieBarData}
            themeData={themeData}
            setThemeData={setThemeData}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            heatRange={heatRange}
            setHeatRange={setHeatRange}
            selectedMapFile={selectedMapFile}
            setSelectedMapFile={setSelectedMapFile}
            showMapEdit={showMapEdit}
            setShowMapEdit={setShowMapEdit}
          />
        </div>
      )}
    </div>
  );
};

export default CreateMap;
