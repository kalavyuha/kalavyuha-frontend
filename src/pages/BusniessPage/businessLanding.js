import React from 'react';
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import landingGroupImage from "../../assets/images/busniess_images/landing_page.png";
import GmailLogo from "../../assets/images/busniess_images/gmail.png";
import PlayStore from "../../assets/images/busniess_images/playstore.png";
import PillShapeContainer from "../../components/PillShapeContainer";

export default function BusinessLandingSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box >
      <Grid container spacing={4} alignItems="center" sx={{ py: { xs: 3, md: 6 } }}>
        {/* Section one Left side */}
        <Grid item xs={12} md={6}>
            <Box sx={{ px: { xs: 2, md: 0 } }}>
              <Typography 
                variant="overline" 
                gutterBottom 
                fontWeight="bold" 
                color='#919191'
                sx={{
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                }}
              >
                HIGHEST-RATED SOFTWARE FOR YOUR BUSINESS
              </Typography>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{
                  width: { xs: '100%', md: 370 },
                  fontSize: { xs: 40, sm: 50, md: 68 },
                  mt: 1,
                  fontFamily: "Raleway",
                  lineHeight: 1.1
                }}
              >
                Powering all the ways you do business.
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  width: { xs: '100%'},
                  fontSize: { xs: 12, sm:14, md: 15 },
                  fontWeight: "medium",
                  color: '#100f0d'
                }}
              >
                Effortless, subscription-free booking software to grow your business! Boost visibility, engage customers, showcase offerings, and enjoy hotline support-powerful tools to attract and retain clients!
              </Typography>
              <Button 
                component={Link} 
                to="/business-account"
                variant="contained" 
                color="primary"
                size={isMobile ? "medium" : "large"}
                sx={{
                  mt: 3,
                  borderRadius: 15,
                  fontSize: { xs: 12, sm: 14, md: 16 },
                  px: { xs: 3, md: 5 },
                  border: 1,
                  borderColor: 'black',
                  backgroundColor: '#e2e6ea',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: '#d0d4d8',
                  },
                  textDecoration: 'none', 
                }}
              >
                Register Your Business
              </Button>
            </Box>
        </Grid>

        {/* Section one right side */}
        <Grid item xs={12} md={6} sx={{marginTop:"32px"}}>
            <Box sx={{ 
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              mb: { xs: 3, md: 6 }
            }}>
              {/* landing business team image */}
              <PillShapeContainer 
                src={landingGroupImage} 
                alt="Business team" 
                width={isMobile ? "100%" : "500px"}
                height={isMobile ? "150px" : "200px"}
              />

              {/* Part above landing business image */}
              <Card
                sx={{
                  width: { xs: 220, sm: 270 },
                  height: { xs: 54, sm: 64 },
                  background: 'linear-gradient(to right, #20B2AA, #FFD700)',
                  borderRadius: 2,
                  boxShadow: 3,
                  py: 0.4,
                  position: 'absolute',
                  overflow: 'hidden',
                  top: { xs: -30, sm: -44 },
                  right: { xs: 4, sm: 8 },
                }}
              >
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  p: { xs: 1, sm: 1.5 },
                }}>
                  <Box sx={{
                    bgcolor: 'white',
                    borderRadius: '20%',
                    p: { xs: 0.4, sm: 0.6 },
                    mr: { xs: 1, sm: 1.5 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Box
                      component="img"
                      src={GmailLogo}
                      alt="gmail.logo"
                      sx={{
                        width: { xs: '16px', sm: '20px' },
                        height: 'auto',
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ 
                      color: 'black', 
                      fontWeight: 'bold', 
                      lineHeight: 1.2,
                      fontSize: { xs: '0.7rem', sm: '0.875rem' }
                    }}>
                      New Online Appointment
                      <Typography variant="caption" sx={{ 
                        color: '#1b4d69', 
                        fontWeight: 'bold', 
                        opacity: 0.75, 
                        ml: 1,
                        fontSize: { xs: '0.6rem', sm: '0.75rem' }
                      }}>
                        now
                      </Typography>
                    </Typography>
                    {[190, 170, 160].map((width, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          width: { xs: width * 0.8, sm: width },
                          height: { xs: 3, sm: 5 },
                          backgroundColor: '#e2e6ea',
                          opacity: 0.31,
                          borderRadius: 2,
                          mt: index === 0 ? 0.3 : 0.6
                        }} 
                      />
                    ))}
                  </Box>
                </Box>
              </Card>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: "center", 
              alignItems: 'center', 
              mb: { xs: 3, md: 6 }
            }}>
              <Box
                component="img"
                src={PlayStore}
                alt="playstore.logo"
                sx={{
                  width: { xs: '16px', sm: '20px' },
                  height: 'auto',
                }}
              />
              <Typography variant="h6" component="span" sx={{ 
                color: '#ffcf01', 
                mx: 1,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}>
                ★★★★★
              </Typography>
              <Typography variant="body2" fontSize={{ xs: 10, sm: 12 }}>
                4.8 Stars
              </Typography>
            </Box>

          <Grid container justifyContent="space-between" sx={{ 
            mt: { xs: 3, md: 6 }, 
            textAlign: 'center',
            px: { xs: 2, md: 0 }
          }}>
            {[
              { value: '3.7M+', label: 'Businesses Listed' },
              { value: '120+', label: 'Countries' },
              { value: '₹19M', label: 'Happy Customers' },
              
            ].map((stat, index) => (
                <Grid item xs={4} key={index}>
                  <Box sx={{ 
                    width: { xs: 50, sm: 130 },
                    height: { xs: 2, sm: 3 },
                    backgroundColor: '#545454',
                    borderRadius: 2,
                    mt: 0.3,
                    mb:1.5,
                    mx: 'auto'
                  }} />

                  <Typography 
                    variant="h4" 
                    component="p" 
                    fontWeight="bold" 
                    fontFamily="Raleway"
                    sx={{
                      mb:1,
                      fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' }
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      fontSize: { xs: 12, sm: 14, md: 16 }
                    }} 
                    color="text.secondary"
                  >
                    {stat.label}
                  </Typography>
                </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}