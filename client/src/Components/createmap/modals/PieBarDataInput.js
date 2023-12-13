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
}) => {
  // const [showCloseBtn, setShowCloseBtn] = useState(false);

  // useEffect(() => {
  //   setShowCloseBtn(
  //     selectedMapFile["mapbook_datanames"].length === 1 &&
  //       selectedMapFile["mapbook_datanames"][0] === ""
  //   );
  // }, [selectedMapFile]);
  const isAnyDataNameMissing =
    selectedMapFile["mapbook_datanames"].some((dataname) => !dataname) ||
    selectedMapFile["mapbook_datanames"].length === 0;
  console.log("isAnyDataNameMissing:", isAnyDataNameMissing, selectedMapFile["mapbook_datanames"]);
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
                selectedMapFile["mapbook_datanames"].map((dataname, index) => (
                  <div key={index} className="map_datainput_element">
                    <FormControl>
                      <h3 style={{ marginBottom: "0.5rem" }}>{dataname}</h3>
                      <FormControl>
                        <Input
                          sx={{ marginBottom: "1rem" }}
                          onChange={(e) =>
                            handlePieBarInputChange(dataname, e.target.value)
                          }
                          type="number"
                          placeholder="Enter data value"
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
