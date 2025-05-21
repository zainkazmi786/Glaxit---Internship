
// Step 2: Create a protected route component

// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  
  if (!isAuthenticated) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

export default ProtectedRoute;