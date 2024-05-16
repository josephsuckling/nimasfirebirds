// src/components/ProtectedRoute.js

import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/firebaseAuth'; // Adjust the path as necessary

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    isAuthenticated().then(authenticated => {
      setIsAuth(authenticated);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      // Optionally handle error, e.g., by logging or setting an error state
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Optionally, can replace with a loading spinner or similar
  }

  return isAuth ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
