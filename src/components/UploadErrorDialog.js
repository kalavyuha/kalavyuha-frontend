import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  LightbulbOutlined as TipIcon,
  Refresh as RetryIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';

const UploadErrorDialog = ({
  open,
  onClose,
  error,
  onRetry,
  showTechnicalDetails = false,
}) => {
  if (!error) return null;

  const {
    title = 'Upload Error',
    message = 'An error occurred during upload',
    type,
    actions = [],
  } = error;

  const getSeverity = () => {
    switch (type) {
      case 'FILE_TOO_LARGE':
      case 'INVALID_FILE_TYPE':
      case 'VALIDATION_ERROR':
        return 'warning';
      case 'NETWORK_ERROR':
      case 'TIMEOUT_ERROR':
      case 'SERVER_ERROR':
        return 'error';
      case 'AUTH_ERROR':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'FILE_TOO_LARGE':
        return '📁';
      case 'INVALID_FILE_TYPE':
        return '❌';
      case 'NETWORK_ERROR':
        return '🌐';
      case 'TIMEOUT_ERROR':
        return '⏱️';
      case 'SERVER_ERROR':
        return '🔧';
      case 'AUTH_ERROR':
        return '🔒';
      case 'VALIDATION_ERROR':
        return '⚠️';
      default:
        return '⚠️';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '1.5em', marginRight: '8px' }}>
            {getIcon()}
          </span>
          <Typography variant="h6">
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Alert severity={getSeverity()} sx={{ mb: 2 }}>
          <Typography variant="body1" component="div">
            {message}
          </Typography>
        </Alert>

        {actions.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TipIcon sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="subtitle2" color="info.main">
                Here's what you can try:
              </Typography>
            </Box>
            <List dense>
              {actions.map((action, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: 'info.main',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={action}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* File Size Guidelines */}
        {(type === 'FILE_TOO_LARGE' || type === 'INVALID_FILE_TYPE') && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
              📋 Upload Guidelines:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              • <strong>File Size:</strong> Maximum 5MB per file, 25MB total
              <br />
              • <strong>Image Types:</strong> JPEG, PNG, WebP, GIF
              <br />
              • <strong>Document Types:</strong> PDF, Word documents
              <br />
              • <strong>Tip:</strong> Use online compression tools for large files
            </Typography>
          </Box>
        )}

        {/* Network Issues Help */}
        {(type === 'NETWORK_ERROR' || type === 'TIMEOUT_ERROR') && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'warning.main' }}>
              🔧 Connection Troubleshooting:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              • Check your internet connection
              <br />
              • Try uploading one file at a time
              <br />
              • Ensure you're on a stable network
              <br />
              • Close other heavy downloads/uploads
            </Typography>
          </Box>
        )}

        {/* Technical Details (collapsible) */}
        {showTechnicalDetails && error.technicalDetails && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Technical Details:
            </Typography>
            <Box sx={{ 
              p: 1, 
              bgcolor: 'grey.100', 
              borderRadius: 1, 
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              wordBreak: 'break-all'
            }}>
              {error.technicalDetails}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          color="inherit"
        >
          Close
        </Button>
        
        {onRetry && (type === 'NETWORK_ERROR' || type === 'TIMEOUT_ERROR' || type === 'SERVER_ERROR') && (
          <Button
            onClick={() => {
              onClose();
              onRetry();
            }}
            variant="contained"
            startIcon={<RetryIcon />}
            sx={{ ml: 1 }}
          >
            Try Again
          </Button>
        )}
        
        {type === 'FILE_TOO_LARGE' && (
          <Button
            onClick={onClose}
            variant="contained"
            sx={{ ml: 1 }}
          >
            Choose Different Files
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UploadErrorDialog;
