import React, { useEffect, useState } from "react";

const Heat = ({
  selectedColors,
  setSelectedColors,
  heatRange,
  setHeatRange,
  options,
  handleCircleHeatMapDataChange,
}) => {
  // https://www.color-hex.com/color-palettes/
  const colorScales = [
    ["#FF5733", "#FF8C33", "#FFC133", "#FFE433", "#D6FF33"],
    ["#3366FF", "#33A6FF", "#33D8FF", "#33FFC5", "#33FF79"],
    ["#33FF33", "#85FF33", "#C1FF33", "#F3FF33", "#FFDA33"],
    ["#FF33F9", "#FF33A2", "#FF3372", "#FF336E", "#FF3333"],
    ["#E5E5E5", "#B0B0B0", "#888888", "#5D5D5D", "#333333"],
    ["#FF6633", "#FF8533", "#FFA833", "#FFD133", "#FFFF33"],
    ["#3395FF", "#33B3FF", "#33D1FF", "#33EFFF", "#33FFC0"],
    ["#33FF80", "#33FF99", "#33FFB2", "#33FFCC", "#33FFE6"],
    ["#FF33EE", "#FF339D", "#FF335D", "#FF331A", "#FF33BF"],
    ["#606060", "#8A8A8A", "#B4B4B4", "#DEDEDE", "#FFFFFF"],
  ];

  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowSelect = (rowIndex) => {
    setSelectedRow(rowIndex);
    setSelectedColors(colorScales[rowIndex]);
  };
  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setHeatRange({
      ...heatRange,
      [name]: value,
    });
  };

  return (
    <div className="heat_container">
      <div className="heat_color_selector">
        {" "}
        <h3>Select Color</h3>
        <table>
          <tbody>
            {colorScales.map((row, rowIndex) => (
              <tr key={rowIndex} onClick={() => handleRowSelect(rowIndex)}>
                {row.map((color, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      backgroundColor: color,
                      border:
                        rowIndex === selectedRow
                          ? "2px solid #000"
                          : "2px solid transparent",
                    }}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="heat_range_selector">
        <h3>Enter Range</h3>
        <input
          type="number"
          name="from"
          placeholder="From"
          onChange={handleRangeChange}
        />
        <input
          type="number"
          name="to"
          placeholder="To"
          onChange={handleRangeChange}
        />
        <input
          type="number"
          name="width"
          placeholder="Interval Width"
          onChange={handleRangeChange}
        />
        <h3>Colors Selected</h3>
        <div className="selected-colors">
          {selectedColors.length === 0 ? (
            <>
              <div style={{ backgroundColor: "black", color: "black" }}>o</div>
              <div style={{ backgroundColor: "black", color: "black" }}>o</div>
              <div style={{ backgroundColor: "black", textAlign: "center" }}>
                no colors selected
              </div>
              <div style={{ backgroundColor: "black", color: "black" }}>o</div>
              <div style={{ backgroundColor: "black", color: "black" }}>o</div>
            </>
          ) : (
            selectedColors.map((color, index) => (
              <div key={index} style={{ backgroundColor: color }}>
                {color}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Heat;

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
