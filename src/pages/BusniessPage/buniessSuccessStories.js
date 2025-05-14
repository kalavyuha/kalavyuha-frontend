import React from 'react';
import {
  Box,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

import girlStandingThinking from "../../assets/images/busniess_images/girl-standing-thinking.png";
import Testimonial from "./testimonial";

export default function BusinessSuccessStories() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { ref, inView } = useInView({
    triggerOnce: false, 
    threshold: 0.3, 
  });

  const fadeInVariant = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <Box ref={ref} sx={{ py: isMd ? 4 : 3, px: isSm ? 2 : 4 }}>
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
        component={motion.div}
        variants={fadeInVariant}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.8, ease: 'easeOut' }}
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
          component={motion.div}
          variants={fadeInVariant}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
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
          component={motion.div}
          variants={fadeInVariant}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
        >
          <Testimonial />
        </Grid>
      </Grid>
    </Box>
  );
}
