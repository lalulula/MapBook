import React, { useEffect, useState } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import DialogTitle from "@mui/joy/DialogTitle";

const PieBarDataInput = ({
  showModalBar,
  showModalPie,
  setShowModalBar,
  setShowModalPie,
  handleAddData,
  selectedMapFile,
  handlePieBarInputChange,
  regionName,
  feature,
}) => {
  useEffect(() => {}, []);

  const isAnyDataNameMissing =
    selectedMapFile["mapbook_datanames"].some((dataname) => !dataname) ||
    selectedMapFile["mapbook_datanames"].length === 0;

  return (
    <Modal
      open={showModalBar || showModalPie}
      onClose={() => {
        setShowModalBar(false);
        setShowModalPie(false);
      }}
    >
      <ModalDialog>
        <DialogTitle>Enter Data for {regionName}</DialogTitle>
        <form onSubmit={handleAddData}>
          <Stack spacing={2}>
            <div className="map_datainput_container">
              {isAnyDataNameMissing ? (
                <>
                  <div className="inputdata_warning_txt">
                    First enter data name(s) on the right side bar
                  </div>{" "}
                </>
              ) : (
                selectedMapFile["mapbook_datanames"].map((data, index) => (
                  <div key={index} className="map_datainput_element">
                    <FormControl>
                      <h3 style={{ marginBottom: "1rem" }}>
                        {data["dataName"]}
                      </h3>
                      <FormControl>
                        <Input
                          sx={{ marginBottom: "1rem" }}
                          onChange={(e) =>
                            handlePieBarInputChange(data, e.target.value)
                          }
                          placeholder={
                            feature[0].properties.mapbook_data
                              ? feature[0].properties.mapbook_data[
                                  data["dataName"]
                                ].value
                              : "Enter data value"
                          }
                          slotProps={{
                            input: { type: "number", step: "0.01" },
                          }}
                          required
                        />
                      </FormControl>
                    </FormControl>
                  </div>
                ))
              )}
              {isAnyDataNameMissing ? (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowModalBar(false);
                    setShowModalPie(false);
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

export default PieBarDataInput;
