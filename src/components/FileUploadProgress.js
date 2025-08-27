import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Alert,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  CloudUpload as UploadIcon,
  Compress as CompressIcon,
} from '@mui/icons-material';

const FileUploadProgress = ({
  isUploading,
  progress,
  progressMessage,
  error,
  uploadedFiles = [],
  onRetry,
  onCancel,
  showDetails = true,
}) => {
  const getProgressColor = () => {
    if (error) return 'error';
    if (progress === 100) return 'success';
    return 'primary';
  };

  const getStatusIcon = () => {
    if (error) return <ErrorIcon color="error" />;
    if (progress === 100) return <CheckIcon color="success" />;
    return <UploadIcon color="primary" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isUploading && !error && uploadedFiles.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 2,
        borderRadius: 2,
        border: error ? '1px solid #f44336' : progress === 100 ? '1px solid #4caf50' : '1px solid #2196f3',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {getStatusIcon()}
        <Typography variant="h6" sx={{ ml: 1, flex: 1 }}>
          {error ? 'Upload Failed' : progress === 100 ? 'Upload Complete' : 'Uploading Files'}
        </Typography>
        
        {isUploading && onCancel && (
          <Button
            size="small"
            onClick={onCancel}
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        )}
      </Box>

      {/* Progress Bar */}
      {(isUploading || progress > 0) && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={getProgressColor()}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {progressMessage || 'Processing...'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          </Box>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            onRetry && (
              <Button color="inherit" size="small" onClick={onRetry}>
                Retry
              </Button>
            )
          }
        >
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      )}

      {/* Success Message */}
      {progress === 100 && !error && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body2">
            {uploadedFiles.length === 1 
              ? 'File uploaded successfully!' 
              : `${uploadedFiles.length} files uploaded successfully!`
            }
          </Typography>
        </Alert>
      )}

      {/* File Details */}
      {showDetails && uploadedFiles.length > 0 && (
        <Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Uploaded Files:
          </Typography>
          
          {uploadedFiles.map((file, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1,
                bgcolor: 'grey.50',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                {file.type.startsWith('image/') ? (
                  <CompressIcon sx={{ mr: 1, color: 'grey.600' }} />
                ) : (
                  <UploadIcon sx={{ mr: 1, color: 'grey.600' }} />
                )}
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" noWrap>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {file.type}
                  </Typography>
                </Box>
              </Box>
              
              <Chip
                label={formatFileSize(file.size)}
                size="small"
                variant="outlined"
                sx={{ ml: 2 }}
              />
            </Box>
          ))}
          
          {uploadedFiles.length > 0 && (
            <Box sx={{ mt: 2, p: 1, bgcolor: 'primary.50', borderRadius: 1 }}>
              <Typography variant="caption" color="primary.main">
                Total size: {formatFileSize(uploadedFiles.reduce((sum, file) => sum + file.size, 0))}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Tips */}
      {error && error.includes('too large') && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
          <Typography variant="body2" color="warning.main" sx={{ fontWeight: 'bold', mb: 1 }}>
            💡 Tips to reduce file size:
          </Typography>
          <Typography variant="caption" color="warning.dark" component="div">
            • For images: Use JPEG format, reduce image dimensions, or use online compression tools
            <br />
            • For PDFs: Use PDF compression tools or reduce image quality
            <br />
            • Maximum file size: 5MB per file, 25MB total
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FileUploadProgress;
