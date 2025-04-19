import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function ProtectedRoute({ children }) {
  const token = Cookies.get('jwt');

  if (!token) {
    // Redirect to login if token is missing
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;