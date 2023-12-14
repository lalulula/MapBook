import React, { useState, useEffect } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import DialogTitle from "@mui/joy/DialogTitle";

const ThematicDataInput = ({
  showModalThematic,
  setShowModalThematic,
  handleAddData,
  selectedMapFile,
  handleThematicData,
  regionName,
  feature,
}) => {
  // useEffect( () =>  {
  //   console.log("ThematicDataInput feature: ", feature)
  //   console.log(feature[0].properties.mapbook_data)
  // }, [] );

  const isAnyDataMissing =
    selectedMapFile["mapbook_themedata"].some((data) => !data.dataName) ||
    selectedMapFile["mapbook_themedata"].length === 0;
  return (
    <Modal open={showModalThematic} onClose={() => setShowModalThematic(false)}>
      <ModalDialog>
        <DialogTitle>Enter Data for {regionName}</DialogTitle>
        <form onSubmit={handleAddData}>
          <Stack spacing={2}>
            <div className="map_datainput_container">
              {isAnyDataMissing ? (
                <div className="inputdata_warning_txt">
                  First enter data name(s) on the right side bar
                </div>
              ) : (
                selectedMapFile["mapbook_themedata"].map((data, index) => (
                  <div key={index} className="map_datainput_element">
                    <FormControl>
                      <h3 style={{ marginBottom: "1rem" }}>
                        {data["dataName"]}
                      </h3>
                      <FormControl>
                        <Input
                          sx={{ marginBottom: "1rem" }}
                          onChange={(e) =>
                            handleThematicData(data, e.target.value)
                          }
                          // placeholder="Enter data value"
                          placeholder={feature[0].properties.mapbook_data ? feature[0].properties.mapbook_data[data["dataName"]].value : "Enter data value"}

                          type="number"
                          required
                        />
                      </FormControl>
                    </FormControl>
                  </div>
                ))
              )}
              {isAnyDataMissing ? (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowModalThematic(false);
                  }}
                >
                  Close
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default ThematicDataInput;
