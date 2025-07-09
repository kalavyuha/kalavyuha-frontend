import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import LeftPanel from './components/leftpanel.js'; 
import { constant } from '../../constant.js';

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

export default function OTPVerification() {
    const inputRefs = useRef([]);
    const [otpValue, setOtpValue] = useState(Array(6).fill(''));
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
    
    const previousData = useLocation();
    const navigate = useNavigate();
    const { firstName, lastName, email, countryCode, phone, password } = previousData.state || {};

    useEffect(() => {
      let timer;
      if (resendDisabled && countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else if (countdown === 0) {
        setResendDisabled(false);
      }
      return () => clearTimeout(timer);
    }, [resendDisabled, countdown]);

    const handleChange = (event, index) => {
        const newOtpValue = [...otpValue];
        newOtpValue[index] = event.target.value;

        if (event.target.value.length === 1 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }

        setOtpValue(newOtpValue);
    };

    const handleVerifyOTP = async () => {
        setIsLoading(true);
        const enteredOtp = otpValue.join('');
        
        const otpVerifyUrl = `${constant.baseUrl}api/v1/otp/verify/`;
        const createBusinessMemberUrl = `${constant.baseUrl}api/v1/BussinessMember/create/`;
    
        try {
            const response = await fetch(otpVerifyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    PhoneNumber: `${countryCode}${previousData.state.phone}`, 
                    OTP: enteredOtp, 
                    UserType: "merchant",
                }),
            });
            const data = await response.json();
    
            console.log(data);
            
            // if (data.Status === 404) {
            if (response.ok && data.Status === 200) {
                    setMessage('Account Created Successfully!');
                
                const { firstName, lastName, email, countryCode, phone, password } = previousData.state || {};
    
                const businessMemberResponse = await fetch(createBusinessMemberUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        FirstName: firstName,
                        LastName: lastName,
                        Email: email,
                        PhoneNumber: `${countryCode}${phone}`,
                        Password: password,
                    }),
                });
    
                const businessMemberData = await businessMemberResponse.json();
                console.log(businessMemberData);
                
                if (businessMemberResponse.ok && businessMemberData.Status === 200) {
                    setTimeout(() => {
                        setOpen(false);
                        navigate('/business-role-selection', { 
                            state: { 
                                ...previousData.state, 
                                MerchantAccountID: businessMemberData.Data._id 
                            } 
                        });
                    }, 2000);
                } else {
                    setMessage('Failed to create business member. Please try again.');
                }
            } else {
                setMessage('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('OTP Verification Error:', error);
            setMessage('An error occurred during OTP verification. Please try again.');
        } finally {
            setIsLoading(false);
            setOpen(true);
        }
    };
    
    const handleResendOTP = async () => {
        setResendDisabled(true);
        setCountdown(30);
    
        const optSendUrl = `${constant.baseUrl}api/v1/otp/send/`;

        try {
            const response = await fetch(optSendUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    PhoneNumber: previousData.state.phone,
                }),
            });
    
            if (response.status === 200 && response.data?.Status === 'Success') {
                setMessage('New OTP sent successfully!');
            } else {
                setMessage('Failed to resend OTP. Please try again.');
            }

        } catch (error) {
          console.error('Resend OTP Error:', error);
          setMessage('Failed to resend OTP. Please try again.');
        } finally {
          setOpen(true);
        }
      };

    const editNumber = () => {
        navigate('/business-account', { state: previousData.state });    
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
                        {/* Left side  */}
                        <Grid item xs={12} md={4} square>
                            <LeftPanel
                                firstName={firstName}
                                lastName={lastName}
                                email={email}
                                countryCode={countryCode}
                                phone={phone}
                                formData={previousData.state} 
                            />
                        </Grid>

                        {/* Right side  */}
                        <Grid item xs={12} md={8} sx={{alignContent: "center",   height: '100vh', overflow: 'auto'}}>
                            <Box
                                sx={{
                                    my: 8,
                                    mx: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: "center"
                                }}
                            >
                                <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#1b4d69" }}>
                                    Enter The Code
                                </Typography>

                                <Typography variant="subtitle1" sx={{ mb: 3 }}>
                                    Enter the OTP code that we sent to your phone number <b>{countryCode} {phone}</b>. <br /> Be careful not to share the code with anyone.
                                </Typography>

                                <Box sx={{ mt: 1, maxWidth: 450 }}>
                                    <Grid container spacing={2} justifyContent="center" sx={{ my: 3 }}>
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <Grid item key={index}>
                                                <TextField
                                                    variant="outlined"
                                                    inputProps={{ 
                                                        maxLength: 1, 
                                                        style: { textAlign: 'center' },
                                                        'aria-label': `Input ${index + 1}`
                                                    }}
                                                    InputProps={{
                                                        sx: { height: 76, fontWeight: "bold", fontSize: 25, borderRadius: 2 }
                                                    }}
                                                    sx={{ width: 56, background: "#fbfbfb" }}
                                                    placeholder="-" 
                                                    inputRef={el => inputRefs.current[index] = el} 
                                                    onChange={(event) => handleChange(event, index)}
                                                    value={otpValue[index]}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: "10px", textTransform: "capitalize" }}
                                        onClick={handleVerifyOTP}
                                        disabled={isLoading || otpValue.join('').length !== 6}
                                    >
                                        {isLoading ? <CircularProgress size={24} /> : 'Verify OTP'}
                                    </Button>
                                    
                                    <Grid container spacing={4}>
                                        <Grid item xs={6}>
                                            <Button
                                            fullWidth
                                            variant="text"
                                            sx={{ 
                                                mb: 2, 
                                                textTransform: "capitalize", 
                                                borderRadius:"8px",
                                                background:"#dfecf4",
                                                '&:hover':{
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                }
                                            }}
                                            onClick={handleResendOTP}
                                            disabled={resendDisabled}
                                            >
                                            <b>{resendDisabled ? `Resend OTP in ${countdown}s` : 'Resend OTP'}</b>
                                            </Button>
                                        </Grid>
                                        
                                        <Grid item xs={6}>
                                            <Button
                                            fullWidth
                                            variant="text"
                                            sx={{ 
                                                mb: 2, 
                                                borderRadius:"8px",
                                                background:"#dfecf4",
                                                textTransform: "capitalize",
                                                '&:hover':{
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                }
                                            }}
                                            onClick={editNumber} 
                                            >
                                            <b>Edit Number</b>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid container justifyContent="center" sx={{ my: 0.5 }}>
                                        <Grid item>
                                            <b>One more step to get started</b>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>

                {/* Dialog for OTP Verification Result */}
                <Dialog 
                    open={open}
                    onClose={() => setOpen(false)}
                    PaperProps={{ 
                        sx: { 
                        borderRadius: "15px", 
                        
                        }
                    }} 
                >
                    <DialogTitle>OTP Verification</DialogTitle>
                    <DialogContent sx={{py:0}}>
                        <Typography>{message}</Typography>
                    </DialogContent>
                    <DialogActions sx={{mx:2, mt:1}}>
                        <Button onClick={() => setOpen(false)} color="primary">
                           <b>Close</b>
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
}