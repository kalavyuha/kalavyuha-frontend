import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import TwitterIcon from '../../assets/images/busniess_images/twitter.png';
import GetAppButton from "../../components/AppStoreButton";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const quickLinks = [
    { name: 'Home', url: '/' },
    { name: 'Top picks', url: '/top-picks' },
    { name: 'Plan & Sign up', url: '/signup' },
    { name: 'Enterprise', url: '/enterprise' },
    { name: 'Help & Support', url: '/support' },
  ];

  const legalLinks = [
    { name: 'Privacy & Cookie Policy', url: '/privacy' },
    { name: 'Terms of Service', url: '/terms' },
    { name: 'Accessibility Statement', url: '/accessibility' },
    { name: 'Imprint', url: '/imprint' },
  ];

  const followLinks = [
    { name: 'Blog', url: '/blog' },
    { name: 'Instagram', url: 'https://instagram.com' },
    { name: 'Facebook', url: 'https://facebook.com' },
    { name: 'Twitter', url: 'https://twitter.com' },
  ];

  const companyLinks = [
    { name: 'Contact Us', url: '/contact' },
    { name: 'About', url: '/about' },
  ];

  return (
    <Box component="footer" sx={{ pb: 2, mt: 8 }}>
      <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ pt: 4 }}>
            <Grid 
              item
              xs={12} 
              sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                pb: 1,
                mb: 4, 
                borderBottom: "3px solid #e0e0e0" 
              }}
            >
              <Typography variant="h6" color="#1b4d69" sx={{ fontWeight: 'bold' }}>
                Kalavyuha
              </Typography>
              
              <Box>
                <IconButton 
                  aria-label="Twitter" 
                  component="a" 
                  href="https://twitter.com"
                >
                  <Box
                    component="img"
                    src={TwitterIcon}
                    alt="Twitter"
                    sx={{
                      width: 24, 
                      height: 24,
                      color: "#000",
                    }}
                  />
                </IconButton>
                <IconButton 
                  aria-label="LinkedIn" 
                  component="a" 
                  href="https://linkedin.com"
                >
                  <LinkedInIcon sx={{ color: "#000", fontSize: "30px" }}/>
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", fontSize: "17px", mb: 2 }}>
                    Quick Links
                  </Typography>
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      {quickLinks.map((link, index) => (
                          <Link
                            key={link.name}
                            href={link.url}
                            display="block"
                            color="textSecondary"
                            sx={{
                              mb: 1,
                              textDecoration: "none",
                              "&:hover": {
                                color: "#1b4d69", 
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {link.name}
                          </Link>
                      ))}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {legalLinks.map((link, index) => (
                          <Link
                            key={link.name}
                            href={link.url}
                            display="block"
                            color="textSecondary"
                            sx={{
                              mb: 1,
                              textDecoration: "none",
                              "&:hover": {
                                color: "#1b4d69", 
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {link.name}
                          </Link>
                      ))}
                    </Grid>
                  </Grid>
                </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", fontSize: "17px", mb: 2 }}>
                    Follow
                  </Typography>
                  {followLinks.map((link, index) => (
                      <Link 
                        key={link.name}
                        href={link.url} 
                        display="block" 
                        color="textSecondary" 
                        sx={{ 
                          mb: 1, 
                          textDecoration: "none",
                          "&:hover": {
                            color: "#1b4d69", 
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {link.name}
                      </Link>
                  ))}
                </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", fontSize: "17px", mb: 2 }}>
                    Company
                  </Typography>
                  {companyLinks.map((link, index) => (
                      <Link 
                        key={link.name}
                        href={link.url} 
                        display="block" 
                        color="textSecondary" 
                        sx={{ 
                          mb: 1,  
                          textDecoration: "none",
                          "&:hover": {
                            color: "#1b4d69", 
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {link.name}
                      </Link>
                  ))}

                  <GetAppButton/>
                </Box>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Box 
              mt={4} 
              display="flex" 
              justifyContent={isMobile ? 'center' : 'flex-end'} 
              flexDirection={isMobile ? 'column' : 'row'} 
              alignItems="center"
              >
                <Typography variant="body2" color="textSecondary">
                  © 2024 kalavyuha.com  
                </Typography>
                <Typography sx={{mx:1}} color="textSecondary">
                  |
                </Typography>
                <Link 
                  href="/faq" 
                  color="#1b4d69" 
                  sx={{ 
                    mt: isMobile ? 1 : 0, 
                    textDecoration:"none", 
                    transition: "color 0.3s ease, transform 0.3s ease",
                    "&:hover": {
                      textDecoration:"underline",
                    } 
                  }}
                >
                  FAQ
                </Link>
              </Box>
            </Grid>
          </Grid>
      </Container>
    </Box>
  );
}

export default Footer;
