import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  ThemeProvider,
  createTheme,
} from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BusinessIcon from '@mui/icons-material/Business';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { styled } from '@mui/material/styles';
import { useInView } from 'react-intersection-observer';

import ColorLogo from "../../assets/logo/kalavyuha-favicon/kalavyuha-favicon-color.png";
import WhiteLogo from "../../assets/logo/kalavyuha-favicon/kalavyuha-favicon-white.png";
import guideVideo from "../../assets/videos/guideToRegistration.mp4";
import guideVide2 from "../../assets/videos/Start_your_business.mp4";

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f6d8e',
    },
    background: {
      default: '#f0f4f8',
    },
  },
});

const steps = [
  {
    label: 'Create Your Account',
    description: 'Tell us about yourself and secure your presence',
    icon: <AccountCircleIcon />,
    header: "Welcome to Kalavyhua!",
    content: 'Set up your business on Kalavyhua in 3 simple steps',
    videoSrc: guideVide2,
  },
  {
    label: 'Showcase Your Business',
    description: 'Put your services in the spotlight',
    icon: <BusinessIcon />,
    header: "Crucial Business Data!",
    content: 'A Comprehensive Guide to Filling Out Fundamental Business Information!',
    videoSrc: guideVideo,
  },
  {
    label: 'Set Your Availability',
    description: "Let clients know when you're ready to serve",
    icon: <EventAvailableIcon />,
    header: " Define your working hours!",
    content: 'How to Properly Fill Out Your Availability Schedule.',
    videoSrc: guideVide2,
  },
  {
    label: 'Welcome to Kalavyhua!',
    description: 'Get up and running in 1 hour',
    icon: <EmojiEventsIcon />,
    header: "Welcome to Kalavyhua!",
    content: "Congratulations! You're all set to start using Kalavyhua. Explore the platform and start connecting with clients.",
    videoSrc: guideVideo,
  },
];

const CustomStepIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})(({ theme, isActive }) => ({
  cursor: 'pointer',
  border: '1px solid',
  borderRadius: '6px',
  padding: '3px',
  background: 'white',
  marginRight: '10px',
  color: isActive ? 'black' : 'gray',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export default function KalavyhuaOnboarding() {
  const [activeStep, setActiveStep] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: false, 
    threshold: 0.3, 
  });

  const { ref: leftRef, inView: leftInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const { ref: rightRef, inView: rightInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          minHeight: 'fit-content',
          p: { xs: 2, md: 3 },
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(50px)',
          transition: 'opacity 1s, transform 1s',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
            overflow: 'hidden',
            background: 'transparent',
          }}
        >
          {/* Left Side */}
          <Box
            ref={leftRef}
            sx={{
              width: { xs: '100%', md: '40%' },
              bgcolor: 'primary.main',
              color: 'white',
              p: { xs: '10px 0px', md: '10px 20px' },
              borderRadius: { xs: '10px', md: '15px' },
              display: 'flex',
              flexDirection: 'column',
              mb: { xs: 2, md: 0 },
              transition: 'transform 1s ease-out',
              transform: leftInView ? 'translateX(0)' : 'translateX(-50%)',
              opacity: leftInView ? 1 : 0,
            }}
          >
            {/* Left side content */}
            <Typography variant="h5" component="div" sx={{ mb: 5 }}>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="img"
                  src={WhiteLogo}
                  alt="Kalavyuha Logo"
                  sx={{
                    width: '60px',
                    height: 'auto',
                    pl:1,
                  }}
                />
                <Box component="span" sx={{ ml: 1 }}>
                  <b>Kalavyhua</b>
                </Box>
              </Box>
            </Typography>

            <Stepper
              activeStep={activeStep}
              orientation="vertical"
              nonLinear
              sx={{ pl:5 }}
            >
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    icon={<CustomStepIcon isActive={activeStep === index}>{step.icon}</CustomStepIcon>}
                    onClick={() => handleStepClick(index)}
                    sx={{
                      cursor: 'pointer',
                      color: 'black',
                    }}
                  >
                    <Typography color="inherit">
                      <b>{step.label}</b>
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography sx={{ fontSize: '13px', ml: 2 }}>{step.description}</Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: { xs: 3, md: "auto" }, textAlign: 'right' }}>
              <Button
                variant="text"
                color="inherit"
                sx={{
                  px: 3,
                  borderRadius: '8px',
                  fontSize: '10px',
                  '&:hover': { bgcolor: '#100f0d' },
                }}
              >
                Sign In
              </Button>
            </Box>
          
          </Box>

          {/* Right Side */}
          <Box
            ref={rightRef}
            sx={{
              width: { xs: '100%', md: '60%' },
              p: { xs: '10px 0px', md: '10px 20px' },
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'transparent',
              transition: 'transform 1s ease-out',
              transform: rightInView ? 'translateX(0)' : 'translateX(50%)',
              opacity: rightInView ? 1 : 0,
            }}
          >
            {/* Right side content */}
            <Box
              component="img"
              src={ColorLogo}
              alt="Kalavyuha Logo"
              sx={{
                width: '60px',
                height: 'auto',
                mb: '10px',
              }}
            />

            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ 
                marginBottom: '0.2em',
                fontFamily: "serif" ,
                fontSize:{ xs: "1.8rem", sm: "2rem", md: "2.5rem" },
              }}
            >
              <b>{steps[activeStep].header}</b>
            </Typography>

            <Typography variant="subtitle1" gutterBottom sx={{ pt: 0, color: '#545454' }}>
              <b>{steps[activeStep].content}</b>
            </Typography>

            <Box
              sx={{
                width: { xs: '90%', sm: '75%', md: '65%' },
                height: { xs: 180, sm: 220, md: 200 },
                alignItems: 'center',
                margin: { xs: '20px 10px', md: '40px 10px 25px 10px' },
              }}
            >
              <video
                src={steps[activeStep].videoSrc}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '10px',
                }}
                autoPlay
                loop
                muted
              >
                Your browser does not support the video tag.
              </video>
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="medium"
              sx={{ alignSelf: 'center', px: 6, mb: 2 }}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, md: 4 } }}>
              {steps.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: { xs: 30, sm: 40, md: 50 },
                    height: 4,
                    bgcolor: index === activeStep ? '#8eabbb' : '#cdddec',
                    mx: 0.5,
                    borderRadius:"5px"
                  }}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}