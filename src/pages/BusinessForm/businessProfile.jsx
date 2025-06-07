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
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapComponent from './components/google.map';
import LeftPanel from './components/leftpanel.js'; 
import { uploadImages } from './Apis/uploadAPI.js'


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

  const [formData, setFormData] = useState({
    businessName: previousData.formData?.businessName || '',
    introduction: previousData.formData?.introduction || '',
    shopName: previousData.formData?.shopName || '',
    streetAddress: previousData.formData?.streetAddress || '',
    nearBy: previousData.formData?.nearBy || '',
    zipCode: previousData.formData?.zipCode || '',
    city: previousData.formData?.city || '',
    state: previousData.formData?.state || '',
    profilePicture: previousData.formData?.profilePicture || null,
    adrsLatitude: previousData.formData?.adrsLatitude || '',
    adrsLongitude: previousData.formData?.adrsLongitude || '',
  });

  const [isNextDisabled, setIsNextDisabled] = useState(true);

  useEffect(() => {
    const updateLocalStorage = () => {
      try {
        const combinedData = {
          ...previousData,
          formData,
          businessInfoCompleted: true,
        };
        localStorage.setItem('formData', JSON.stringify(combinedData));
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }
    };

    updateLocalStorage();
  }, [formData, previousData]);

  const handleBack = () => {
    const combinedData = {
      ...previousData,
      formData,
    };
    localStorage.setItem('formData', JSON.stringify(combinedData));
    navigate('/business-role-selection', { state: combinedData });
  };

  const handleNextTeamPresence = () => {
    const dataToStore = {
      ...previousData,
      formData: {
        ...formData,
         profilePicture: formData.profilePicture?.s3Url 
        ? { s3Url: formData.profilePicture.s3Url } 
        : null
      },
      businessInfoCompleted: true,
      teamInfoCompleted: false
    };
    
    console.log(dataToStore)
    localStorage.setItem('formData', JSON.stringify(dataToStore));
    navigate('/business-team-presence', { state: dataToStore });
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
  
    setFormData(prev => ({
      ...prev,
      shopName,
      streetAddress,
      city,
      state,
      zipCode,
      adrsLatitude: lat, 
      adrsLongitude: lng,
    }));
  };

 
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const token = 'VIRoHdqUAtpklgKg'; 
      const { data, error: uploadError } = await uploadImages([file], token);

      if (uploadError) {
        throw new Error(uploadError);
      }

      const uploadedUrl = data?.Data?.[0];
      if (!uploadedUrl) throw new Error('No URL returned from upload');

      setFormData((prev) => ({
        ...prev,
        profilePicture: {
          s3Url: uploadedUrl,
        },
      }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert(`Image upload failed: ${err.message}`);
    }
  };


  useEffect(() => {
    const { businessName, introduction, streetAddress, zipCode, city, state, profilePicture } = formData;
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
                  formData={previousData} 
                />
            </Grid>

            {/* Right side - form */}
            <Grid 
              item 
              xs={12} 
              md={8} 
            >
              <Box
                sx={{
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  maxHeight: '91vh',
                  padding: 2.5,
                  margin: 2,
                  overflow: 'auto', 
                  scrollbarWidth: 'none',  
                  '&::-webkit-scrollbar': { display: 'none' } 
                  }}
              >
                <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: "bold", color: "#1b4d69", textAlign:"Center"}}>
                  Introduce your {selectedId}  Services Profile
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
                        sx={{ borderRadius: "10px", borderColor:"#d9d9d9", background:"#fbfbfb", p:0 }}
                        InputProps={{
                          style: {
                            borderRadius: '10px',
                            background:"#fbfbfb"
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Grid container spacing={2} alignItems="center" sx={{ justifyContent: "right" }}>
                        <Grid item>
                          <Avatar
                            src={formData.profilePicture?.s3Url?.url || ""}
                            alt="Profile"
                            sx={{ width: 56, height: 56, borderRadius: 3, border: 1, borderColor: "#d9d9d9" }}
                          />


                        </Grid>
                        <Grid item>
                          <Button
                            variant="outlined"
                            component="label"
                            sx={{ borderRadius: "10px", borderColor: "#d9d9d9", background: "#fbfbfb", textTransform: "none" }}
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
