import React, { useState } from "react";

const ImportInitData = ({ setSkipSteps }) => {
  const [geojsonData, setGeojsonData] = useState(null);

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      const texts = await file.text();
      const parsedData = JSON.parse(texts);

      // Check if the "template" key exists at the top level
      if ("template" in parsedData) {
        setSkipSteps(true);
        console.log(
          'The "template" key exists with value:',
          parsedData.template
        );

        setGeojsonData(parsedData.features);
      } else {
        console.log('The "template" key does not exist at the top level.');
        setGeojsonData(null);
      }

      console.log("GeoJSON Data:", parsedData);
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
            accept=".json, .geojson"
          />
        </button>
      </div>

      {/* {renderFeatureInfo()} */}
    </div>
  );
};

export default ImportInitData;
//   const renderFeatureInfo = () => {
//     if (geojsonData && geojsonData.length > 0) {
//       return (
//         <div>
//           <h2>Feature Information</h2>
//           <ul>
//             {geojsonData.map((feature, index) => (
//               <li key={index}>
//                 Feature {index + 1}: {JSON.stringify(feature.properties)}
//               </li>
//             ))}
//           </ul>
//         </div>
//       );
//     }
//     return null;
//   };
