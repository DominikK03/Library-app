import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LibrarianRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} />;
  if (user.role !== 'Librarian') return <Navigate to="/unauthorized" state={{ from: location }} />;

  return children;
}

export default LibrarianRoute;
