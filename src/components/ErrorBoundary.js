import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console or error reporting service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Here you could also log to an error reporting service like Sentry
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      const ErrorPage = this.props.fallback;
      
      if (ErrorPage) {
        return (
          <ErrorPage 
            errorCode="500"
            errorTitle="Something went wrong"
            errorMessage="An unexpected error occurred. Please refresh the page or try again later."
            showRefresh={true}
          />
        );
      }

      // Default fallback UI if no custom component is provided
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#eaeef2',
          fontFamily: 'inherit'
        }}>
          <h1 style={{ 
            color: '#1b4d69', 
            fontSize: '2rem', 
            marginBottom: '1rem' 
          }}>
            Oops! Something went wrong
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: '1rem', 
            marginBottom: '2rem',
            maxWidth: '500px' 
          }}>
            We're sorry, but something unexpected happened. Please refresh the page or try again later.
          </p>
          <button
            style={{
              background: 'linear-gradient(135deg, #1b4d69 0%, #8eabbb 100%)',
              color: '#fbfbfb',
              border: 'none',
              borderRadius: '30px',
              padding: '12px 32px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
          
          {/* Development error details - only show in development */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              marginTop: '2rem', 
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
              maxWidth: '800px',
              width: '100%'
            }}>
              <summary style={{ 
                cursor: 'pointer', 
                fontWeight: 'bold',
                color: '#1b4d69',
                marginBottom: '1rem'
              }}>
                Error Details (Development Only)
              </summary>
              <pre style={{ 
                whiteSpace: 'pre-wrap',
                fontSize: '12px',
                color: '#666',
                textAlign: 'left'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
