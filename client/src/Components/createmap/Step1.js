import React, { useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";
import Checkbox from "@mui/material/Checkbox";
import { grey, blueGrey } from "@mui/material/colors";

import FormControlLabel from "@mui/material/FormControlLabel";

const Step1 = ({ nextStep, options, setOptions }) => {
  //   const [options, setOptions] = useState({ topic: "", template: "" });
  const handleTopicClick = (topic) => {
    setOptions({ ...options, topic });
  };
  const handleTemplateClick = (template) => {
    setOptions({ ...options, template });
  };
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
  return (
    <div>
      <div>Step1</div>
      <div>
        <h3>Map Name</h3>
        <input />
      </div>
      <div>
        <h3>Topic</h3>
        <Dropdown
          name="topic"
          label={options["topic"] || "Select Topic"}
          dismissOnClick={true}
          className="custom-dropdown"
        >
          {topics.map((option, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => handleTopicClick(option)}
              className="custom-dropdown-item"
            >
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <div>
        <h3>Templates</h3>
        <Dropdown
          name="template"
          label={options["template"] || "Select Template"}
          dismissOnClick={true}
          className="custom-dropdown"
        >
          {templates.map((option, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => handleTemplateClick(option)}
              className="custom-dropdown-item"
            >
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <div>
        <h3>Visibility</h3>
        <FormControlLabel
          value="private"
          control={
            <Checkbox
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

      <button
        disabled={
          options["topic"] === "" || options["template"] === "" ? true : false
        }
        onClick={nextStep}
        topic={options["topic"]}
        template={options["template"]}
      >
        Go To Step2
      </button>
    </div>
  );
};

export default Step1;
