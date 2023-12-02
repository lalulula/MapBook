import React from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import Add from "@mui/icons-material/Add";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";

const PieBarDataInput = ({
  showModalBar,
  showModalPie,
  setShowModalBar,
  setShowModalPie,
  handleAddData,
  selectedMapFile,
  handlePieBarInputChange,
}) => {
  return (
    <Modal
      open={showModalBar || showModalPie}
      onClose={() => {
        setShowModalBar(false);
        setShowModalPie(false);
      }}
    >
      <ModalDialog>
        <DialogTitle>Enter Data Values of Fields</DialogTitle>
        <form onSubmit={handleAddData}>
          <Stack spacing={2}>
            <div className="map_datainput_container">
              {selectedMapFile["mapbook_datanames"].map((dataname, index) => (
                <div key={index} className="map_datainput_element">
                  <FormControl>
                    {dataname ? (
                      <h3 style={{ marginBottom: "10px" }}>{dataname}</h3>
                    ) : (
                      <h3
                        style={{
                          marginBottom: "10px",
                          color: "Red",
                          fontWeight: 300,
                        }}
                      >
                        First enter data name on the right side bar
                      </h3>
                    )}
                  </FormControl>
                  <FormControl>
                    <Input
                      onChange={(e) =>
                        handlePieBarInputChange(dataname, e.target.value)
                      }
                      placeholder="Enter data value"
                      required
                    />
                  </FormControl>
                </div>
              ))}
            </div>

            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default PieBarDataInput;
