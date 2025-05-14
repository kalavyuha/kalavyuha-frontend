import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  Divider,
  Link,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { constant } from '../../constant.js';

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

export default function CreateBusniessAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    password: '',
    agreeTerms: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        [name]: name === 'agreeTerms' ? checked : value,
      };
      localStorage.setItem('formData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  useEffect(() => {
    const isValid =
      formData.firstName &&
      formData.lastName &&
      formData.phone &&
      formData.password &&
      formData.agreeTerms;

    setIsFormValid(isValid);
  }, [formData]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();
    console.log('Form submitted:', formData);
    
    const optSendUrl = `${constant.baseUrl}api/v1/otp/send/`;
  
    try {

      const response = await fetch(optSendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PhoneNumber: `${formData.countryCode}${formData.phone}`,
        }),
      });

      if (response.status === 200) {
        console.log('OTP sent successfully:', response.data);
        navigate('/otp-verification', { state: formData });
      } 
      else {
        console.error('Error sending OTP:', response.data);
        alert('Failed to send OTP. Please try again.');
      }

    } catch (error) {
      console.error('Error during API call:', error);
      alert('An error occurred while sending the OTP.');
    }
    
  };



  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          overflow:"hidden",
          display: 'flex',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ display: 'flex', flexGrow: 1 }}>
          <Grid container>
            {/* Left */}
            <Grid item xs={12} md={4}>
                <LeftPanel
                  firstName={formData.firstName}
                  lastName={formData.lastName}
                  email={formData.email}
                  countryCode={formData.countryCode}
                  phone={formData.phone}
                  
                />
            </Grid>

            {/* Right */}
            <Grid item xs={12} md={8} sx={{alignContent: "center",   height: '100vh', overflow: 'auto'}}>
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#1b4d69" }}>
                  Create an Account :)
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 3 }}>
                  Let's get started your 90 days free trial
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, maxWidth: 450 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="firstName"
                        required
                        fullWidth
                        label="First Name"
                        autoFocus
                        value={formData.firstName}
                        onChange={handleChange}
                        sx={{ borderRadius: "10px", borderColor: "#d9d9d9", background: "#fbfbfb" }}
                        InputProps={{
                          style: {
                            borderRadius: '10px',
                            background: "#fbfbfb"
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="lastName"
                        required
                        fullWidth
                        label="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        sx={{ borderRadius: "10px", borderColor: "#d9d9d9", background: "#fbfbfb" }}
                        InputProps={{
                          style: {
                            borderRadius: '10px',
                            background: "#fbfbfb"
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        sx={{ borderRadius: "10px", borderColor: "#d9d9d9", background: "#fbfbfb" }}
                        InputProps={{
                          style: {
                            borderRadius: '10px',
                            background: "#fbfbfb"
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={3}>
                          <Select
                            value={formData.countryCode}
                            onChange={handleChange}
                            fullWidth
                            name="countryCode"
                            sx={{ borderRadius: "10px", borderColor: "#d9d9d9", background: "#fbfbfb" }}
                          >
                            <MenuItem value="+91">+91</MenuItem>
                            <MenuItem value="+1">+1</MenuItem>
                            <MenuItem value="+44">+44</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item xs={9}>
                          <TextField
                            required
                            fullWidth
                            name="phone"
                            label="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            sx={{ borderRadius: "10px", borderColor: "#d9d9d9", background: "#fbfbfb" }}
                            InputProps={{
                              style: {
                                borderRadius: "10px",
                                background: "#fbfbfb"
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sx={{ my: 0, mx: 1, py: 0 }}>
                      <Typography sx={{ m: 0, p: 0, fontSize: 12 }}>
                        We will send a verification code to <b>{formData.countryCode} {formData.phone || "- - - - - - - - - -"}</b>
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        sx={{ borderRadius: "10px", borderColor: "#d9d9d9", background: "#fbfbfb" }}
                        InputProps={{
                          style: {
                            borderRadius: '10px',
                            background: "#fbfbfb"
                          },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{ mx: "2px" }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            color="primary"
                          />
                        }
                        label={<span>I agree to the <Link href="/terms" underline="always">Terms of Service</Link> and <Link href="/privacy" underline="always">Privacy Policy</Link></span>}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3, mb: 2, bgcolor: "#1b4d69", fontWeight: "bold", textTransform: "capitalize", padding: 1.2,
                      "&:hover": { bgcolor: "#17394d" },
                    }}
                    disabled={!isFormValid}
                  >
                    Create Account
                  </Button>

                  <Divider sx={{ mb: 2 }}><Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "gray" }}>or</Typography></Divider>

                  {/* <Button fullWidth
                    startIcon={<Box component="img" src={GoogleG} sx={{ width: 20, height: 20 }} />}
                    variant="outlined"
                    sx={{
                      mb: 2, textTransform: "capitalize", fontWeight: "bold", padding: 1.2,
                    }}
                  >
                    Sign Up with Google
                  </Button> */}

                  <Grid container justifyContent="center">
                    <Grid item>
                      <Typography variant="body2">
                        Already have an account?&nbsp;
                        <Link href="/login" underline="always" sx={{ color: "#1b4d69" }}>
                          Login
                        </Link>
                      </Typography>
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
