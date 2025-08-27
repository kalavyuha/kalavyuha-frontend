import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';

// Error handling utility functions
export const errorHandler = {
  // Handle API errors
  handleApiError: (error, navigate) => {
    console.error('API Error:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          navigate('/error', { 
            state: { 
              errorCode: '400',
              errorTitle: 'Bad Request',
              errorMessage: data?.message || 'The request could not be understood by the server.',
              showRefresh: true
            }
          });
          break;
          
        case 401:
          toast.error('Session expired. Please login again.');
          // Redirect to login or clear session
          break;
          
        case 403:
          navigate('/error', { 
            state: { 
              errorCode: '403',
              errorTitle: 'Access Denied',
              errorMessage: 'You don\'t have permission to access this resource.',
              showRefresh: false
            }
          });
          break;
          
        case 404:
          navigate('/error', { 
            state: { 
              errorCode: '404',
              errorTitle: 'Not Found',
              errorMessage: 'The requested resource could not be found.',
              showRefresh: false
            }
          });
          break;
          
        case 500:
        case 502:
        case 503:
        case 504:
          navigate('/error', { 
            state: { 
              errorCode: '500',
              errorTitle: 'Server Error',
              errorMessage: 'Something went wrong on our end. Please try again later.',
              showRefresh: true
            }
          });
          break;
          
        default:
          navigate('/error', { 
            state: { 
              errorCode: status.toString(),
              errorTitle: 'Something went wrong',
              errorMessage: data?.message || 'An unexpected error occurred.',
              showRefresh: true
            }
          });
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
      navigate('/error', { 
        state: { 
          errorCode: 'NETWORK',
          errorTitle: 'Connection Error',
          errorMessage: 'Unable to connect to our servers. Please check your internet connection.',
          showRefresh: true
        }
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      navigate('/error', { 
        state: { 
          errorCode: 'UNKNOWN',
          errorTitle: 'Unexpected Error',
          errorMessage: 'An unexpected error occurred. Please try again.',
          showRefresh: true
        }
      });
    }
  },

  // Handle navigation errors
  handleNavigationError: (navigate, errorType = '404') => {
    switch (errorType) {
      case 'page-not-found':
        navigate('/404');
        break;
      case 'unauthorized':
        navigate('/error', { 
          state: { 
            errorCode: '401',
            errorTitle: 'Unauthorized',
            errorMessage: 'You need to be logged in to access this page.',
            showRefresh: false
          }
        });
        break;
      default:
        navigate('/404');
    }
  },

  // Show error toast
  showErrorToast: (message, duration = 5000) => {
    toast.error(message, {
      position: "top-right",
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Show success toast
  showSuccessToast: (message, duration = 3000) => {
    toast.success(message, {
      position: "top-right",
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Log error to external service (placeholder)
  logError: (error, context = {}) => {
    // Here you would typically send to an error monitoring service
    // like Sentry, LogRocket, Bugsnag, etc.
    console.error('Error logged:', {
      error: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context
    });
    
    // Example Sentry integration:
    // Sentry.captureException(error, { extra: context });
  }
};

// HOC for error boundary in specific components
export const withErrorHandling = (WrappedComponent) => {
  return function WithErrorHandlingComponent(props) {
    return (
      <ErrorBoundary>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
};

// Custom hook for error handling
export const useErrorHandler = () => {
  const navigate = useNavigate();
  
  return {
    handleError: (error) => errorHandler.handleApiError(error, navigate),
    showError: errorHandler.showErrorToast,
    showSuccess: errorHandler.showSuccessToast,
    logError: errorHandler.logError,
    navigateToError: (errorType) => errorHandler.handleNavigationError(navigate, errorType)
  };
};

export default errorHandler;
