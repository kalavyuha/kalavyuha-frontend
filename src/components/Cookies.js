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

const CookiePopup = ({ forceShowSettings = false, onSettingsClose = null }) => {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(forceShowSettings);

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

  useEffect(() => {
    setShowSettings(forceShowSettings);
  }, [forceShowSettings]);

  const handleAcceptAll = () => {
    localStorage.setItem('kalavyuha_cookie_consent', 'all');
    setOpen(false);
  };

  const handleCookieSettings = () => {
    setShowSettings(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
    if (onSettingsClose) {
      onSettingsClose();
    }
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
            '@media (max-width: 768px)': {
              left: 8,
              right: 8,
              bottom: 8,
              maxWidth: 'none',
              borderRadius: 2,
            },
            '@media (max-width: 480px)': {
              left: 4,
              right: 4,
              bottom: 4,
              borderRadius: 1,
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
        <DialogContent sx={{ 
          p: { xs: 2, sm: 3 },
          pb: { xs: 1, sm: 2 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            mb: { xs: 1.5, sm: 2 },
            flexDirection: { xs: 'row', sm: 'row' }
          }}>
            <Box sx={{ 
              mr: { xs: 1.5, sm: 2 }, 
              flexShrink: 0,
              mt: { xs: 0.5, sm: 0 }
            }}>
              <img 
                src={logo} 
                alt="Kalavyuha" 
                style={{ 
                  width: window.innerWidth < 480 ? '32px' : '38px', 
                  height: window.innerWidth < 480 ? '32px' : '38px',
                  objectFit: 'contain'
                }}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  fontWeight: 600,
                  color: '#333',
                  mb: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                Kalavyuha
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  lineHeight: 1.5,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  wordBreak: 'break-word'
                }}
              >
                We use our own and third-party cookies to personalize content and ads, to provide media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners.
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{ 
                color: '#666',
                ml: { xs: 0.5, sm: 1 },
                p: { xs: 0.5, sm: 1 },
                '&:hover': { color: '#333' }
              }}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 }, 
          pt: { xs: 1, sm: 0 }
        }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 1.5, sm: 2 }}
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
                flex: { xs: 1, sm: 'auto' },
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                py: { xs: 1, sm: 1.5 },
                minHeight: { xs: '40px', sm: '44px' }
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
                flex: { xs: 1, sm: 'auto' },
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                py: { xs: 1, sm: 1.5 },
                minHeight: { xs: '40px', sm: '44px' }
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
        fullScreen={window.innerWidth < 600}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            maxHeight: { xs: '100vh', sm: '80vh' },
            margin: { xs: 0, sm: 2 }
          }
        }}
      >
        <DialogContent sx={{ 
          p: { xs: 2, sm: 3 },
          overflowY: 'auto'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: { xs: 2, sm: 3 },
            position: { xs: 'sticky', sm: 'static' },
            top: { xs: 0, sm: 'auto' },
            backgroundColor: { xs: 'background.paper', sm: 'transparent' },
            zIndex: { xs: 1, sm: 'auto' },
            pb: { xs: 1, sm: 0 },
            borderBottom: { xs: '1px solid #eee', sm: 'none' }
          }}>
            <img 
              src={logo} 
              alt="Kalavyuha" 
              style={{ 
                width: window.innerWidth < 480 ? '32px' : '40px', 
                height: window.innerWidth < 480 ? '32px' : '40px',
                objectFit: 'contain',
                marginRight: '12px'
              }}
            />
            <Typography 
              variant="h5" 
              fontWeight={600}
              sx={{
                fontSize: { xs: '1.3rem', sm: '1.5rem' }
              }}
            >
              Cookie Settings
            </Typography>
          </Box>
          
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Essential Cookies
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              paragraph
              sx={{
                fontSize: { xs: '0.85rem', sm: '0.875rem' },
                lineHeight: { xs: 1.4, sm: 1.5 }
              }}
            >
              These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services.
            </Typography>
            <Typography 
              variant="body2" 
              color="success.main" 
              fontWeight={500}
              sx={{
                fontSize: { xs: '0.85rem', sm: '0.875rem' }
              }}
            >
              Always Active
            </Typography>
          </Box>

          <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />

          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Analytics & Performance Cookies
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              paragraph
              sx={{
                fontSize: { xs: '0.85rem', sm: '0.875rem' },
                lineHeight: { xs: 1.4, sm: 1.5 }
              }}
            >
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
            </Typography>
          </Box>

          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Marketing Cookies
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              paragraph
              sx={{
                fontSize: { xs: '0.85rem', sm: '0.875rem' },
                lineHeight: { xs: 1.4, sm: 1.5 }
              }}
            >
              These cookies are used to deliver advertisements more relevant to you and your interests.
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 }, 
          pt: { xs: 1, sm: 0 },
          position: { xs: 'sticky', sm: 'static' },
          bottom: { xs: 0, sm: 'auto' },
          backgroundColor: { xs: 'background.paper', sm: 'transparent' },
          borderTop: { xs: '1px solid #eee', sm: 'none' }
        }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 1.5, sm: 2 }}
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
                flex: { xs: 1, sm: 'auto' },
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                py: { xs: 1, sm: 1.5 },
                minHeight: { xs: '44px', sm: '44px' }
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
                flex: { xs: 1, sm: 'auto' },
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                py: { xs: 1, sm: 1.5 },
                minHeight: { xs: '44px', sm: '44px' }
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