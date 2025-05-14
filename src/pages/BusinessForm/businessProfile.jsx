import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  Avatar
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Logo from "../../assets/logo/kalavyuha-favicon/kalavyuha-favicon-color.png"
import BusniessProfile from "../../assets/images/busniessAccount/busniessProfile.jpg"
import { MessagesSquare, Send, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import MapComponent from './components/google.map';
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

export default function BusinessProfileForm() {
  const navigate = useNavigate();
  const previousData = useLocation();

  const { firstName, lastName, email, countryCode, phone, selectedId, formData: previousFormData } = previousData.state || {};

  const [formData, setFormData] = useState({
    businessName: previousFormData?.businessName || '',
    introduction: previousFormData?.introduction || '',
    shopName: previousFormData?.shopName || '',
    streetAddress: previousFormData?.streetAddress || '',
    nearBy: previousFormData?.nearBy || '',
    zipCode: previousFormData?.zipCode || '',
    city: previousFormData?.city || '',
    state: previousFormData?.state || '',
    profilePicture: previousFormData?.profilePicture || null, 
    adrsLatitude: previousFormData?.adrsLatitude || '',
    adrsLongitude: previousFormData?.adrsLongitude || '',
  });

  const [isNextDisabled, setIsNextDisabled] = useState(true);

  // Function to navigate back and preserve form data
  const handleBack = () => {
    const combinedData = {
      ...previousData.state,
      formData, 
    };
    navigate('/business-info-selection', { state: combinedData });
  };

  const handleNextTeamPresence = () => {
    const combinedData = {
      ...previousData.state,
      formData,
      businessInfoCompleted:true,
      teamInfoCompleted:false
    };
    console.log(combinedData)
    navigate('/business-team-presence', { state: combinedData });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLocationSelect = (selectedData) => {
    const { address, lat, lng } = selectedData;
  
    const parts = address.split(", ").map(item => item.trim());
    const totalParts = parts.length;
  
    if (totalParts < 3) return;
  
    const shopName = parts[0];
    const lastPart = parts[totalParts - 1];
    const zipStatePart = parts[totalParts - 2];
  
    const zipMatch = zipStatePart.match(/\d{6}$/);
    const zipCode = zipMatch ? zipMatch[0] : "";
  
    const state = zipCode ? zipStatePart.replace(zipCode, "").trim() : zipStatePart;
    const city = totalParts >= 4 ? parts[totalParts - 3] : "";
    const streetAddress = totalParts >= 5 ? parts.slice(1, totalParts - 3).join(", ") : "";
  
    setFormData({
      shopName,
      streetAddress,
      city,
      state,
      zipCode,
      adrsLatitude: lat, 
      adrsLongitude: lng,  
      busniessComplete:true,
    });
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFormData((prevState) => ({
        ...prevState,
        profilePicture: file,
      }));
    }
  };

  useEffect(() => {
    const { businessName, introduction, streetAddress, zipCode, city, state } = formData;
    const isFormValid = businessName && introduction && streetAddress && zipCode && city && state;
    setIsNextDisabled(!isFormValid);
  }, [formData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
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
            {/* Left side */}
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

            {/* Right side - form */}
            <Grid 
              item 
              xs={12} 
              md={8} 
              sx={{
                alignContent: "center", 
                height: '100vh', 
                overflow: 'auto', 
                py: 2,
                scrollbarWidth: 'none',  
                '&::-webkit-scrollbar': { display: 'none' } 
              }}
            >
              <Box
                sx={{
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#1b4d69", textAlign:"Center"}}>
                  Introduce your {selectedId} <br></br> Services Profile
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 3 }}>
                  Let's get your business profile set up in less than 2 minutes.
                </Typography>

                <Box component="form" noValidate onSubmit={handleSubmit} sx={{  maxWidth: 500 }}>
                  <Grid container spacing={2}>
                    <Grid container justifyContent="left" sx={{ my: 0.5, px:2 }}>
                      <Grid item>
                        <b>Business Introduction</b>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="businessName"
                        required
                        fullWidth
                        label="Business Name"
                        autoFocus
                        value={formData.businessName}
                        onChange={handleChange}
                        sx={{ borderRadius: "10px", borderColor:"#d9d9d9", background:"#fbfbfb" }}
                        InputProps={{
                          style: {
                            borderRadius: '10px',
                            background:"#fbfbfb"
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Grid container spacing={2} alignItems="center" sx={{justifyContent:"right"}}>
                        <Grid item>
                          <Avatar
                            src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : BusniessProfile}
                            alt="Profile"
                            sx={{ width: 56, height: 56, borderRadius:3, border:1, borderColor:"#d9d9d9" }}
                          />
                        </Grid>
                        <Grid item>
                          <Button
                            variant="outlined"
                            component="label"
                            sx={{ borderRadius: "10px", borderColor:"#d9d9d9", background:"#fbfbfb", textTransform: "none" }}
                          >
                            Upload Picture
                            <input type="file" hidden onChange={handleFileChange} />
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sx={{mb:1}}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={3}
                        label="Share Your Business Story"
                        name="introduction"
                        placeholder='Explain what makes your business unique...'
                        value={formData.introduction}
                        onChange={handleChange}
                        sx={{ borderRadius: "10px", borderColor:"#d9d9d9", background:"#fbfbfb" }}
                        InputProps={{
                          style: {
                            borderRadius: '10px',
                            background:"#fbfbfb"
                          }
                        }}
                      />
                    </Grid>

                    <Grid container justifyContent="left" sx={{ my: 0.5, px:2 }}>
                      <Grid item>
                        <b>Location</b>
                      </Grid>
                    </Grid>

                    {/* google map */}
                    <MapComponent  onSelectLocation={handleLocationSelect} />


                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="shopName"
                        fullWidth
                        label="Shop No."
                        value={formData.shopName}
                        onChange={handleChange}
                        sx={{ borderRadius: "10px", borderColor:"#d9d9d9", background:"#fbfbfb" }}
                        InputProps={{
                          style: {
                            borderRadius: '10px',
                            background:"#fbfbfb"
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={8}>
                      <TextField
                        name="streetAddress"
                        required
                        fullWidth
                        label="Street Address"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        sx={{ borderRadius: "10px", borderColor:"#d9d9d9", background:"#fbfbfb" }}
                        InputProps={{
                          style: {
                            borderRadius: '10px',
                            background:"#fbfbfb"
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <TextField
                        name="city"
                        required
                        fullWidth
                        label="City"
                        value={formData.city}
                        onChange={handleChange}
                        sx={{ borderRadius: "10px", borderColor:"#d9d9d9", background:"#fbfbfb" }}
                        InputProps={{
                          style: {
                            borderRadius: '10px',
                            background:"#fbfbfb"
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="state"
                        required
                        fullWidth
                        label="State"
                        value={formData.state}
                        onChange={handleChange}
                        sx={{ borderRadius: "10px", borderColor:"#d9d9d9", background:"#fbfbfb" }}
                        InputProps={{
                          style: {
                            borderRadius: '10px',
                            background:"#fbfbfb"
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextField
                        name="zipCode"
                        required
                        fullWidth
                        label="Zip Code"
                        value={formData.zipCode}
                        onChange={handleChange}
                        sx={{ borderRadius: "10px", borderColor:"#d9d9d9", background:"#fbfbfb" }}
                        InputProps={{
                          style: {
                            borderRadius: '10px',
                            background:"#fbfbfb"
                          }
                        }}
                      />
                    </Grid>


                    <Grid item xs={12}>
                      <Grid container sx={{justifyContent: "space-between"}}>
                        
                        <Grid item xs={3}>
                          <Button 
                            fullWidth
                            variant="outlined" 
                            sx={{ mt: 3,  borderRadius: "24px",color: "black", textTransform: "none", borderColor: "#d9d9d9", background:"#fbfbfb" }}
                            onClick={handleBack}
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
                            sx={{ mt: 3, textTransform: "none", borderRadius: "24px", bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' } }}
                            disabled={isNextDisabled}
                            onClick={handleNextTeamPresence}
                          >
                            Next step
                          </Button>
                        </Grid>
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
