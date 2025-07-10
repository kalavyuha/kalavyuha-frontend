import React, {useEffect,useState} from 'react';
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
import { ArrowLeft } from 'lucide-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import {  RadioButtonUnchecked as CircleIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import {  message } from 'antd';
import LeftPanel from "./components/leftpanel"

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



export default function BusinessInfoSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

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
  const { firstName, lastName, email, countryCode, phone, businessRole } = previousData;

  const options = [
    { id: 'no-website', icon: PendingActionsIcon, title: 'No Website?', description: 'Enter Your Details and Get Started.' },
    { id: 'have-website', icon: AutoModeIcon, title: 'Have a Website?', description: "Let's Fetch Your Details in Seconds!" },
  ];

  useEffect(() => {
    try {
      const savedSelection = localStorage.getItem('websiteOption');
      if (savedSelection) {
        setSelected(JSON.parse(savedSelection));
      }
      
      if (previousData.website) {
        setSelected(previousData.website);
      }
    } catch (error) {
      console.error('Error parsing saved selection:', error);
    }
  }, [previousData.website]);

  const handleSelect = (id) => {
    try {
      setSelected(id);
      
      // localStorage
      localStorage.setItem('websiteOption', JSON.stringify(id));
      
      const updatedFormData = {
        ...previousData,
        website: id
      };
      localStorage.setItem('formData', JSON.stringify(updatedFormData));
    } catch (error) {
      console.error('Error saving selection:', error);
    }
  };

  const handleNext = () => {
    if (!selected) {
      console.warn('No option selected');
      return;
    }

    try {
      const formData = {
        ...previousData,
        website: selected
      };
      localStorage.setItem('formData', JSON.stringify(formData));

      if (selected === 'no-website') {
        navigate('/business-profile-form', { state: formData });
      } else if (selected === 'have-website') {
        localStorage.removeItem("formData");
        message.error('Functionality Under Progress PLEASE GO BACK');
        navigate('/under-development');
      }
    } catch (error) {
      console.error('Error during navigation:', error);
    }
  };

  const handleBackRoleSelect = () => {
    navigate('/business-role-selection', { state: previousData });
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
            <Grid item xs={12} md={4}  square>

              
                <LeftPanel
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  countryCode={countryCode}
                  phone={phone}
                  businessRoleForm = {true}
                  formData={previousData} 
                />
            </Grid>

            {/* Right */}
            <Grid item xs={12} md={8}  sx={{alignContent: "center",   height: '100vh', overflow: 'auto'}}>
              <Box
                sx={{
                  my: 8,
                  mx: {xs:2, sm:6},
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                
                  <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#1b4d69",textAlign:"center" }}>
                      How Would You Like to Share Your <br></br> {businessRole} Business Details?
                  </Typography>

                  <Typography variant="subtitle1" sx={{ mb: 3, textAlign:"center" }}>
                      How Would You Like to Share Your Business Details?
                  </Typography>
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
                            <option.icon color="primary" sx={{ fontSize: 35, mb: 1 }} />
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

                  <Grid item xs={12} sx={{mt:3}}>
                      <Grid container sx={{justifyContent: "space-between"}} spacing={2}>
                        <Grid item xs={6}>
                          <Button 
                            fullWidth
                            variant="outlined" 
                            sx={{ mt: 3, mb: 2, borderRadius: "24px",color: "black", textTransform: "none", borderColor: "#d9d9d9", background:"#fbfbfb" }}
                            onClick={handleBackRoleSelect}
                          >
                          <ArrowLeft className="mr-2" style={{ width: "26px", height: "16px" }} />
                            <b>Go Back</b>
                          </Button>
                        </Grid>

                        <Grid item xs={6}>
                          <Button 
                            type="submit" 
                            fullWidth 
                            disabled={!selected}
                            variant="contained" 
                            sx={{ mt: 3, mb: 2, textTransform: "none", borderRadius: "24px", bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' } }}
                            onClick={handleNext}
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