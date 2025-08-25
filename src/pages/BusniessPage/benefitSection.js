import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText, InputAdornment, TextField,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,

} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function BenefitsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleCountryCodeChange = (event) => {
    setCountryCode(event.target.value);
  };

  const handleMobileNumberChange = (event) => {
    setMobileNumber(event.target.value);
  };

  const benefits = [
    '0% Commission for the First 2 Months',
    'Support at Every Minute',
    'Analyze Your Business Growth',
    'Personalized Business Dashboard',
    'Exclusive Marketing Opportunities',
    'Seamless Calendar Integration',
  ];

  const listItemTextStyles = {
    '& .MuiListItemText-primary': {
      fontSize: {
        xs: '0.7rem',
        sm: '0.75rem',
        md: '0.8rem'
      },
      margin: 0,
      mx: { xs: 1, sm: 1.5, md: 2 },
      fontFamily: "Raleway"
    }
  };

  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(to right, #1b4d69, #000)', 
        color: 'white', 
        py: { xs: 2, md: 1 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'center', md: 'flex-start' },
          p: { xs: 2, sm: 3, md: 4 },
          gap: { xs: 4, md: 6 }
        }}>
          {/* Left Section */}
          <Box sx={{ 
            maxWidth: { xs: '100%', md: '50%' },
            mb: { xs: 3, md: 0 },
            textAlign: { xs: 'center', md: 'left' },
          }}>
            <Typography 
              variant="overline" 
              fontWeight="bold" 
              sx={{ 
                color: '#59eada',
                fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' }
              }}
            >
              MENTORING APPOINTMENTS
            </Typography>

            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                my: 1,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
              }} 
              fontFamily="Raleway"
            >
              Benefits of Joining Kalavyhua for You.
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3,
                mt: 2,
                fontSize: { xs: 12, sm: 14, md: 16 },
                
                maxWidth: { xs: '100%', md: '80%' }
              }}
            >
              Kalavyhua has many experienced mentors who are ready to help you manage your business.
            </Typography>
            
            <Box>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  justifyContent: { xs: 'center', md: 'space-between' },
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  height: 'max-content',
                }}
              >
                
                  <Button
                    variant="contained"
                    color="white"
                    sx={{
                      marginTop: { xs: '8px', sm: 0 }, 
                      background: 'black',
                      width: '15vh',
                      textTransform:"capitalize"
                    }}
                  >
                    List Now
                  </Button>
              </Box>
            </Box>
          </Box>

          {/* Right Section - Card */}
          <Card sx={{ 
            maxWidth: { xs: '100%', sm: 400, md: 350 },
            width: '100%',
            bgcolor: '#eaeef2',
            borderRadius: 0,
            color: 'black',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ 
                width: "fit-content",
                backgroundColor: '#fff',
                borderRadius: 5,
                mt: 0.6,
                display: 'flex',

                alignItems: 'center',
                justifyContent: 'left',
                height: 'auto',
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.5, sm: 0.75 }
              }}>
                <Typography 
                  variant="overline" 
                  sx={{ 
                    color: 'black',
                    lineHeight:"1",
                    fontSize: { xs: 7, sm: 8, md: 10 }
                  }} 
                  fontWeight="bold"
                >
                  8,52,031 APPOINTMENTS TODAY
                </Typography>
              </Box>

              <Box sx={{ mt: 2, mb: 1, position: 'relative' }}>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  fontFamily="Raleway" 
                  fontWeight="bold" 
                  sx={{ 
                    display: "inline",
                    fontSize: { xs: '1.3rem', sm: '1.4rem', md: '1.5rem' }
                  }}
                >
                  What you get by joining Kalavyhua
                </Typography>
                <ArrowForwardIcon sx={{ 
                  mx: 1.4,
                  mt: 0.5,
                  position: "absolute",
                  fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
                }} />
              </Box>

              <List sx={{ mt: { xs: 1, sm: 2 } }}>
                {benefits.map((benefit, index) => (
                  <ListItem key={index} disableGutters sx={{ p: 0, mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: { xs: '20px', sm: '24px' } }}>
                      <CheckIcon sx={{ 
                        color: '#000',
                        fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                      }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={benefit} 
                      sx={listItemTextStyles}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
