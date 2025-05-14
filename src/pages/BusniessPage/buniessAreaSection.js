import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useInView } from 'react-intersection-observer';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNaturalOutlined';
import FavoriteIcon from '@mui/icons-material/VolunteerActivismOutlined';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenterOutlined';
import { motion } from 'framer-motion';

const ServiceItem = ({ icon, title, description, isSmallScreen }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
  >
    <Paper 
      elevation={0}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        bgcolor: 'transparent',
        height: '100%',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <Box
        component={motion.div}
        whileHover={{ rotate: 10, scale: 1.1 }}
        sx={{
          width: { xs: 80, sm: 100, md: 120 },
          height: { xs: 80, sm: 100, md: 120 },
          borderRadius: '50%',
          bgcolor: '#c0ccd8',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
        }}
      >
        {React.cloneElement(icon, { 
          sx: { 
            fontSize: { xs: 40, sm: 45, md: 50 }, 
            color: '#1b4d69' 
          } 
        })}
      </Box>
      <Typography 
        variant={isSmallScreen ? "h6" : "h5"} 
        component="h2" 
        gutterBottom 
        sx={{
          fontFamily: "sans-serif", 
          letterSpacing: "0.03em", 
          fontWeight: 100,
          fontSize: { xs: 18, sm:22, md: 24 },
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{
          maxWidth: { xs: "100%", sm: "13rem" },
          color: '#545454',
          fontSize: { xs: 12, sm:14, md: 15 },
          flexGrow: 1,
          px: 3
        }}
      >
        {description}
      </Typography>
    </Paper>
  </motion.div>
);

export default function BusinessAreaSection() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  const services = [
    {
      icon: <FaceRetouchingNaturalIcon />,
      title: 'Beauty & Salon',
      description: 'Create stunning portfolios to showcase your stylists\' best work.',
    },
    {
      icon: <FavoriteIcon />,
      title: 'Healthcare',
      description: 'Create serene client experiences from booking to post-treatment follow-ups.',
    },
    {
      icon: <FitnessCenterIcon />,
      title: 'Fitness & Wellness',
      description: 'Simplify class bookings and manage memberships with ease.',
    },
  ];

  return (
    <Box 
      ref={ref}
      component={motion.div}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      sx={{ py: { xs: 4, sm: 6, md: 8 } }}
    >
      <Typography 
        variant={isSmallScreen ? "h4" : "h3"} 
        component="h1" 
        align="center" 
        gutterBottom 
        sx={{ 
          mb: { xs: 4, sm: 6, md: 8 }, 
          px: 2,
          fontSize: { xs: 25, sm: 35, md: 48 },
        }}
        component={motion.div}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: inView ? 1 : 0.8, opacity: inView ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Technology Crafted for Your Success
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ServiceItem
              icon={service.icon}
              title={service.title}
              description={service.description}
              isSmallScreen={isSmallScreen}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
