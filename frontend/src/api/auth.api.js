import axios from './axios';
import { API_ENDPOINTS } from '@config/api.config';

export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  // Register (Admin only)
  register: async (userData) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axios.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  // ✅ Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await axios.post('/auth/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ✅ Delete profile picture
  deleteProfilePicture: async () => {
    const response = await axios.delete('/auth/profile/picture');
    return response.data;
  },
};

