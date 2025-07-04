import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, user, getCurrentUser, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If we have a token but no user data, try to get current user
    if (isAuthenticated && !user && !isLoading) {
      getCurrentUser();
    }
  }, [isAuthenticated, user, getCurrentUser, isLoading]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If user login is required but user is not logged in
  if (!isAuthenticated) {
    // Redirect to dashboard or show access denied
    return <Navigate to="/" replace />;
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !user?.is_admin) {
    // Redirect to dashboard or show access denied
    return <Navigate to="/" replace />;
  }

  // If user is authenticated but trying to access login/register pages
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/dashboard" replace />;
  }


  return <>{children}</>;
};

export default ProtectedRoute; 