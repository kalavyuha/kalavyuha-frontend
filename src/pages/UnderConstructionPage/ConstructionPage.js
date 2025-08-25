import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import HomeIcon from '@mui/icons-material/Home';

// Modern styled components with sleek design
const StyledContainer = styled(Container)({
//   minHeight: '70vh',
// marginTop: '60px',
  backgroundColor: '#eaeef2',
  paddingTop: '8rem',
  paddingBottom: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const HomeButton = styled(Button)({
  background: 'linear-gradient(135deg, #1b4d69 0%, #8eabbb 100%)',   
  color: '#fbfbfb',
  borderRadius: '30px',
  padding: '10px 24px',
  fontSize: '14px',
  fontWeight: '500',
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(27, 77, 105, 0.25)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #8eabbb 0%, #1b4d69 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(27, 77, 105, 0.35)',
  },
});

const ConstructionPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: '#eaeef2', minHeight: '100vh' }}>
      
      <StyledContainer maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
          {/* Construction Icon */}
          <ConstructionIcon 
            sx={{ 
              fontSize: { 
                xs: 48, 
                sm: 56, 
                md: 64, 
                lg: 72 
              }, 
              color: '#1b4d69',
              mb: { xs: 2, sm: 2.5, md: 3 },
              opacity: 0.9,
              animation: 'bounce 3s infinite',
              '@keyframes bounce': {
                '0%, 20%, 50%, 80%, 100%': {
                  transform: 'translateY(0)',
                },
                '40%': {
                  transform: 'translateY(-8px)',
                },
                '60%': {
                  transform: 'translateY(-4px)',
                },
              },
            }} 
          />
          
          {/* Main Heading */}
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { 
                xs: '1.5rem',
                sm: '2rem',  
                md: '2.50rem',
                lg: '3rem' 
              },
            //   fontWeight: 700,
              mb: { xs: 1.5, sm: 2, md: 2.5 },
              color: '#000',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Page Under Construction
          </Typography>
          
          {/* Subheading */}
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: { 
                xs: '0.9rem',   
                sm: '1rem',
                md: '1.2rem',   
                lg: '1.3rem'  
              },
              mb: { xs: 3, sm: 3.5, md: 4 },
              color: 'grey',
              fontWeight: 500,
              letterSpacing: '0.01em',
              lineHeight: 1.4,
            }}
          >
            We're building something incredible for you!
          </Typography>
          
          {/* Description */}
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: { 
                xs: '0.95rem',   // 15.2px
                sm: '1rem',      // 16px
                md: '1.05rem',   // 16.8px
                lg: '1.1rem'     // 17.6px
              },
              mb: { xs: 3.5, sm: 4, md: 4.5 },
              color: '#080505',
              maxWidth: { xs: '100%', sm: '90%', md: '75%' },
              margin: '0 auto',
              lineHeight: 1.6,
              fontWeight: 400,
              letterSpacing: '0.005em',
              opacity: 0.9,
            }}
          >
            Our team is working around the clock to bring you new features and improvements. 
            This page will be available soon with enhanced functionality and a better user experience.
          </Typography>

          {/* Home Button */}
          <HomeButton
            startIcon={<HomeIcon sx={{ fontSize: '18px' }} />}
            onClick={() => navigate('/')}
          >
            Back to Home
          </HomeButton>

          {/* Simple Progress Indicator */}
          {/* <Box sx={{ mt: { xs: 4, sm: 5, md: 6 } }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#1b4d69',
                mb: { xs: 1.5, sm: 2 },
                fontSize: { 
                  xs: '0.85rem',   // 13.6px
                  sm: '0.9rem',    // 14.4px
                  md: '0.95rem'    // 15.2px
                },
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              Development Progress: 75%
            </Typography>
            
            <Box 
              sx={{ 
                width: { 
                  xs: '250px', 
                  sm: '300px', 
                  md: '350px' 
                }, 
                height: { xs: 4, sm: 5, md: 6 }, 
                backgroundColor: '#f2f2f2',
                borderRadius: 3,
                overflow: 'hidden',
                margin: '0 auto',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <Box 
                sx={{ 
                  width: '75%', 
                  height: '100%',
                  background: 'linear-gradient(90deg, #1b4d69, #8eabbb)',
                  borderRadius: 3,
                  transition: 'width 0.5s ease',
                }} 
              />
            </Box>
          </Box> */}

          {/* Contact Info */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#080505',
              mt: { xs: 4, sm: 5, md: 6 },
              fontSize: { 
                xs: '0.9rem',    // 14.4px
                sm: '0.95rem',   // 15.2px
                md: '1rem'       // 16px
              },
              fontWeight: 400,
              opacity: 0.8,
            }}
          >
            Have questions? 
            <Button
              variant="text"
              sx={{
                color: '#1b4d69',
                textTransform: 'none',
                fontSize: { 
                  xs: '0.9rem',
                  sm: '0.95rem',
                  md: '1rem'
                },
                fontWeight: 600,
                ml: 0.5,
                p: 0.5,
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                  color: '#8eabbb',
                },
              }}
              onClick={() => navigate('/support')}
            >
              Contact Support
            </Button>
          </Typography>
        </Box>
      </StyledContainer>

    </Box>
  );
};

export default ConstructionPage;