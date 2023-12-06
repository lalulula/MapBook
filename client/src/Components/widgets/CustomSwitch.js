import React, { useState } from "react";
import Switch, { switchClasses } from "@mui/joy/Switch";
export default function CustomSwitch({ showHoverData, setShowHoverData }) {
  return (
    <Switch
      checked={showHoverData}
      onChange={(event) => setShowHoverData(event.target.checked)}
      startDecorator={
        <div style={{ fontSize: "1rem", fontWeight: 200 }}>Hide</div>
      }
      endDecorator={
        <div style={{ fontSize: "1rem", fontWeight: 200 }}>Show</div>
      }
      sx={(theme) => ({
        "--Switch-thumbShadow": "0 3px 7px 0 rgba(0 0 0 / 0.12)",
        "--Switch-thumbSize": "12px",
        "--Switch-trackWidth": "27px",
        "--Switch-trackHeight": "16px",
        "--Switch-trackBackground": theme.vars.palette.background.level3,
        [`& .${switchClasses.thumb}`]: {
          transition: "width 0.2s, left 0.2s",
        },
        "&:hover": {
          "--Switch-trackBackground": theme.vars.palette.background.level3,
        },
        "&:active": {
          "--Switch-thumbWidth": "25px",
        },
        [`&.${switchClasses.showHoverData}`]: {
          "--Switch-trackBackground": "rgb(48 209 88)",
          "&:hover": {
            "--Switch-trackBackground": "rgb(48 209 88)",
          },
        },
      })}
    />
  );
}
