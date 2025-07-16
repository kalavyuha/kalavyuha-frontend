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


export default function BusinessHoursSection(){

      
    const getStoredData = () => {
    try {
        const storedData = localStorage.getItem('formData');
        return storedData ? JSON.parse(storedData) : {};
    } catch (error) {
        console.error('Error parsing stored data:', error);
        return {};
    }
    };
    
    const [formData, setFormData] = useState(getStoredData());

    // Update formData when localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            setFormData(getStoredData());
        };
        
        // Listen for storage changes from other tabs
        window.addEventListener('storage', handleStorageChange);
        
        // Custom event listener for same-tab updates
        const handleCustomStorageChange = (e) => {
            if (e.detail?.key === 'formData') {
                setFormData(getStoredData());
            }
        };
        
        window.addEventListener('localStorageUpdate', handleCustomStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageUpdate', handleCustomStorageChange);
        };
    }, []);

    const { firstName, lastName, email, countryCode, phone, selectedId } = formData || {};
    
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
                          firstName={firstName}
                          lastName={lastName}
                          email={email}
                          countryCode={countryCode}
                          phone={phone}
                          isSignIn={true}
                          formData={formData} 
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