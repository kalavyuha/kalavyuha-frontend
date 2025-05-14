import React from "react";
import { Button } from "@mui/material";

const LightButton = ({ title }) => {
  return (
    <Button
      variant="contained"
      sx={{
        display: { xs: 'none', sm: 'block' },
        bgcolor: 'var(--secondary-color)',
        fontWeight: 'bold',
        color: '#1b4d69',
        '&:hover': {
          bgcolor: 'var(--bg-secondary-color)'
        }
      }}
    >
      {title}
    </Button>
  );
};

export default LightButton;
