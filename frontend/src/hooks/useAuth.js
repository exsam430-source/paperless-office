import { useAuthStore } from '@store/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateUser,        // ✅ Add this
    refreshUserData,   // ✅ Add this
    register,
    getCurrentUser,
    clearError,
  } = useAuthStore();

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  // Require authentication
  const requireAuth = () => {
    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      }
    }, [isAuthenticated, navigate]);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateUser,        // ✅ Add this
    refreshUserData,   // ✅ Add this
    register,
    getCurrentUser,
    clearError,
    hasRole,
    requireAuth,
  };
};