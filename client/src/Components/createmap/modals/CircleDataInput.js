import React from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";

import DialogTitle from "@mui/joy/DialogTitle";

const CircleDataInput = ({
  showModalCircle,
  setShowModalCircle,
  handleAddData,
  setInputData,
  regionName,
  options,
  handleRerender,
}) => {
  const handleCircleDataSubmit = () => {
    // Call the callback function to trigger a rerender in the parent
    console.log("ONRENDER");
    handleRerender();
  };
  return (
    <Modal open={showModalCircle} onClose={() => setShowModalCircle(false)}>
      <ModalDialog>
        <DialogTitle>Enter Data for {regionName}</DialogTitle>
        <form onSubmit={handleAddData}>
          <Stack spacing={2}>
            <div className="map_datainput_container">
              {options.circleHeatMapData ? (
                <>
                  <h3 style={{ marginBottom: "1rem" }}>
                    {options.circleHeatMapData}
                  </h3>
                  <FormControl>
                    <Input
                      sx={{ marginBottom: "1rem" }}
                      onChange={(e) => setInputData(e.target.value)}
                      placeholder="Enter data value"
                      required
                    />
                  </FormControl>

                  <Button type="submit" onClick={handleCircleDataSubmit}>Submit</Button>
                </>
              ) : (
                <>
                  <div className="inputdata_warning_txt">
                    First enter data name(s) on the right side bar
                  </div>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowModalCircle(false);
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

export default CircleDataInput;
