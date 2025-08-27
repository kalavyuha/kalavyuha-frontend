import React from 'react';
import ErrorPage from './ErrorPage';

const NotFoundPage = () => {
  return (
    <ErrorPage
      errorCode="404"
      errorTitle="Page Not Found"
      errorMessage="Sorry, the page you are looking for doesn't exist or has been moved. Please check the URL or navigate back to our homepage."
      showRefresh={false}
    />
  );
};

export default NotFoundPage;
