import React, { useState, useEffect } from "react";

const ColorGenerator = ({ selectedColors, setSelectedColors }) => {
  const [baseColor, setBaseColor] = useState("#b09289");
  const [colorArray, setColorArray] = useState([]);
  useEffect(() => {
    console.log(selectedColors);
  }, [selectedColors]);
  const generateGradientColors = (baseColor) => {
    const numSteps = 5; // Adjust the number of steps in the gradient
    const colorArray = [];

    for (let i = 0; i < numSteps; i++) {
      const percent = (i / (numSteps - 1)) * 100;
      const gradientColor = lightenColor(baseColor, percent);
      colorArray.push(gradientColor);
    }
    setSelectedColors(colorArray);
    return colorArray;
  };
  // Color choser when the base is selected
  const lightenColor = (color, percent) => {
    const hex = color.replace(/^#/, "");
    const rgb = parseInt(hex, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const amt = percent / 100;
    const newR = Math.min(255, Math.round(r + r * amt));
    const newG = Math.min(255, Math.round(g + g * amt));
    const newB = Math.min(255, Math.round(b + b * amt));
    const newColor = `#${((1 << 24) | (newR << 16) | (newG << 8) | newB)
      .toString(16)
      .slice(1)}`;
    return newColor;
  };
  // Choose base color
  const handleBaseColorChange = (event) => {
    const newBaseColor = event.target.value;
    setBaseColor(newBaseColor);
    const newColorArray = generateGradientColors(newBaseColor);
    setColorArray(newColorArray);
  };

  return (
    <div style={{ display: "flex" }}>
      <input type="color" value={baseColor} onChange={handleBaseColorChange} />
      {/* {colorArray.map((color, index) => (
        <div
          key={index}
          style={{
            backgroundColor: color,
            padding: "5px",
            width: "2rem",
            height: "2rem",
          }}
        ></div>
      ))} */}
    </div>
  );
};

export default ColorGenerator;
