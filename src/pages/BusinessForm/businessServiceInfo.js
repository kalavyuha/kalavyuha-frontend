import React,{useRef, useState, useEffect} from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Logo from "../../assets/logo/kalavyuha-favicon/kalavyuha-favicon-color.png"
import { MessagesSquare, Send, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { message } from 'antd';

import { useLocation, useNavigate } from 'react-router-dom';
import ServiceFormBox from '../../components/serviceMenu';
import LeftPanel from './components/leftpanel'

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

export default function BusinessServiceInfo() {
  const previousData = useLocation();
  const navigate = useNavigate();

  const { 
    firstName, lastName, email, countryCode, phone,
    formData, teamSize, teamMembers, services: previousServices 
  } = previousData.state || {};

  const defaultService = [{
    id: '1',
    name: 'Enter Service Name',
    price: '-',
    duration: '-',
    durationType: 'mins',
    staff: [],
    uploaded: false,
    checked: false,
    image: null
  }];

  const [services, setServices] = useState(
    previousServices?.length > 0 ? previousServices : defaultService
  );

  const handleBackTeamPresence = () => {
    navigate('/business-team-presence', { state: { ...previousData.state, services } });
  };

  const handleNextDocumentUpload = () => {
    if (services.filter(service => service.name.trim() !== '').length < 5) {
      message.error("Please upload at least 5 non-empty services.");
      return;
    }
    console.log(previousData.state)
    navigate('/business-document-uploads', { state: { ...previousData.state, services } });
  };

  const handleServicesChange = (updatedServices) => {
    setServices(updatedServices);
  };
  


  
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
            <Grid item xs={12} md={4} square>
                  
                <LeftPanel
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  countryCode={countryCode}
                  phone={phone}
                  isSignIn={true}
                  formData={previousData.state} 
                />
            </Grid>

            {/* Right */}
            <Grid item xs={12} md={8} sx={{alignContent: "center",  height: '100vh', overflow: 'auto'}}>
              <Box
                sx={{
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
              >
                <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#1b4d69",textAlign:"center" }}>
                  Detailed Service Information
                </Typography>

                <Typography variant="subtitle1" sx={{ mb: 3, textAlign:"center" }}>
                  Showcase your service offerings with details on pricing, <br />duration, and available staff.    
                </Typography>

                <ServiceFormBox 
                  onServicesChange={handleServicesChange} 
                  services={previousServices} 
                  teamMembers={teamMembers || []} 
                />
                
                <Box sx={{ mt: 2, maxWidth: 600, width: '100%', mx: 4 }}>
                    <Grid item xs={12} sx={{mt:2}}>
                        <Grid container sx={{justifyContent: "space-between"}}>
                        
                        <Grid item xs={3}>
                            <Button 
                              fullWidth
                              variant="outlined" 
                              sx={{ mt: 3, mb: 2, borderRadius: "24px",color: "black", textTransform: "none", borderColor: "#d9d9d9", background:"#fbfbfb" }}
                              onClick={handleBackTeamPresence}
                              
                            >
                            <ArrowLeft className="mr-2" style={{ width: "26px", height: "16px" }} />
                            <b>Go Back</b>
                            </Button>
                        </Grid>


                        <Grid item xs={3}>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                              mt: 3,
                              mb: 2,
                              textTransform: "none",
                              borderRadius: "24px",
                              bgcolor: 'black',
                              color: 'white',
                              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                            }}
                            onClick={handleNextDocumentUpload}
                            // disabled={services.length < 5}
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