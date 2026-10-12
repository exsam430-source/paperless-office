import axios from './axios';
import { API_ENDPOINTS } from '@config/api.config';

export const usersAPI = {
  // Get all users
  getAllUsers: async () => {
    const response = await axios.get(API_ENDPOINTS.USERS.BASE);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await axios.get(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },

  // Get users by role
  getUsersByRole: async (role) => {
    const response = await axios.get(API_ENDPOINTS.USERS.BY_ROLE(role));
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await axios.put(API_ENDPOINTS.USERS.BY_ID(id), userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await axios.delete(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },

  // Create missing role users
  createMissingRoles: async () => {
    const response = await axios.post(API_ENDPOINTS.USERS.CREATE_MISSING);
    return response.data;
  },
};