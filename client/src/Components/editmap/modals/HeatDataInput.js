import React, { useEffect, useState } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import DialogTitle from "@mui/joy/DialogTitle";

const HeatDataInput = ({
  showModalHeat,
  setShowModalHeat,
  handleAddData,
  handleHeatMapData,
  regionName,
  options,
  inputData,
  heatRange,
  selectedColors,
  feature,
}) => {
  useEffect( () =>  {
    console.log("Heat feature: ", feature)
    console.log(feature[0].properties.mapbook_data)
  }, [] );

  const [renderedColor, setRenderedColor] = useState(null);
  const [invalidColor, setInvalidColor] = useState(false);

  useEffect(() => {
    if (inputData && inputData["color"] === "Invalid Color") {
      setInvalidColor(true);
    } else {
      setInvalidColor(false);
      inputData && setRenderedColor(inputData["color"]);
    }
  }, [inputData]);

  const isEmpty = () => {
    const isCircleHeatMapDataEmpty = !options["circleHeatMapData"];
    const isHeatRangeEmpty = heatRange.from === 0 && heatRange.to === 0;
    const isSelectedColorsEmpty = selectedColors.length === 0;
    return (
      isCircleHeatMapDataEmpty || isHeatRangeEmpty || isSelectedColorsEmpty
    );
  };

  // Example of using the isEmpty function
  const isAnyDataMissing = isEmpty();
  useEffect(() => {
    console.log(isAnyDataMissing);
  }, []);
  return (
    <Modal open={showModalHeat} onClose={() => setShowModalHeat(false)}>
      <ModalDialog>
        <DialogTitle>Enter Data for {regionName}</DialogTitle>
        <form onSubmit={handleAddData}>
          <Stack spacing={2}>
            <div className="map_datainput_container">
              {!isAnyDataMissing ? (
                <>
                  <div className="heatdatainput_label">
                    <h3 style={{ marginBottom: "1rem" }}>
                      {options.circleHeatMapData}
                    </h3>
                    {inputData && (
                      <span
                        style={{
                          height: "1.2rem",
                          width: "1.2rem",
                          borderRadius: "5px",
                          backgroundColor: renderedColor,
                        }}
                      ></span>
                    )}
                  </div>
                  <FormControl>
                    <Input
                      sx={{ marginBottom: "1rem" }}
                      onChange={(e) => handleHeatMapData(e.target.value)}
                      // placeholder="Enter data value"
                      placeholder={feature[0].properties.mapbook_data ? feature[0].properties.mapbook_data.value : "Enter data value"}
                      // value={feature[0].properties.mapbook_data ? feature[0].properties.mapbook_data[options.circleHeatMapData].value : ""}
                      slotProps={{ input: { type:"number",step:"0.01" } }}
                      required
                    />
                  </FormControl>

                  {invalidColor ? (
                    <Button disabled={true}>Enter valid data in range</Button>
                  ) : (
                    <Button type="submit">Submit</Button>
                  )}
                </>
              ) : (
                <>
                  <div className="inputdata_warning_txt">
                    First enter data name(s) on the right side bar
                  </div>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowModalHeat(false);
                    }}
                  >
                    Close
                  </Button>
                </>
              )}
            </div>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default HeatDataInput;
