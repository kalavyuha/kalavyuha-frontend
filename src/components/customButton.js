import React from 'react';
import Button from '@mui/material/Button';

const CustomButton = ({ children, startIcon, endIcon, onClick }) => (
  <Button
    {...(startIcon && { startIcon })} 
    {...(endIcon && { endIcon })}
    variant="outlined"
    fullWidth
    onClick={onClick}
    sx={{
      color: '#1b4d69',
      border: '1px solid #1b4d69',
      borderRadius: '10px',
      fontWeight: 600,
      fontSize: '13px',
      textTransform: 'none',
      py: 0.4,
      display: 'flex',
      justifyContent: 'space-between',
      '&:hover': {
        backgroundColor: 'rgba(27, 77, 105, 0.1)',
        outline: '2px solid #1b4d69',
      },
    }}
  >
    <span style={{ flexGrow: 1, textAlign: 'center' }}>{children}</span>
  </Button>
);

export default CustomButton;