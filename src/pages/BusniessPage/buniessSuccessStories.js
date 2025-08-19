import React from 'react';
import {
  Box,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import girlStandingThinking from "../../assets/images/busniess_images/girl-standing-thinking.png";
import Testimonial from "./testimonial";

export default function BusinessSuccessStories() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Box sx={{ py: isMd ? 4 : 3, px: isSm ? 2 : 4 }}>
      <Grid
        container
        spacing={3}
        sx={{
          bgcolor: "#e2e6ea",
          textAlign: { xs: "none", sm: "center", md: "none" },
          borderRadius: 7,
          height: isSm || isMd ? "auto" : "24.7rem",
          p: isSm ? 2 : isMd ? 3 : 0,
        }}
      >
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            height: "100%",
            display: 'flex',
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={girlStandingThinking}
            alt="Professional woman"
            sx={{
              width: { xs: "100%", sm: "38%", md: "100%" },
              height: '100%',
              borderRadius: 2,
              objectFit: 'cover',
            }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={8}
        >
          <Testimonial />
        </Grid>
      </Grid>
    </Box>
  );
}
