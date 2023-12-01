// import Checkbox from "@mui/material/Checkbox";
// import { grey, blueGrey } from "@mui/material/colors";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Dropdown from "react-dropdown";
// import { useEffect, useState } from "react";
// import { Button } from "@mui/material";
// import PieBar from "./template/PieBar";
// import Heat from "./template/Heat";
// import Thematic from "./template/Thematic";
// import MapAddData from "./MapAddData";
// import "./createmap.css";

// const InputMapData = ({
//   options,
//   setOptions,
//   pieBarData,
//   setPieBarData,
//   themeData,
//   setThemeData,
//   selectedColors,
//   setSelectedColors,
//   heatRange,
//   setHeatRange,
//   selectedMapFile,
//   showMapEdit,
//   setShowMapEdit,
// }) => {
//   const handleMapNameChange = (name) => {
//     setOptions({ ...options, name });
//   };
//   const handleTopicClick = (topic) => {
//     const newVal = topic.value;
//     setOptions({ ...options, topic: newVal });
//   };
//   const handleCustomTopic = (customTopic) => {
//     setOptions({ ...options, customTopic });
//   };

//   const handleTemplateClick = (template) => {
//     const newVal = template.value;
//     setOptions({ ...options, template: newVal });
//   };
//   const handleCircleHeatMapDataChange = (circleData) => {
//     const newVal = circleData;
//     setOptions({ ...options, circleHeatMapData: newVal });
//   };
//   const handlePrivacy = (e) => {
//     setOptions({ ...options, isPrivate: e.target.checked });
//   };

//   // useEffect(() => {
//   //   console.log(options);
//   // }, [options]);

//   const topics = [
//     "Economy",
//     "Education",
//     "Environmental",
//     "Geography",
//     "Health",
//     "History",
//     "Social",
//     "Other",
//   ];

//   const templates = [
//     "Bar Chart",
//     "Circle Map",
//     "Heat Map",
//     "Pie Chart",
//     "Thematic Map",
//   ];
//   const template = options["template"];
//   // const [showMapEdit, setShowMapEdit] = useState(false);
//   return (
//     <>
//       {showMapEdit ? (
//         <>
//           <MapAddData selectedMapFile={selectedMapFile} />
//         </>
//       ) : (
//         <>
//           <div className="data_input_left">
//             <h1>Create Map</h1>
//             <div>
//               <h3>Map Name</h3>
//               <input
//                 value={options.name}
//                 onChange={(e) => handleMapNameChange(e.target.value)}
//                 name="map_name"
//               />
//             </div>
//             <br />
//             <div>
//               <h3>Topic</h3>
//               <Dropdown
//                 options={topics}
//                 value={options.topic}
//                 placeholder="Select Topic"
//                 className="create_map_dropdown"
//                 onChange={handleTopicClick}
//               />
//               {options.topic === "Other" && (
//                 <input
//                   value={options.customTopic}
//                   placeholder="Enter a custom Topic"
//                   onChange={(e) => handleCustomTopic(e.target.value)}
//                 />
//               )}
//             </div>
//             <br />
//             <div>
//               <h3>Templates</h3>
//               <Dropdown
//                 options={templates}
//                 placeholder="Select Template"
//                 className="create_map_dropdown"
//                 onChange={handleTemplateClick}
//                 value={options.template}
//               />
//               {options.template === "Circle Map" && (
//                 <input
//                   value={options.circleHeatMapData}
//                   placeholder="Enter CircleMap Data Name"
//                   onChange={(e) =>
//                     handleCircleHeatMapDataChange(e.target.value)
//                   }
//                 />
//               )}
//               {options.template === "Heat Map" && (
//                 <input
//                   value={options.circleHeatMapData}
//                   placeholder="Enter HeatMap Data Name"
//                   onChange={(e) =>
//                     handleCircleHeatMapDataChange(e.target.value)
//                   }
//                 />
//               )}
//             </div>
//             <br />
//             <div>
//               <h3>Visibility</h3>
//               <FormControlLabel
//                 value="private"
//                 control={
//                   <Checkbox
//                     onChange={handlePrivacy}
//                     sx={{
//                       color: grey[800],
//                       "&.Mui-checked": {
//                         color: blueGrey[600],
//                       },
//                     }}
//                   />
//                 }
//                 label="Private"
//                 labelPlacement="end"
//                 color="white"
//               />
//             </div>
//           </div>
//           <div className="data_input_right">
//             {template && <h3>Enter Data Names</h3>}
//             {(template === "Pie Chart" || template === "Bar Chart") && (
//               <PieBar pieBarData={pieBarData} setPieBarData={setPieBarData} />
//             )}
//             {template === "Thematic Map" && (
//               <Thematic themeData={themeData} setThemeData={setThemeData} />
//             )}
//             {template === "Heat Map" && (
//               <Heat
//                 selectedColors={selectedColors}
//                 setSelectedColors={setSelectedColors}
//                 heatRange={heatRange}
//                 setHeatRange={setHeatRange}
//               />
//             )}
//             {template && (
//               <div className="btn_container">
//                 <span className="before_btn"></span>
//                 <button
//                   className="next_btn"
//                   disabled={
//                     options["topic"] === "" || options["template"] === ""
//                       ? true
//                       : false
//                   }
//                   onClick={() => setShowMapEdit(true)}
//                   topic={options["topic"]}
//                   template={options["template"]}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default InputMapData;
import Checkbox from "@mui/material/Checkbox";
import { grey, blueGrey } from "@mui/material/colors";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dropdown from "react-dropdown";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import PieBar from "./template/PieBar";
import Heat from "./template/Heat";
import Thematic from "./template/Thematic";
import MapAddData from "./MapAddData";
import Popup from "reactjs-popup";
import "./createMap.css";
import { useNavigate } from "react-router-dom";

const InputMapData = ({
  importDataOpen,
  options,
  setOptions,
  pieBarData,
  setPieBarData,
  themeData,
  setThemeData,
  selectedColors,
  setSelectedColors,
  heatRange,
  setHeatRange,
  selectedMapFile,
  showMapEdit,
  setShowMapEdit,
}) => {
  const handleMapNameChange = (name) => {
    setOptions({ ...options, name });
  };
  const handleMapDescriptionChange = (description) => {
    setOptions({ ...options, description });
  };
  const handleTopicClick = (topic) => {
    const newVal = topic.value;
    setOptions({ ...options, topic: newVal });
  };
  const handleCustomTopic = (customTopic) => {
    setOptions({ ...options, customTopic });
  };

  const handleTemplateClick = (template) => {
    const newVal = template.value;
    setOptions({ ...options, template: newVal });
  };
  const handleCircleHeatMapDataChange = (circleData) => {
    const newVal = circleData;
    setOptions({ ...options, circleHeatMapData: newVal });
  };
  const handlePrivacy = (e) => {
    setOptions({ ...options, isPrivate: e.target.checked });
  };
  const navigate = useNavigate();
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
  // const [showMapEdit, setShowMapEdit] = useState(false);
  return (
    <>
      {/* {importDataOpen ? (
        <></>
      ) : (
        <>
          <Popup
            trigger={
              <span className="back_btn_createmap">
                <i className="bi bi-arrow-left" />
                &nbsp;&nbsp;MainPage
              </span>
            }
            modal
            nested
            closeOnDocumentClick={false}
            closeOnEscape={false}
          >
            {(close) => (
              <div className="back2main_modal">
                <div className="back2main_modal_content">
                  <h3>
                    Are you sure you want to go to the mainpage?
                    <br /> Your work will not be saved.
                  </h3>
                </div>

                <div className="modal_btn_container">
                  <button onClick={() => navigate("/mainpage")}>
                    Go to Main Page
                  </button>
                  <button onClick={() => close()}>Keep Me on This Page</button>
                </div>
              </div>
            )}
          </Popup>
        </>
      )} */}
      {showMapEdit ? (
        <>
          <MapAddData selectedMapFile={selectedMapFile}   options={options} setOptions={setOptions}/>
        </>
      ) : (
        <>
          <div className="addmapdata_left_sidebar">
            <div>
              <h3>Map Name</h3>
              <input
                value={options.name}
                onChange={(e) => handleMapNameChange(e.target.value)}
                name="map_name"
                placeholder="Enter Map Name"
              />
            </div>
            <div>
              <h3>Description</h3>
              <input
                value={options.description}
                onChange={(e) => handleMapDescriptionChange(e.target.value)}
                name="map_description"
                placeholder="Enter Map Description"
              />
            </div>
            <br />
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
                <input
                  value={options.customTopic}
                  placeholder="Enter a custom Topic"
                  onChange={(e) => handleCustomTopic(e.target.value)}
                />
              )}
            </div>
            <br />
            <div>
              <h3>Templates</h3>
              <Dropdown
                options={templates}
                placeholder="Select Template"
                className=""
                onChange={handleTemplateClick}
                value={options.template}
              />
              {options.template === "Circle Map" && (
                <input
                  value={options.circleHeatMapData}
                  placeholder="Enter CircleMap Data Name"
                  onChange={(e) =>
                    handleCircleHeatMapDataChange(e.target.value)
                  }
                />
              )}
              {options.template === "Heat Map" && (
                <input
                  value={options.circleHeatMapData}
                  placeholder="Enter HeatMap Data Name"
                  onChange={(e) =>
                    handleCircleHeatMapDataChange(e.target.value)
                  }
                />
              )}
            </div>
            <br />
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
          <MapAddData selectedMapFile={selectedMapFile} />
          <div className="addmapdata_right_sidebar">
            <h3>Map Data</h3>
            {template && template !== "Circle Map" && <h3>Enter Data Names</h3>}
            {(template === "Pie Chart" || template === "Bar Chart") && (
              <PieBar pieBarData={pieBarData} setPieBarData={setPieBarData} />
            )}
            {template === "Thematic Map" && (
              <Thematic themeData={themeData} setThemeData={setThemeData} />
            )}
            {template === "Heat Map" && (
              <Heat
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                heatRange={heatRange}
                setHeatRange={setHeatRange}
              />
            )}
            {template && (
              <div className="">
                <span className=""></span>
                <button
                  className=""
                  disabled={
                    options["topic"] === "" || options["template"] === ""
                      ? true
                      : false
                  }
                  onClick={() => setShowMapEdit(true)}
                  topic={options["topic"]}
                  template={options["template"]}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default InputMapData;
