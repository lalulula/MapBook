import React, { useState } from "react";
import { FileInput, Label } from "flowbite-react";

function FileDropBox() {
  const [backgroundColor, setBackgroundColor] = useState("fff");
  const [cursor, setCursor] = useState("auto");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setBackgroundColor("#fff");
    setCursor("auto");

    // Handle the dropped files
    const files = e.dataTransfer.files;
    // Update state with the selected file
    setSelectedFile(files[0]);
    // Perform any additional actions with the dropped files
    console.log(files);
  };

  const handleFileChange = (e) => {
    // Handle the selected file from the input
    const file = e.target.files[0];
    // Update state with the selected file
    setSelectedFile(file);
    // Perform any additional actions with the selected file
    console.log(file);
  };
  return (
    <div
      style={{
        border: "1px gray dashed",
        padding: "4rem",
        backgroundColor,
        transition: "background-color 0.2s ease",
        cursor,
      }}
      onMouseOver={() => {
        setBackgroundColor("rgba(128, 128, 128, 0.3)");
        setCursor("pointer");
      }}
      onMouseOut={() => {
        setBackgroundColor("#fff");
        setCursor("auto");
      }}
      onDrop={handleDrop}
    >
      <Label
        onMouseOver={() => {
          setCursor("pointer");
        }}
        htmlFor="dropzone-file"
        style={{ color: "#000", borderColor: "#000" }}
      >
        <div
          style={{
            display: " flex",
            justifyContent: " space-evenly",
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
              strokeLineJoin="round"
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
            <span style={{ fontWeight: "bold", fontSize: "20px" }}>
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
            .geojson .json
          </span>
        </div>
        <FileInput
          id="dropzone-file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Label>
      {selectedFile && (
        <div
          style={{
            color: "rgba(128, 128, 128)",
            marginTop: "10px",
            fontWeight: "400",
            fontSize: "15px",
            textAlign: "center",
          }}
        >
          Selected File:{" "}
          <span
            style={{
              color: "blue",
              marginTop: "10px",
              fontWeight: "600",
            }}
          >
            {selectedFile.name}
          </span>
        </div>
      )}
    </div>
  );
}

export default FileDropBox;
