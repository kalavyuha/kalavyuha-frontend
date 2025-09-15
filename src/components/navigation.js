import React from 'react';
import { AppBar, Toolbar, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import LightButton from './LightButton';


// Styled components
const LogoWrapper = styled('div')({
  position: 'relative',
  display: 'inline-block',
  padding: '20px',
});

const PinkCircle = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '-75px',
  width: '150px',
  height: '150px',
  backgroundColor: '#e2e6ea',
  borderRadius: '50%',
  transform: 'translateY(-50%)',
  zIndex: -1,
});

function Navbar(props) {
  const { navbar } = props; 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
        px: isMobile ? 1 : 2,
        py: isMobile ? 0.5 : 1,
      }}
    >
      <Toolbar 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: 'center',
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        {/* Logo Wrapper with Pink Circle */}
        <LogoWrapper>
          <PinkCircle />
          <Typography variant="h6" component="div">
            Your Logo
          </Typography>
        </LogoWrapper>

        {navbar && !isMobile && navbar}        

        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2,
            mt: isMobile ? 1 : 0,
            flexDirection: isMobile ? 'column' : 'row',
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
