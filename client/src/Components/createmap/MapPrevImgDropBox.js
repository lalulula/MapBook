import React, { useEffect, useState } from "react";
import { FileInput, Label } from "flowbite-react";

function MapPrevImgDropBox({
  setSelectedMapFile,
  setImportDataOpen,
  mapImage,
  setMapImage,
}) {
  const [backgroundColor, setBackgroundColor] = useState(
    "rgba(44, 44, 44, 0.46)"
  );
  const [textColor, setTextColor] = useState("rgba(128, 128, 128)");
  const [cursor, setCursor] = useState("auto");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setBackgroundColor("#fff");
    setCursor("auto");
    const files = e.dataTransfer.files;
    const file = files[0];
    if (isValidImageType(file)) {
      setSelectedFile(file);
      console.log(files);
    } else {
      console.log("Invalid file type. Please select an image file (jpg, png).");
    }
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
    if (isValidImageType(file)) {
      setSelectedFile(file);
      setMapImage(file);
      try {
        console.log("Selected image file:", file);
      } catch (error) {
        console.error("Error processing the image file:", error);
      }
    } else {
      console.log("Invalid file type. Please select an image file (jpg, png).");
    }
  };

  const isValidImageType = (file) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    return file && allowedTypes.includes(file.type);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setMapImage(null);
  };

  return (
    <div
      style={{
        border: "1px gray dashed",
        padding: "1rem",
        backgroundColor,
        transition: "background-color 0.2s ease",
        cursor,
      }}
      onMouseOver={() => {
        setBackgroundColor("rgba(128, 128, 128, 0.3)");
        setCursor("pointer");
      }}
      onMouseOut={() => {
        setBackgroundColor("rgba(44, 44, 44, 0.46)");
        setCursor("auto");
      }}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
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
              //   overflow: "hidden",
              width: "2rem",
              height: "2rem",
            }}
          >
            <path
              stroke="gray"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
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
          <span style={{ color: "rgba(128, 128, 128)", textAlign: "center" }}>
            <span style={{ fontWeight: "bold", fontSize: "15px" }}>
              Click to upload
            </span>
            <br />
            or{" "}
            <span style={{ fontWeight: "bold", fontSize: "15px" }}>
              drag and drop
            </span>
          </span>

          <span
            style={{
              color: "rgba(128, 128, 128)",
              fontWeight: "300",
              fontSize: "10px",
            }}
          >
            File types - .jpg .png
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
            fontSize: "12px",
            textAlign: "center",
          }}
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
        </div>
      )}

      {selectedFile && (
        <div
          style={{
            color: textColor,
            marginTop: "1rem",
            fontWeight: "400",
            fontSize: "10px",
            textAlign: "center",
            textDecoration: "underline",
            cursor,
          }}
          onMouseOver={() => {
            setCursor("pointer");
            setTextColor("#1f6baf");
          }}
          onMouseOut={() => {
            setCursor("auto");
            setTextColor("rgba(128, 128, 128)");
          }}
          onClick={() => removeImage()}
        >
          Remove Image
        </div>
      )}
    </div>
  );
}

export default MapPrevImgDropBox;
