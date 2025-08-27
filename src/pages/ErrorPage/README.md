# Error Handling System

This document describes the comprehensive error handling system implemented in the Kalavyuha Frontend application.

## Components

### 1. ErrorPage Component (`src/pages/ErrorPage/ErrorPage.js`)
A modern and professional error page component that displays user-friendly error messages.

**Features:**
- Responsive design with mobile-first approach
- Customizable error codes, titles, and messages
- Professional gradient styling matching the app's design system
- Action buttons for navigation (Home, Back, Refresh)
- Support information section
- Different error type handling (404, 500, 403, etc.)

**Props:**
- `errorCode`: The error code to display (default: "404")
- `errorTitle`: The error title (default: "Page Not Found")
- `errorMessage`: The error message (default: custom message)
- `showRefresh`: Whether to show the refresh button (default: true)

### 2. NotFoundPage Component (`src/pages/ErrorPage/NotFoundPage.js`)
A specialized 404 error page that uses the ErrorPage component with 404-specific messaging.

### 3. ErrorBoundary Component (`src/components/ErrorBoundary.js`)
A React Error Boundary that catches JavaScript errors anywhere in the component tree.

**Features:**
- Catches and handles JavaScript runtime errors
- Logs errors to console (can be extended to external services)
- Shows fallback UI when errors occur
- Development mode error details display
- Production-ready error handling

### 4. Error Handler Utilities (`src/utils/errorHandler.js`)
Utility functions for handling different types of errors throughout the application.

**Features:**
- API error handling with automatic status code routing
- Toast notification utilities
- Error logging functionality
- Custom hook for easy error handling
- HOC for component-level error boundaries

## Usage

### Basic Error Page
```javascript
import ErrorPage from './pages/ErrorPage/ErrorPage';

// Use with default 404 settings
<ErrorPage />

// Use with custom settings
<ErrorPage 
  errorCode="500"
  errorTitle="Server Error"
  errorMessage="Something went wrong on our end."
  showRefresh={true}
/>
```

### Using Error Boundary
```javascript
import ErrorBoundary from './components/ErrorBoundary';
import ErrorPage from './pages/ErrorPage/ErrorPage';

<ErrorBoundary fallback={ErrorPage}>
  <YourComponent />
</ErrorBoundary>
```

### Using Error Handler Utilities
```javascript
import { useErrorHandler } from '../utils/errorHandler';

const MyComponent = () => {
  const { handleError, showError, showSuccess } = useErrorHandler();

  const handleApiCall = async () => {
    try {
      const response = await api.getData();
      showSuccess('Data loaded successfully!');
    } catch (error) {
      handleError(error); // Automatically handles error routing
    }
  };

  return <button onClick={handleApiCall}>Load Data</button>;
};
```

### Programmatic Error Navigation
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navigate to error page with custom state
navigate('/error', { 
  state: { 
    errorCode: '403',
    errorTitle: 'Access Denied',
    errorMessage: 'You need special permissions to access this page.',
    showRefresh: false
  }
});
```

## Routes

The following error-related routes are configured:

- `/error` - Generic error page (accepts state for customization)
- `/error-demo` - Demo page showing different error types
- `*` - Catch-all route for 404 errors

## Styling

The error pages follow the application's design system:

- **Primary Color**: `#1b4d69`
- **Secondary Color**: `#8eabbb`
- **Background**: `#eaeef2`
- **Card Background**: `#fbfbfb`
- **Gradient Buttons**: Linear gradient from primary to secondary colors
- **Responsive Design**: Mobile-first approach with breakpoints
- **Modern UI**: Cards with blur effects, shadows, and smooth transitions

## Error Types Handled

1. **404 - Page Not Found**: For non-existent routes
2. **500 - Server Error**: For backend/API errors
3. **403 - Access Denied**: For authorization errors
4. **400 - Bad Request**: For malformed requests
5. **Network Errors**: For connectivity issues
6. **JavaScript Errors**: Runtime errors caught by Error Boundary

## Demo

Visit `/error-demo` to see all error handling features in action. This page includes:

- Buttons to simulate different HTTP errors
- Toast notification examples
- Error boundary demonstration
- Navigation to test actual 404 handling

## Best Practices

1. **Use Error Boundaries**: Wrap main application sections with ErrorBoundary
2. **Consistent Error Handling**: Use the error handler utilities for consistent UX
3. **User-Friendly Messages**: Always provide clear, actionable error messages
4. **Error Logging**: Log errors for debugging and monitoring
5. **Fallback Actions**: Always provide ways for users to recover (Home, Back, Refresh)
6. **Responsive Design**: Ensure error pages work on all device sizes
7. **Accessibility**: Use proper ARIA labels and semantic HTML

## Future Enhancements

- Integration with error monitoring services (Sentry, LogRocket)
- Offline error handling
- Error retry mechanisms
- User feedback collection on errors
- A/B testing for error page effectiveness
- Analytics integration for error tracking
