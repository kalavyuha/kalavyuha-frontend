import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress color="primary" size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  // If not authenticated, redirect to home with login modal
  if (!isAuthenticated) {
    // Trigger login modal to open
    setTimeout(() => {
      window.dispatchEvent(new Event('open-login-modal'));
    }, 100);
    
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
  }

  return children;
};

export default ProtectedRoute;
