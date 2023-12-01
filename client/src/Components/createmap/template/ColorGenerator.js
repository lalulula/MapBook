import React, { useState } from "react";

const ColorGenerator = () => {
  const [baseColor, setBaseColor] = useState("#b09289");
  const [colorArray, setColorArray] = useState([]);

  const generateGradientColors = (baseColor) => {
    const numSteps = 10; // Adjust the number of steps in the gradient
    const colorArray = [];

    for (let i = 0; i < numSteps; i++) {
      const percent = (i / (numSteps - 1)) * 100;
      const gradientColor = lightenColor(baseColor, percent);
      colorArray.push(gradientColor);
    }

    return colorArray;
  };

  const lightenColor = (color, percent) => {
    // Convert hex to RGB
    const hex = color.replace(/^#/, "");
    const rgb = parseInt(hex, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    // Calculate the lighten amount
    const amt = percent / 100;

    // Calculate the new RGB values
    const newR = Math.min(255, Math.round(r + r * amt));
    const newG = Math.min(255, Math.round(g + g * amt));
    const newB = Math.min(255, Math.round(b + b * amt));

    // Convert the new RGB values back to hex
    const newColor = `#${((1 << 24) | (newR << 16) | (newG << 8) | newB)
      .toString(16)
      .slice(1)}`;
    return newColor;
  };

  const handleBaseColorChange = (event) => {
    const newBaseColor = event.target.value;
    setBaseColor(newBaseColor);
    const newColorArray = generateGradientColors(newBaseColor);
    setColorArray(newColorArray);
  };

  return (
    <div>
      <label>
        Choose a base color:
        <input
          type="color"
          value={baseColor}
          onChange={handleBaseColorChange}
        />
      </label>
      <div>
        Generated Gradient Colors:
        <ul>
          {colorArray.map((color, index) => (
            <li key={index} style={{ backgroundColor: color, padding: "5px" }}>
              {color}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ColorGenerator;
