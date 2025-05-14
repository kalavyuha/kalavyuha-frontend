import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper,
  Avatar
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const SuccessCart = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          py: 6, 
          px: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Box 
          sx={{ 
            position: 'relative',
            mb: 4
          }}
        >
          {/* Background circle with light gray */}
          <Box 
            sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: '#f5f7ff',
              position: 'relative'
            }}
          />
          
          {/* Center green circle with checkmark */}
          <Avatar 
            sx={{ 
              bgcolor: '#4caf50', 
              width: 50, 
              height: 50,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <CheckIcon />
          </Avatar>
          
          {/* Small decorative dots around the circle */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((degree, index) => (
            <Box 
              key={index}
              sx={{ 
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: index % 2 === 0 ? '#e0e7ff' : '#c8daff',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${degree}deg) translateX(50px)`,
              }}
            />
          ))}
        </Box>

        <Typography variant="h5" component="h1" fontWeight="medium" color="text.primary" gutterBottom>
          Your Appointment Booked Successfully!
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          We have sent your booking information to your email address.
        </Typography>
      </Paper>
    </Container>
  );
};

export default  SuccessCart;
