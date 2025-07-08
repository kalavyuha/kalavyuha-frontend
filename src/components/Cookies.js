import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogContent, 
  DialogActions,
  Paper,
  Slide,
  IconButton,
  Stack,
  Divider
} from '@mui/material';
import { Close as CloseIcon, Settings as SettingsIcon, Check as CheckIcon } from '@mui/icons-material';
import logo from '../assets/logo/kalavyuha-favicon/kalavyuha-favicon-color.png';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CookiePopup = () => {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('kalavyuha_cookie_consent');
    if (!cookieConsent) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('kalavyuha_cookie_consent', 'all');
    setOpen(false);
  };

  const handleCookieSettings = () => {
    setShowSettings(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  const handleSettingsAccept = () => {
    localStorage.setItem('kalavyuha_cookie_consent', 'essential');
    setShowSettings(false);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Main Cookie Popup */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="cookie-popup-description"
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: 20,
            left: 20,
            right: 20,
            margin: 0,
            maxWidth: 500,
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            '@media (max-width: 600px)': {
              left: 10,
              right: 10,
              bottom: 10,
            }
          }
        }}
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
          }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ mr: 2, flexShrink: 0 }}>
              <img 
                src={logo} 
                alt="Kalavyuha" 
                style={{ 
                  width: '38px', 
                  height: '38px',
                  objectFit: 'contain'
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  fontWeight: 600,
                  color: '#333',
                  mb: 1
                }}
              >
                Kalavyuha
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  lineHeight: 1.5,
                  fontSize: '0.875rem'
                }}
              >
                We use our own and third-party cookies to personalize content and ads, to provide media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners.
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{ 
                color: '#666',
                ml: 1,
                '&:hover': { color: '#333' }
              }}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ width: '100%' }}
          >
            <Button
              onClick={handleCookieSettings}
              variant="outlined"
              startIcon={<SettingsIcon />}
              sx={{
                borderColor: '#ddd',
                color: '#666',
                '&:hover': {
                  borderColor: '#bbb',
                  backgroundColor: '#f5f5f5'
                },
                textTransform: 'none',
                fontWeight: 500,
                flex: { xs: 1, sm: 'auto' }
              }}
            >
              Cookie Settings
            </Button>
            <Button
              onClick={handleAcceptAll}
              variant="contained"
              startIcon={<CheckIcon />}
              sx={{
                backgroundColor: '#1b4d69',
                '&:hover': {
                  backgroundColor: '#22424d'
                },
                textTransform: 'none',
                fontWeight: 500,
                flex: { xs: 1, sm: 'auto' }
              }}
            >
              Accept All
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Cookie Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={handleSettingsClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '80vh'
          }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <img 
              src={logo} 
              alt="Kalavyuha" 
              style={{ 
                width: '40px', 
                height: '40px',
                objectFit: 'contain',
                marginRight: '12px'
              }}
            />
            <Typography variant="h5" fontWeight={600}>
              Cookie Settings
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Essential Cookies
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services.
            </Typography>
            <Typography variant="body2" color="success.main" fontWeight={500}>
              Always Active
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Analytics & Performance Cookies
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Marketing Cookies
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              These cookies are used to deliver advertisements more relevant to you and your interests.
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ width: '100%' }}
          >
            <Button
              onClick={handleSettingsAccept}
              variant="outlined"
              sx={{
                borderColor: '#ddd',
                color: '#666',
                '&:hover': {
                  borderColor: '#bbb',
                  backgroundColor: '#f5f5f5'
                },
                textTransform: 'none',
                fontWeight: 500,
                flex: { xs: 1, sm: 'auto' }
              }}
            >
              Accept Essential Only
            </Button>
            <Button
              onClick={handleAcceptAll}
              variant="contained"
              sx={{
                backgroundColor: '#1b4d69',
                '&:hover': {
                  backgroundColor: '#1b4d69'
                },
                textTransform: 'none',
                fontWeight: 500,
                flex: { xs: 1, sm: 'auto' }
              }}
            >
              Accept All
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CookiePopup;