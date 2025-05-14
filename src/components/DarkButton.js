import React from "react";
import { Button } from "@mui/material";

const DarkButton = ({ buttonTitle, buttonBg = "black", sx, children }) => {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: buttonBg,
        color: "white",
        borderRadius: "20px",
        padding: "6px 16px",
        "&:hover": {
          backgroundColor: "gray",
        },
        margin: "0px 4px 0px 0px",
        ...sx,
      }}
    >
      {buttonTitle}
      {children}
    </Button>
  );
};

export default DarkButton;
