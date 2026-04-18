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
import MapComponent from './components/location.map';
import LeftPanel from './components/leftpanel.js'; 
import { uploadImages } from './Apis/uploadAPI.js';

// Theme configuration
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

// Common text field styles
const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#fbfbfb',
    '& fieldset': {
      borderColor: '#d9d9d9',
    },
  },
};

export default function BusinessProfileForm() {
  const navigate = useNavigate();
  const [manualEditMode, setManualEditMode] = useState(false);
  
  // Get stored data from localStorage
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

  // Form state
  const [formData, setFormData] = useState({
    businessName: previousData.formData?.businessName || '',
    introduction: previousData.formData?.introduction || '',
    shopName: previousData.formData?.shopName || '',
    streetAddress: previousData.formData?.streetAddress || '',
    zipCode: previousData.formData?.zipCode || '',
    city: previousData.formData?.city || '',
    state: previousData.formData?.state || '',
    country: previousData.formData?.country || '',
    profilePicture: previousData.formData?.profilePicture || null,
    adrsLatitude: previousData.formData?.adrsLatitude || '',
    adrsLongitude: previousData.formData?.adrsLongitude || '',
  });

  const [isNextDisabled, setIsNextDisabled] = useState(true);
  
  // Create combined data object for LeftPanel that updates immediately
  const [currentFormData, setCurrentFormData] = useState(() => ({
    ...previousData,
    formData: {
      businessName: previousData.formData?.businessName || '',
      introduction: previousData.formData?.introduction || '',
      shopName: previousData.formData?.shopName || '',
      streetAddress: previousData.formData?.streetAddress || '',
      zipCode: previousData.formData?.zipCode || '',
      city: previousData.formData?.city || '',
      state: previousData.formData?.state || '',
      country: previousData.formData?.country || '',
      profilePicture: previousData.formData?.profilePicture || null,
      adrsLatitude: previousData.formData?.adrsLatitude || '',
      adrsLongitude: previousData.formData?.adrsLongitude || '',
    },
    businessInfoCompleted: true,
  }));

  // Update currentFormData whenever formData changes
  useEffect(() => {
    setCurrentFormData(prev => ({
      ...prev,
      formData: formData,
    }));
    
    // Also update localStorage
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
  }, [formData, previousData]);

  // Validate form and update next button state
  useEffect(() => {
    const { businessName, introduction, streetAddress, zipCode, city, state, adrsLatitude, adrsLongitude } = formData;
    const isFormValid = businessName && introduction && streetAddress && zipCode && city && state && adrsLatitude && adrsLongitude;
    setIsNextDisabled(!isFormValid);
  }, [formData]);

  // Navigation handlers
  const handleBack = () => {
    const combinedData = {
      ...previousData,
      formData,
    };
    localStorage.setItem('formData', JSON.stringify(combinedData));
    navigate('/business/role-selection', { state: combinedData });
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
    
    localStorage.setItem('formData', JSON.stringify(dataToStore));
    navigate('/business/team-presence', { state: dataToStore });
  };

  // Form change handlers
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddressChange = (event) => {
    if (!manualEditMode) {
      alert("Please select a location on the map first");
      return;
    }
    handleChange(event);
  };

  const handleLocationSelect = (selectedData) => {
    const { address, display_name, lat, lng } = selectedData;
    
    const shopName = display_name?.split(",")[0] || "";  
    const streetAddress = address.road || address.neighbourhood || address.suburb || "";
    const city = address.city || address.town || address.village || "";
    const state = address.state || "";
    const zipCode = address.postcode || "";
    const country = address.country || "";
  
    setFormData(prev => ({
      ...prev,
      shopName,
      streetAddress,
      city,
      state,
      country,
      zipCode,
      adrsLatitude: lat, 
      adrsLongitude: lng,
    }));
    
    setManualEditMode(true);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    try {
      const token = process.env.REACT_APP_UPLOAD_TOKEN || 'VIRoHdqUAtpklgKg'; 
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
      alert(`Image upload failed: ${err.message}`);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  // Section title component
  const SectionTitle = ({ children }) => (
    <Grid container justifyContent="left" sx={{ my: { xs: 0.5, lg: 0.25 }, px: { xs: 2, sm: 2 } }}>
      <Grid item>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: "bold", 
            fontSize: { xs: '1rem', sm: '1.1rem', lg: '0.95rem' } 
          }}
        >
          {children}
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          overflow: "hidden",
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ display: 'flex', flexGrow: 1 }}>
          <Grid container>
            {/* Left Panel */}
            <Grid item xs={12} lg={4} md={5}>
              <LeftPanel
                firstName={firstName}
                lastName={lastName}
                email={email}
                countryCode={countryCode}
                phone={phone}
                isSignIn={true}
                formData={currentFormData}  // Pass the current form data that updates immediately
              />
            </Grid>

            {/* Right Panel - Form */}
            <Grid item xs={12} lg={8} md={7}>
              <Box
                sx={{
                  mx: { xs: 1, sm: 2, md: 3, lg: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: { lg: '100vh' },
                  maxHeight: { xs: '91vh', lg: 'none' },
                  padding: { xs: 1, sm: 2, md: 2.5, lg: 1 },
                  margin: { xs: 1, sm: 2, lg: 0 },
                  overflow: { xs: 'auto', lg: 'visible' }, 
                  scrollbarWidth: 'none',  
                  '&::-webkit-scrollbar': { display: 'none' },
                  justifyContent: { lg: 'center' }
                }}
              >
                {/* Header */}
                <Typography 
                  component="h1" 
                  variant="h5" 
                  sx={{ 
                    mb: { xs: 1, lg: 0.5 }, 
                    fontWeight: "bold", 
                    color: "#1b4d69", 
                    textAlign: "center",
                    fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem', lg: '2rem' },
                    px: { xs: 1, sm: 0 }
                  }}
                >
                  Introduce your {selectedId} Services Profile
                </Typography>
                
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: { xs: 3, lg: 1.5 }, 
                    textAlign: "center",
                    fontSize: { xs: '0.9rem', sm: '1rem', lg: '0.9rem' },
                    px: { xs: 1, sm: 0 }
                  }}
                >
                  Let's get your business profile set up in less than 2 minutes.
                </Typography>

                {/* Form */}
                <Box 
                  component="form" 
                  noValidate 
                  onSubmit={handleSubmit} 
                  sx={{ 
                    maxWidth: { xs: '100%', sm: 500, lg: 600 }, 
                    width: '100%' 
                  }}
                >
                  <Grid container spacing={{ xs: 2, lg: 1 }}>
                    
                    {/* Business Introduction Section */}
                    <SectionTitle>Business Introduction</SectionTitle>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="businessName"
                        required
                        fullWidth
                        label="Business Name"
                        autoFocus
                        value={formData.businessName}
                        onChange={handleChange}
                        sx={textFieldStyles}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Grid 
                        container 
                        spacing={2} 
                        alignItems="center" 
                        sx={{ justifyContent: { xs: "left", sm: "right" } }}
                      >
                        <Grid item>
                          <Avatar
                            src={formData.profilePicture?.s3Url || ""}
                            alt="Profile"
                            sx={{ 
                              width: { xs: 48, sm: 56 }, 
                              height: { xs: 48, sm: 56 }, 
                              borderRadius: 3, 
                              border: 1, 
                              borderColor: "#d9d9d9" 
                            }}
                          />
                        </Grid>
                        <Grid item>
                          <Button
                            variant="outlined"
                            component="label"
                            sx={{ 
                              borderRadius: "10px", 
                              borderColor: "#d9d9d9", 
                              background: "#fbfbfb", 
                              textTransform: "none",
                              fontSize: { xs: '0.8rem', sm: '0.9rem' },
                              px: { xs: 1, sm: 2 }
                            }}
                          >
                            Upload Picture
                            <input 
                              type="file" 
                              hidden 
                              accept="image/*" 
                              onChange={handleFileChange} 
                            />
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sx={{ mb: { xs: 1, lg: 0.5 } }}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={{ xs: 3, lg: 2 }}
                        label="Share Your Business Story"
                        name="introduction"
                        placeholder="Explain what makes your business unique..."
                        value={formData.introduction}
                        onChange={handleChange}
                        sx={textFieldStyles}
                      />
                    </Grid>

                    {/* Location Section */}
                    <SectionTitle>Location</SectionTitle>

                    {/* Google Map Component */}
                    <MapComponent 
                      onSelectLocation={handleLocationSelect} 
                      initialPosition={
                        formData.adrsLatitude && formData.adrsLongitude 
                          ? { lat: formData.adrsLatitude, lng: formData.adrsLongitude } 
                          : null
                      }
                    />

                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="shopName"
                        fullWidth
                        label="Shop No."
                        value={formData.shopName}
                        onChange={handleChange}
                        sx={textFieldStyles}
                      />
                    </Grid>

                    <Grid item xs={12} sm={8}>
                      <TextField
                        name="streetAddress"
                        required
                        fullWidth
                        label="Street Address"
                        value={formData.streetAddress}
                        onChange={handleAddressChange}
                        sx={textFieldStyles}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={5}>
                      <TextField
                        name="city"
                        required
                        fullWidth
                        label="City"
                        value={formData.city}
                        onChange={handleAddressChange}
                        sx={textFieldStyles}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} md={4}>
                      <TextField
                        name="state"
                        required
                        fullWidth
                        label="State"
                        value={formData.state}
                        onChange={handleAddressChange}
                        sx={textFieldStyles}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} md={3}>
                      <TextField
                        name="zipCode"
                        required
                        fullWidth
                        label="Zip Code"
                        value={formData.zipCode}
                        onChange={handleChange}
                        sx={textFieldStyles}
                      />
                    </Grid>

                    {/* Navigation Buttons */}
                    <Grid item xs={12}>
                      <Grid container sx={{ justifyContent: "space-between" }} spacing={1}>
                        <Grid item xs={6}>
                          <Button 
                            fullWidth
                            variant="outlined" 
                            sx={{ 
                              mt: { xs: 3, lg: 1.5 }, 
                              borderRadius: "24px",
                              color: "black", 
                              textTransform: "none", 
                              borderColor: "#d9d9d9", 
                              background: "#fbfbfb",
                              fontSize: { xs: '0.9rem', sm: '1rem', lg: '0.9rem' },
                              py: { xs: 1, sm: 1.5, lg: 1 }
                            }}
                            onClick={handleBack}
                          >
                            <ArrowLeft className="mr-2" style={{ width: "20px", height: "16px" }} />
                            <b>Go Back</b>
                          </Button>
                        </Grid>

                        <Grid item xs={6}>
                          <Button 
                            type="submit" 
                            fullWidth 
                            variant="contained" 
                            sx={{ 
                              mt: { xs: 3, lg: 1.5 }, 
                              textTransform: "none", 
                              borderRadius: "24px", 
                              bgcolor: 'black', 
                              color: 'white', 
                              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                              fontSize: { xs: '0.9rem', sm: '1rem', lg: '0.9rem' },
                              py: { xs: 1, sm: 1.5, lg: 1 }
                            }}
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