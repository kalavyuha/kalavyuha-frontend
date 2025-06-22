import React, { useState, useEffect } from 'react';

import LeftPanel from './components/leftpanel.js'; 
import BusinessHours from './components/businessHoursSection.js';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Box,
  Container,
  Grid,
} from '@mui/material';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1b4d69',
    },
    background: {
      default: '#fff',
    },
  },
});


export default function businessHoursSection(){

      
    const getStoredData = () => {
    try {
        const storedData = localStorage.getItem('formData');
        return storedData ? JSON.parse(storedData) : {};
    } catch (error) {
        console.error('Error parsing stored data:', error);
        return {};
    }
    };
    
    const previousData = getStoredData();

    const { firstName, lastName, email, countryCode, phone, selectedId } = previousData || {};
    
    return (
        <ThemeProvider theme={theme}>
            <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                overflow:"hidden",
                bgcolor: 'background.default',
            }}>

            <Container maxWidth={false} disableGutters sx={{ display: 'flex', flexGrow: 1 }}>
                <Grid container>
                    {/* Left side */}
                    <Grid item xs={12} md={4} square>
                        <LeftPanel
                        //   firstName={firstName}
                        //   lastName={lastName}
                        //   email={email}
                        //   countryCode={countryCode}
                        //   phone={phone}
                        //   isSignIn={true}
                        //   formData={previousData} 
                        />
                    </Grid>
                    
                    {/* Right side - form */}
                    <Grid item xs={12} md={8} >
                        <BusinessHours/>
                    </Grid>
                </Grid>

            </Container>
            </Box>
        </ThemeProvider>
    )    
} 