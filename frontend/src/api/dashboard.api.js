import axios from './axios';
import { API_ENDPOINTS } from '@config/api.config';

export const dashboardAPI = {
  // Get dashboard stats
  getStats: async () => {
    const response = await axios.get(API_ENDPOINTS.DASHBOARD.STATS);
    return response.data;
  },

  // Get approval time by department
  getApprovalTime: async () => {
    const response = await axios.get(API_ENDPOINTS.DASHBOARD.APPROVAL_TIME);
    return response.data;
  },

  // Get officer performance
  getOfficerPerformance: async () => {
    const response = await axios.get(API_ENDPOINTS.DASHBOARD.PERFORMANCE);
    return response.data;
  },

  // Get bottlenecks
  getBottlenecks: async () => {
    const response = await axios.get(API_ENDPOINTS.DASHBOARD.BOTTLENECKS);
    return response.data;
  },

  // Get files by status
  getFilesByStatus: async () => {
    const response = await axios.get(API_ENDPOINTS.DASHBOARD.FILES_BY_STATUS);
    return response.data;
  },
};