import React, {useEffect, useState} from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FitnessImg from "../../assets/images/busniessAccount/fitness.png"
import WellnessImg from "../../assets/images/busniessAccount/wellness.png"
import BeautyImg from "../../assets/images/busniessAccount/beauty.png"
import HealthcareImg from "../../assets/images/busniessAccount/healthcare.png"

import {  RadioButtonUnchecked as CircleIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

import LeftPanel from './components/leftpanel.js'; 

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


export default function BusinessRoleSelection() {

  const navigate = useNavigate();
  const previousData = useLocation();

  const { firstName, lastName, email, countryCode, phone } = previousData.state || {};
  const [selected, setSelected] = useState(null);
  
  const options = [
    { id: 'Beauty', image: BeautyImg, title: 'Beauty', description: 'Be the Go-To Destination for Glamour!' },
    { id: 'Wellness', image: WellnessImg, title: 'Wellness', description: 'Become a Beacon of Health and Well-Being!' },
    { id: 'Fitness', image: FitnessImg, title: 'Fitness', description: 'Inspire Fitness Journeys—Build a Healthier Community!' },
    { id: 'Health Care', image: HealthcareImg, title: 'Health Care', description: 'Establish Trust: Be Your Community’s Health Advocate!' },
  ];
  
  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    if (savedRole) {
      setSelected(JSON.parse(savedRole));
    }
  }, []);
  
  const handleSelect = (id) => {
    setSelected(id);
    localStorage.setItem('selectedRole', JSON.stringify(id));
  };
  
  const handleNextInfoSection = () => {
    if (selected) {
      const formData = { ...previousData.state, businessRole: selected, isSignIn: true, businessInfoCompleted:false, teamInfoCompleted:false };
      localStorage.setItem('formData', JSON.stringify(formData));
      
      navigate('/business-info-selection', { state: formData });
    } else {
      console.warn('No option selected');
    }
  };
  
  const storedFormData = localStorage.getItem('formData');
  const formData = storedFormData ? JSON.parse(storedFormData) : { businessRole: selected };
  
  console.log(formData.businessRole)
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          overflow:"hidden",
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ display: 'flex', flexGrow: 1 }}>
          <Grid container>
            {/* Left */}
            <Grid item xs={12} md={4}  square>

                <LeftPanel
                  firstName={formData.firstName}
                  lastName={formData.lastName}
                  email={formData.email}
                  countryCode={formData.countryCode}
                  phone={formData.phone}
                  businessRoleForm={true}
                  formData={formData} 
                />
            </Grid>

            {/* Right */}
            <Grid item xs={12} md={8} sx={{alignContent: "center",   height: '100vh', overflow: 'auto'}}>
              <Box
                sx={{
                  my: 8,
                  mx: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                 
                }}
              >
                  
                <Box sx={{ px:12}}>
                  <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#1b4d69",textAlign:"center" }}>
                    Unlock New Potential: Identify Your Business Role!
                  </Typography>

                  <Typography variant="subtitle1" sx={{ mb: 3, textAlign:"center" }}>
                    Appeals to entrepreneurs looking to solidify their business identity
                  </Typography>
                </Box>
                <Box component="form"  sx={{ mt: 1,  maxWidth: "550px" }}>
                              
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    {options.map((option) => (
                      <Grid item xs={12} sm={6} key={option.id}>
                        <Paper
                          elevation={3}
                          sx={{
                            p: 2,
                            height: 120,
                            cursor: 'pointer',
                            position: 'relative',
                            border: selected === option.id ? '2px solid #1b4d69' : 'none',
                            borderRadius: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            background:  selected === option.id ? '#eaeef2' : '#fff'
                          }}
                          onClick={() => handleSelect(option.id)}
                        >
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              p: 0,
                            }}
                            disableRipple
                          >
                            {selected === option.id ? (
                              <CheckCircleIcon sx={{ color: '#1b4d69' }} />
                            ) : (
                              <CircleIcon sx={{ color: 'rgba(0, 0, 0, 0.26)' }} />
                            )}
                          </IconButton>
                          <Box sx={{ flexGrow: 1 }} />
                          <Box>
                            <img 
                                src={option.image}  
                                alt={option.title}
                                style={{ width: 35, height: 35, marginBottom: '8px' }}
                            />
                            <Typography variant="h6" gutterBottom>
                              <b>{option.title}</b>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {option.description}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>

                    <Grid item xs={12} sx={{mt:4}}>
                      <Grid container sx={{justifyContent: "flex-end"}}>
                        <Grid item xs={3}>
                          <Button 
                            type="submit" 
                            fullWidth 
                            disabled={!selected} 
                            variant="contained" 
                            sx={{ mt: 3, mb: 2, textTransform: "none", borderRadius: "24px", bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' } }}
                            onClick={handleNextInfoSection}
                          >
                            Next step
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>

                </Box>
              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}