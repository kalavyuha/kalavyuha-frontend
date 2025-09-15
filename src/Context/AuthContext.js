import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const userDetail = localStorage.getItem('userDetail');
      if (userDetail) {
        const parsedUser = JSON.parse(userDetail);
        if (parsedUser && parsedUser._id) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      // Clear corrupted data
      localStorage.removeItem('userDetail');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('userDetail', JSON.stringify(userData));
  };

  const logout = () => {
    // Clear user state
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('userDetail');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('businessId');
    
    // Clear any business data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('businessData_')) {
        localStorage.removeItem(key);
      }
    });

    // Check if user is on protected route and redirect
    const protectedRoutes = ['/appointment-history', '/appointment-history-details', '/profile'];
    const currentPath = window.location.pathname;
    
    if (protectedRoutes.includes(currentPath)) {
      // Force page refresh and redirect to home
      window.location.href = '/';
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
