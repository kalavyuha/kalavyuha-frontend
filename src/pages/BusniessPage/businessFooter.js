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
  Fade,
  Zoom,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useInView } from 'react-intersection-observer';
import { keyframes } from '@mui/system';

import TwitterIcon from '../../assets/images/busniess_images/twitter.png';
import GetAppButton from "../../components/AppStoreButton";

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [footerRef, footerInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [quickLinksRef, quickLinksInView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const [legalLinksRef, legalLinksInView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const [followLinksRef, followLinksInView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const [companyLinksRef, companyLinksInView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

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
    <Box component="footer" sx={{ pb: 2, mt: 8 }} ref={footerRef}>
      <Container maxWidth="lg">
        <Fade in={footerInView} timeout={1000}>
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
                  sx={{
                    '&:hover': {
                      animation: `${floatAnimation} 1s ease-in-out infinite`
                    }
                  }}
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
                  sx={{
                    '&:hover': {
                      animation: `${floatAnimation} 1s ease-in-out infinite`
                    }
                  }}
                >
                  <LinkedInIcon sx={{ color: "#000", fontSize: "30px" }}/>
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} ref={quickLinksRef}>
              <Fade in={quickLinksInView} timeout={1000}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", fontSize: "17px", mb: 2 }}>
                    Quick Links
                  </Typography>
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      {quickLinks.map((link, index) => (
                        <Zoom in={quickLinksInView} style={{ transitionDelay: `${index * 100}ms` }} key={link.name}>
                          <Link
                            href={link.url}
                            display="block"
                            color="textSecondary"
                            sx={{
                              mb: 1,
                              textDecoration: "none",
                              transition: "color 0.3s ease, transform 0.3s ease",
                              "&:hover": {
                                color: "#1b4d69", 
                                textDecoration: "underline",
                                transform: "translateX(5px)"
                              },
                            }}
                          >
                            {link.name}
                          </Link>
                        </Zoom>
                      ))}
                    </Grid>
                    <Grid item xs={12} sm={6} ref={legalLinksRef}>
                      {legalLinks.map((link, index) => (
                        <Zoom in={legalLinksInView} style={{ transitionDelay: `${(index + quickLinks.length) * 100}ms` }} key={link.name}>
                          <Link
                            href={link.url}
                            display="block"
                            color="textSecondary"
                            sx={{
                              mb: 1,
                              textDecoration: "none",
                              transition: "color 0.3s ease, transform 0.3s ease",
                              "&:hover": {
                                color: "#1b4d69", 
                                textDecoration: "underline",
                                transform: "translateX(5px)"
                              },
                            }}
                          >
                            {link.name}
                          </Link>
                        </Zoom>
                      ))}
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} sm={6} md={3} ref={followLinksRef}>
              <Fade in={followLinksInView} timeout={1000}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", fontSize: "17px", mb: 2 }}>
                    Follow
                  </Typography>
                  {followLinks.map((link, index) => (
                    <Zoom in={followLinksInView} style={{ transitionDelay: `${index * 100}ms` }} key={link.name}>
                      <Link 
                        href={link.url} 
                        display="block" 
                        color="textSecondary" 
                        sx={{ 
                          mb: 1, 
                          textDecoration: "none",
                          transition: "color 0.3s ease, transform 0.3s ease",
                          "&:hover": {
                            color: "#1b4d69", 
                            textDecoration: "underline",
                            transform: "translateX(5px)"
                          },
                        }}
                      >
                        {link.name}
                      </Link>
                    </Zoom>
                  ))}
                </Box>
              </Fade>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3} ref={companyLinksRef}>
              <Fade in={companyLinksInView} timeout={1000}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", fontSize: "17px", mb: 2 }}>
                    Company
                  </Typography>
                  {companyLinks.map((link, index) => (
                    <Zoom in={companyLinksInView} style={{ transitionDelay: `${index * 100}ms` }} key={link.name}>
                      <Link 
                        href={link.url} 
                        display="block" 
                        color="textSecondary" 
                        sx={{ 
                          mb: 1,  
                          textDecoration: "none",
                          transition: "color 0.3s ease, transform 0.3s ease",
                          "&:hover": {
                            color: "#1b4d69", 
                            textDecoration: "underline",
                            transform: "translateX(5px)"
                          },
                        }}
                      >
                        {link.name}
                      </Link>
                    </Zoom>
                  ))}

                  <GetAppButton/>
                </Box>
              </Fade>
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
                      transform: "translateY(-2px)"
                    } 
                  }}
                >
                  FAQ
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
}

export default Footer;
