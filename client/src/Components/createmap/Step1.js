import Checkbox from "@mui/material/Checkbox";
import { grey, blueGrey } from "@mui/material/colors";
import FormControlLabel from "@mui/material/FormControlLabel";
import CustomDropDown from "./CustomDropDown";

const Step1 = ({ nextStep, options, setOptions }) => {
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
    <>
      <div className="step1_container">
        <div>
          <h3>Map Name</h3>
          <input name="map_name" />
        </div>
        <br />
        <div>
          <h3>Topic</h3>
          <CustomDropDown
            label={options["topic"] || "Select Topic"}
            options={topics}
            handleClick={handleTopicClick}
          />
        </div>
        <br />
        <div>
          <h3>Templates</h3>
          <CustomDropDown
            label={options["template"] || "Select Template"}
            options={templates}
            handleClick={handleTemplateClick}
          />
        </div>
        <br />
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
      </div>

      <button
        className="step1_btn"
        disabled={
          options["topic"] === "" || options["template"] === "" ? true : false
        }
        onClick={nextStep}
        topic={options["topic"]}
        template={options["template"]}
      >
        Go To Step2
      </button>
    </>
  );
};

export default Step1;
