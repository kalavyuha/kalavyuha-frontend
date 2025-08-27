import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Stack,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Modern styled components with sleek design
const StyledContainer = styled(Container)({
  backgroundColor: '#eaeef2',
  paddingTop: '6rem',
  paddingBottom: '4rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
});

const ErrorCard = styled(Paper)({
  backgroundColor: '#fbfbfb',
  borderRadius: '24px',
  padding: '1rem 0.5rem',
  textAlign: 'center',
  boxShadow: '0 8px 32px rgba(27, 77, 105, 0.12)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  maxWidth: '600px',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: '4px',
//     background: 'linear-gradient(135deg, #1b4d69 0%, #8eabbb 100%)',
//   },
});

const StyledButton = styled(Button)({
  background: 'linear-gradient(135deg, #1b4d69 0%, #8eabbb 100%)',   
  color: '#fbfbfb',
  borderRadius: '30px',
  padding: '12px 32px',
  fontSize: '14px',
  fontWeight: '600',
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(27, 77, 105, 0.25)',
  transition: 'all 0.3s ease',
  minWidth: '140px',
  '&:hover': {
    background: 'linear-gradient(135deg, #8eabbb 0%, #1b4d69 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(27, 77, 105, 0.35)',
  },
});

const SecondaryButton = styled(Button)({
  color: '#1b4d69',
  borderRadius: '30px',
  padding: '12px 32px',
  fontSize: '14px',
  fontWeight: '600',
  textTransform: 'none',
  border: '2px solid #1b4d69',
  backgroundColor: 'transparent',
  minWidth: '140px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#1b4d69',
    color: '#fbfbfb',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(27, 77, 105, 0.25)',
  },
});

const IconContainer = styled(Box)({
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(27, 77, 105, 0.1) 0%, rgba(142, 171, 187, 0.1) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1rem',
  border: '3px solid rgba(27, 77, 105, 0.2)',
});

const ErrorPage = ({ 
  errorCode = "404", 
  errorTitle = "Page Not Found", 
  errorMessage = "Sorry, the page you are looking for doesn't exist or has been moved.",
  showRefresh = true 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  // Get error details from navigation state if available
  const stateErrorCode = location.state?.errorCode || errorCode;
  const stateErrorTitle = location.state?.errorTitle || errorTitle;
  const stateErrorMessage = location.state?.errorMessage || errorMessage;
  const stateShowRefresh = location.state?.showRefresh !== undefined ? location.state.showRefresh : showRefresh;

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Determine error type and customize content
  const getErrorContent = () => {
    switch (stateErrorCode) {
      case "500":
        return {
          title: "Server Error",
          message: "Something went wrong on our end. We're working to fix it. Please try again later.",
          icon: <ErrorOutlineIcon sx={{ fontSize: 60, color: '#e74c3c' }} />
        };
      case "403":
        return {
          title: "Access Denied",
          message: "You don't have permission to access this page. Please contact support if you believe this is an error.",
          icon: <ErrorOutlineIcon sx={{ fontSize: 60, color: '#f39c12' }} />
        };
      case "400":
        return {
          title: "Bad Request",
          message: "The request could not be understood by the server. Please check your input and try again.",
          icon: <ErrorOutlineIcon sx={{ fontSize: 60, color: '#e67e22' }} />
        };
      case "NETWORK":
        return {
          title: "Connection Error",
          message: "Unable to connect to our servers. Please check your internet connection and try again.",
          icon: <ErrorOutlineIcon sx={{ fontSize: 60, color: '#9b59b6' }} />
        };
      default:
        return {
          title: stateErrorTitle,
          message: stateErrorMessage,
          icon: <ErrorOutlineIcon sx={{ fontSize: 60, color: '#1b4d69' }} />
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <StyledContainer maxWidth="lg">
      <ErrorCard elevation={0}>
        <IconContainer>
          {errorContent.icon}
        </IconContainer>

        <Typography
          variant="h1"
          sx={{
            fontSize: isMobile ? '3rem' : '5rem',
            fontWeight: '700',
            color: '#1b4d69',
            marginBottom: '1rem',
            fontFamily: 'inherit',
          }}
        >
          {stateErrorCode}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: '600',
            color: '#080505',
            marginBottom: '1rem',
            fontFamily: 'inherit',
          }}
        >
          {errorContent.title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: isMobile ? '14px' : '16px',
            color: '#666',
            marginBottom: '3rem',
            lineHeight: 1.6,
            maxWidth: '500px',
            margin: '0 auto 2rem',
          }}
        >
          {errorContent.message}
        </Typography>

        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <StyledButton
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            size="large"
          >
            Go Home
          </StyledButton>

          <SecondaryButton
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            size="large"
          >
            Go Back
          </SecondaryButton>

          {showRefresh && stateShowRefresh && (
            <SecondaryButton
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              size="large"
            >
              Refresh
            </SecondaryButton>
          )}
        </Stack>

        <Box
          sx={{
            marginTop: '3rem',
            padding: '1.5rem',
            backgroundColor: 'rgba(27, 77, 105, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(27, 77, 105, 0.1)',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#1b4d69',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '0.5rem',
            }}
          >
            Need Help?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '13px',
              lineHeight: 1.5,
            }}
          >
            If you continue to experience issues, please contact our support team at{' '}
            <Box
              component="span"
              sx={{
                color: '#1b4d69',
                fontWeight: '600',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={() => navigate('/support')}
            >
              support
            </Box>
            {' '}or try visiting our{' '}
            <Box
              component="span"
              sx={{
                color: '#1b4d69',
                fontWeight: '600',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={() => navigate('/')}
            >
              home page
            </Box>
            .
          </Typography>
        </Box>
      </ErrorCard>
    </StyledContainer>
  );
};

export default ErrorPage;
