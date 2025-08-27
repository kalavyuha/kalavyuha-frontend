import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { errorHandler } from '../../utils/errorHandler';

const StyledContainer = styled(Container)({
  backgroundColor: '#eaeef2',
  paddingTop: '4rem',
  paddingBottom: '4rem',
  minHeight: '80vh',
});

const DemoCard = styled(Paper)({
  backgroundColor: '#fbfbfb',
  borderRadius: '16px',
  padding: '2rem',
  marginBottom: '1rem',
  boxShadow: '0 4px 16px rgba(27, 77, 105, 0.12)',
});

const DemoButton = styled(Button)({
  background: 'linear-gradient(135deg, #1b4d69 0%, #8eabbb 100%)',   
  color: '#fbfbfb',
  borderRadius: '8px',
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: '600',
  textTransform: 'none',
  margin: '0.5rem',
  '&:hover': {
    background: 'linear-gradient(135deg, #8eabbb 0%, #1b4d69 100%)',
  },
});

const ErrorHandlingDemo = () => {
  const navigate = useNavigate();

  const simulateErrors = {
    // Simulate different types of errors for demonstration
    simulate404: () => {
      navigate('/error', { 
        state: { 
          errorCode: '404',
          errorTitle: 'Page Not Found',
          errorMessage: 'This is a simulated 404 error for demonstration.',
          showRefresh: false
        }
      });
    },

    simulate500: () => {
      navigate('/error', { 
        state: { 
          errorCode: '500',
          errorTitle: 'Server Error',
          errorMessage: 'This is a simulated server error for demonstration.',
          showRefresh: true
        }
      });
    },

    simulate403: () => {
      navigate('/error', { 
        state: { 
          errorCode: '403',
          errorTitle: 'Access Denied',
          errorMessage: 'This is a simulated access denied error for demonstration.',
          showRefresh: false
        }
      });
    },

    showErrorToast: () => {
      errorHandler.showErrorToast('This is a sample error toast message!');
    },

    showSuccessToast: () => {
      errorHandler.showSuccessToast('This is a sample success toast message!');
    },

    throwJsError: () => {
      // This will be caught by the Error Boundary
      throw new Error('This is a simulated JavaScript error for demonstration');
    },

    simulateNetworkError: () => {
      navigate('/error', { 
        state: { 
          errorCode: 'NETWORK',
          errorTitle: 'Connection Error',
          errorMessage: 'This is a simulated network error for demonstration.',
          showRefresh: true
        }
      });
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      <Typography
        variant="h3"
        sx={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#1b4d69',
          fontWeight: '700',
        }}
      >
        Error Handling Demo
      </Typography>

      <Typography
        variant="body1"
        sx={{
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto 3rem',
        }}
      >
        This page demonstrates the error handling capabilities of the application. 
        Click the buttons below to simulate different types of errors.
      </Typography>

      <DemoCard>
        <Typography variant="h6" sx={{ marginBottom: '1rem', color: '#1b4d69' }}>
          HTTP Error Simulations
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: '1rem', color: '#666' }}>
          These buttons simulate different HTTP error responses:
        </Typography>
        <Stack direction="row" flexWrap="wrap" justifyContent="center">
          <DemoButton onClick={simulateErrors.simulate404}>
            404 - Not Found
          </DemoButton>
          <DemoButton onClick={simulateErrors.simulate500}>
            500 - Server Error
          </DemoButton>
          <DemoButton onClick={simulateErrors.simulate403}>
            403 - Access Denied
          </DemoButton>
          <DemoButton onClick={simulateErrors.simulateNetworkError}>
            Network Error
          </DemoButton>
        </Stack>
      </DemoCard>

      <DemoCard>
        <Typography variant="h6" sx={{ marginBottom: '1rem', color: '#1b4d69' }}>
          Toast Notifications
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: '1rem', color: '#666' }}>
          These buttons show different types of toast notifications:
        </Typography>
        <Stack direction="row" flexWrap="wrap" justifyContent="center">
          <DemoButton onClick={simulateErrors.showErrorToast}>
            Error Toast
          </DemoButton>
          <DemoButton onClick={simulateErrors.showSuccessToast}>
            Success Toast
          </DemoButton>
        </Stack>
      </DemoCard>

      <DemoCard>
        <Typography variant="h6" sx={{ marginBottom: '1rem', color: '#1b4d69' }}>
          JavaScript Error Boundary
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: '1rem', color: '#666' }}>
          This button will throw a JavaScript error that will be caught by the Error Boundary:
        </Typography>
        <Stack direction="row" flexWrap="wrap" justifyContent="center">
          <DemoButton onClick={simulateErrors.throwJsError}>
            Throw JS Error
          </DemoButton>
        </Stack>
      </DemoCard>

      <DemoCard>
        <Typography variant="h6" sx={{ marginBottom: '1rem', color: '#1b4d69' }}>
          Navigation
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: '1rem', color: '#666' }}>
          Navigate to test actual 404 handling:
        </Typography>
        <Stack direction="row" flexWrap="wrap" justifyContent="center">
          <DemoButton onClick={() => navigate('/non-existent-page')}>
            Go to Non-existent Page
          </DemoButton>
          <DemoButton onClick={() => navigate('/error')}>
            Go to Generic Error Page
          </DemoButton>
        </Stack>
      </DemoCard>
    </StyledContainer>
  );
};

export default ErrorHandlingDemo;
