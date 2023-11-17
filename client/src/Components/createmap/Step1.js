import Checkbox from "@mui/material/Checkbox";
import { grey, blueGrey } from "@mui/material/colors";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { Button } from "@mui/material";

const Step1 = ({ nextStep, options, setOptions }) => {
  const handleMapNameChange = (name) => {
    console.log(name);
    setOptions({ ...options, name });
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
  const handlePrivacy = (e) => {
    setOptions({ ...options, isPrivate: e.target.checked });
  };
  useEffect(() => {
    console.log(options.topic.value);
  }, [options]);

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
    <div className="step1_container">
      <div>
        <h3>Map Name</h3>
        <input
          value={options.name}
          onChange={(e) => handleMapNameChange(e.target.value)}
          name="map_name"
        />
      </div>
      <br />
      <div>
        <h3>Topic</h3>
        <Dropdown
          options={topics}
          value={options.topic}
          placeholder="Select Topic"
          className="create_map_dropdown"
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
          className="create_map_dropdown"
          onChange={handleTemplateClick}
          value={options.template}
        />
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
      <div className="btn_container">
        <span className="before_btn"></span>
        <button
          className="next_btn"
          disabled={
            options["topic"] === "" || options["template"] === "" ? true : false
          }
          onClick={nextStep}
          topic={options["topic"]}
          template={options["template"]}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1;
