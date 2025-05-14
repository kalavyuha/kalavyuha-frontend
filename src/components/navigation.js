import React from 'react';
import { AppBar, Toolbar, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import LightButton from './LightButton';


// Styled components
const LogoWrapper = styled('div')({
  position: 'relative',
  display: 'inline-block',
  padding: '20px', // Adjust padding as needed
});

const PinkCircle = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '-75px', // Adjust to position the circle correctly relative to the logo
  width: '150px', // Adjust size as needed
  height: '150px', // Adjust size as needed
  backgroundColor: '#e2e6ea', // Pink color
  borderRadius: '50%',
  transform: 'translateY(-50%)',
  zIndex: -1, // Makes sure the circle is behind the logo
});

function Navbar(props) {
  const { navbar } = props; 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Use media query for responsive design

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'transparent',
        boxShadow: 'none',  // Optional: Removes the default box shadow
        px: isMobile ? 1 : 2,  // Adjust padding for mobile
        py: isMobile ? 0.5 : 1,  // Adjust padding for mobile
      }}
    >
      <Toolbar 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', // Stack items vertically on mobile
          justifyContent: 'space-between', 
          alignItems: 'center',
          textAlign: isMobile ? 'center' : 'left', // Center text on mobile
        }}
      >
        {/* Logo Wrapper with Pink Circle */}
        <LogoWrapper>
          <PinkCircle />
          <Typography variant="h6" component="div">
            Your Logo
          </Typography>
        </LogoWrapper>

        {/* Conditionally render navbar */}
        {navbar && !isMobile && navbar}

        

        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2,
            mt: isMobile ? 1 : 0, // Margin top for mobile
            flexDirection: isMobile ? 'column' : 'row', // Stack buttons vertically on mobile
          }}
        >
          {props.button}
          <LightButton buttonTitle="Menu" />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
