import React, { useState } from "react";
import { BlockPicker } from "react-color";
const Thematic = ({ themeData, setThemeData }) => {
  const [selectedDataIndexes, setSelectedDataIndexes] = useState([]);
  const handleAddThemeData = () => {
    setThemeData([...themeData, { dataName: "", color: "#fff" }]);
    setSelectedDataIndexes([...selectedDataIndexes, null]);
  };
  const handleThemeDataInput = (index, newData) => {
    const updatedData = [...themeData];
    updatedData[index].dataName = newData;
    setThemeData(updatedData);
  };
  const handleThemeDataColorChange = (index, newColor) => {
    const updatedData = [...themeData];
    updatedData[index].color = newColor;
    setThemeData(updatedData);
  };
  const handleRemoveThemeData = (index) => {
    const updatedData = [...themeData];
    updatedData.splice(index, 1);
    setThemeData(updatedData);
    const updatedIndexes = [...selectedDataIndexes];
    updatedIndexes.splice(index, 1);
    setSelectedDataIndexes(updatedIndexes);
  };
  const showColorPicker = (index) => {
    const updatedIndexes = [...selectedDataIndexes];
    updatedIndexes[index] = index;
    setSelectedDataIndexes(updatedIndexes);
  };

  return (
    <div>
      <div className="data_container">
        {themeData.map((theme, index) => (
          <div className="data_input_container" key={index}>
            <input
              placeholder="Enter Data"
              value={theme.dataName}
              onChange={(e) => handleThemeDataInput(index, e.target.value)}
            />
            <div
              onClick={() => {
                showColorPicker(index);
              }}
              style={{
                backgroundColor: `${theme.color}`,
                width: 25,
                height: 25,
                borderRadius: "50%",
              }}
            ></div>
            <i
              className="bi bi-x-circle"
              onClick={() => handleRemoveThemeData(index)}
            />

            {selectedDataIndexes[index] === index && (
              <BlockPicker
                key={index}
                color={theme.color}
                onChange={(color) => {
                  handleThemeDataColorChange(index, color.hex);
                  const updatedIndexes = [...selectedDataIndexes];
                  updatedIndexes[index] = null;
                  setSelectedDataIndexes(updatedIndexes);
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div>
        <i
          style={{ display: "flex", justifyContent: "center" }}
          className="bi bi-plus-circle"
          onClick={handleAddThemeData}
        ></i>
      </div>
    </div>
  );
};

export default Thematic;

// import React, { useEffect, useState } from "react";

// const Heat = ({
//   selectedColors,
//   setSelectedColors,
//   heatRange,
//   setHeatRange,
//   options,
//   handleCircleHeatMapDataChange,
// }) => {
//   // https://www.color-hex.com/color-palettes/
//   const colorScales = [
//     ["#FF5733", "#FF8C33", "#FFC133", "#FFE433", "#D6FF33"],
//     ["#3366FF", "#33A6FF", "#33D8FF", "#33FFC5", "#33FF79"],
//     ["#33FF33", "#85FF33", "#C1FF33", "#F3FF33", "#FFDA33"],
//     ["#FF33F9", "#FF33A2", "#FF3372", "#FF336E", "#FF3333"],
//     ["#E5E5E5", "#B0B0B0", "#888888", "#5D5D5D", "#333333"],
//     ["#FF6633", "#FF8533", "#FFA833", "#FFD133", "#FFFF33"],
//     ["#3395FF", "#33B3FF", "#33D1FF", "#33EFFF", "#33FFC0"],
//     ["#33FF80", "#33FF99", "#33FFB2", "#33FFCC", "#33FFE6"],
//     ["#FF33EE", "#FF339D", "#FF335D", "#FF331A", "#FF33BF"],
//     ["#606060", "#8A8A8A", "#B4B4B4", "#DEDEDE", "#FFFFFF"],
//   ];

//   const [selectedRow, setSelectedRow] = useState(null);

//   const handleRowSelect = (rowIndex) => {
//     setSelectedRow(rowIndex);
//     setSelectedColors(colorScales[rowIndex]);
//   };
//   const handleRangeChange = (e) => {
//     const { name, value } = e.target;
//     setHeatRange({
//       ...heatRange,
//       [name]: value,
//     });
//   };

//   return (
//     <div className="heat_container">
//       <div className="heat_color_selector">
//         {" "}
//         <h3>Select Color</h3>
//         <table>
//           <tbody>
//             {colorScales.map((row, rowIndex) => (
//               <tr key={rowIndex} onClick={() => handleRowSelect(rowIndex)}>
//                 {row.map((color, colIndex) => (
//                   <td
//                     key={colIndex}
//                     style={{
//                       backgroundColor: color,
//                       border:
//                         rowIndex === selectedRow
//                           ? "2px solid #000"
//                           : "2px solid transparent",
//                     }}
//                   ></td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="heat_range_selector">
//         <h3>Enter Range</h3>
//         <input
//           type="number"
//           name="from"
//           placeholder="From"
//           onChange={handleRangeChange}
//         />
//         <input
//           type="number"
//           name="to"
//           placeholder="To"
//           onChange={handleRangeChange}
//         />
//         <input
//           type="number"
//           name="width"
//           placeholder="Interval Width"
//           onChange={handleRangeChange}
//         />
//         <h3>Colors Selected</h3>
//         <div className="selected-colors">
//           {selectedColors.length === 0 ? (
//             <>
//               <div style={{ backgroundColor: "black", color: "black" }}>o</div>
//               <div style={{ backgroundColor: "black", color: "black" }}>o</div>
//               <div style={{ backgroundColor: "black", textAlign: "center" }}>
//                 no colors selected
//               </div>
//               <div style={{ backgroundColor: "black", color: "black" }}>o</div>
//               <div style={{ backgroundColor: "black", color: "black" }}>o</div>
//             </>
//           ) : (
//             selectedColors.map((color, index) => (
//               <div key={index} style={{ backgroundColor: color }}>
//                 {color}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Heat;
