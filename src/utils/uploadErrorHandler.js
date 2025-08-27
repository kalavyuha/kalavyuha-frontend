/**
 * Enhanced error handling utilities for file uploads and API responses
 */

export class UploadErrorHandler {
  static ERROR_TYPES = {
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    NETWORK_ERROR: 'NETWORK_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  };

  /**
   * Parse and categorize errors from upload responses
   */
  static parseError(error) {
    let errorType = this.ERROR_TYPES.UNKNOWN_ERROR;
    let userMessage = 'An unexpected error occurred';
    let technicalDetails = error.message || 'Unknown error';
    let suggestedActions = [];

    if (error.response) {
      // HTTP response error
      const { status, data } = error.response;
      
      switch (status) {
        case 413:
          errorType = this.ERROR_TYPES.FILE_TOO_LARGE;
          userMessage = 'Your files are too large for upload';
          suggestedActions = [
            'Compress images before uploading',
            'Use smaller file sizes (max 5MB per file)',
            'Upload fewer files at once',
            'Convert images to JPEG format'
          ];
          break;

        case 422:
          errorType = this.ERROR_TYPES.VALIDATION_ERROR;
          userMessage = 'Invalid file format or content';
          
          if (data && data.detail) {
            if (Array.isArray(data.detail)) {
              technicalDetails = data.detail.map(err => 
                `${err.loc?.join('.')} - ${err.msg}`
              ).join(', ');
            } else {
              technicalDetails = data.detail;
            }
          }
          
          suggestedActions = [
            'Check file formats (allowed: images, PDF, Word documents)',
            'Ensure files are not corrupted',
            'Try uploading files one at a time'
          ];
          break;

        case 401:
        case 403:
          errorType = this.ERROR_TYPES.AUTHENTICATION_ERROR;
          userMessage = 'Authentication failed';
          suggestedActions = [
            'Please log in again',
            'Check your account permissions'
          ];
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          errorType = this.ERROR_TYPES.SERVER_ERROR;
          userMessage = 'Server error occurred';
          suggestedActions = [
            'Please try again in a few minutes',
            'Contact support if the problem persists'
          ];
          break;

        default:
          if (data && data.message) {
            userMessage = data.message;
            technicalDetails = data.message;
          }
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      // Timeout error
      errorType = this.ERROR_TYPES.TIMEOUT_ERROR;
      userMessage = 'Upload timed out';
      suggestedActions = [
        'Try uploading smaller files',
        'Check your internet connection',
        'Upload files one at a time'
      ];
    } else if (error.request) {
      // Network error
      errorType = this.ERROR_TYPES.NETWORK_ERROR;
      userMessage = 'Network connection error';
      suggestedActions = [
        'Check your internet connection',
        'Try again in a moment',
        'Contact your network administrator if the problem persists'
      ];
    } else if (error.message.includes('too large') || error.message.includes('413')) {
      // File size error
      errorType = this.ERROR_TYPES.FILE_TOO_LARGE;
      userMessage = 'Files are too large for upload';
      technicalDetails = error.message;
      suggestedActions = [
        'Compress your files before uploading',
        'Maximum file size: 5MB per file, 25MB total',
        'Use image compression tools',
        'Convert to more efficient formats (JPEG for images)'
      ];
    } else if (error.message.includes('not supported') || error.message.includes('Invalid')) {
      // File type error
      errorType = this.ERROR_TYPES.INVALID_FILE_TYPE;
      userMessage = 'Invalid file type';
      technicalDetails = error.message;
      suggestedActions = [
        'Use supported file types: images (JPEG, PNG, WebP), PDF, Word documents',
        'Convert files to supported formats',
        'Check that files are not corrupted'
      ];
    }

    return {
      type: errorType,
      userMessage,
      technicalDetails,
      suggestedActions,
      originalError: error,
    };
  }

  /**
   * Handle API response errors specifically
   */
  static async handleApiResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorData = null;
      
      try {
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          // Server returned HTML or other non-JSON response
          const textResponse = await response.text();
          
          if (response.status === 413) {
            throw new Error('Files are too large for upload. The server rejected the request due to file size limits.');
          }
          
          throw new Error(`Server returned ${response.status}: ${response.statusText}. Please try again or contact support.`);
        }
      } catch (parseError) {
        if (response.status === 413) {
          throw new Error('Files are too large for upload. Please compress your files and try again.');
        }
        throw new Error(`Server error (${response.status}). Unable to process the response.`);
      }
      
      // Create error object with response data
      const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      error.response = { status: response.status, data: errorData };
      throw error;
    }

    // Try to parse successful response as JSON
    try {
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // Non-JSON success response
        return { 
          success: true, 
          message: 'Operation completed successfully',
          data: await response.text()
        };
      }
    } catch (parseError) {
      console.warn('Could not parse response as JSON:', parseError);
      return { 
        success: true, 
        message: 'Operation completed successfully'
      };
    }
  }

  /**
   * Create user-friendly error message with suggestions
   */
  static createUserFriendlyMessage(error) {
    const parsed = this.parseError(error);
    
    let message = parsed.userMessage;
    
    if (parsed.suggestedActions.length > 0) {
      message += '\n\nSuggestions:\n• ' + parsed.suggestedActions.join('\n• ');
    }
    
    return {
      title: this.getErrorTitle(parsed.type),
      message,
      type: parsed.type,
      actions: parsed.suggestedActions,
    };
  }

  /**
   * Get error title based on error type
   */
  static getErrorTitle(errorType) {
    const titles = {
      [this.ERROR_TYPES.FILE_TOO_LARGE]: 'Files Too Large',
      [this.ERROR_TYPES.INVALID_FILE_TYPE]: 'Invalid File Type',
      [this.ERROR_TYPES.NETWORK_ERROR]: 'Connection Error',
      [this.ERROR_TYPES.SERVER_ERROR]: 'Server Error',
      [this.ERROR_TYPES.TIMEOUT_ERROR]: 'Upload Timeout',
      [this.ERROR_TYPES.VALIDATION_ERROR]: 'Validation Error',
      [this.ERROR_TYPES.AUTHENTICATION_ERROR]: 'Authentication Error',
      [this.ERROR_TYPES.UNKNOWN_ERROR]: 'Upload Error',
    };
    
    return titles[errorType] || 'Error';
  }

  /**
   * Log error for debugging purposes
   */
  static logError(error, context = '') {
    const parsed = this.parseError(error);
    
    console.group(`🚨 Upload Error ${context ? `(${context})` : ''}`);
    console.error('Error Type:', parsed.type);
    console.error('User Message:', parsed.userMessage);
    console.error('Technical Details:', parsed.technicalDetails);
    console.error('Suggested Actions:', parsed.suggestedActions);
    console.error('Original Error:', parsed.originalError);
    console.groupEnd();
  }

  /**
   * Check if error is retryable
   */
  static isRetryable(error) {
    const parsed = this.parseError(error);
    
    const retryableTypes = [
      this.ERROR_TYPES.NETWORK_ERROR,
      this.ERROR_TYPES.TIMEOUT_ERROR,
      this.ERROR_TYPES.SERVER_ERROR,
    ];
    
    return retryableTypes.includes(parsed.type);
  }

  /**
   * Get retry delay based on error type
   */
  static getRetryDelay(error, attemptNumber = 1) {
    const parsed = this.parseError(error);
    
    const baseDelays = {
      [this.ERROR_TYPES.NETWORK_ERROR]: 1000,
      [this.ERROR_TYPES.TIMEOUT_ERROR]: 2000,
      [this.ERROR_TYPES.SERVER_ERROR]: 3000,
    };
    
    const baseDelay = baseDelays[parsed.type] || 1000;
    
    // Exponential backoff with jitter
    return baseDelay * Math.pow(2, attemptNumber - 1) + Math.random() * 1000;
  }
}

export default UploadErrorHandler;
