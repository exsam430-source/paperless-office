import axios from './axios';
import { API_ENDPOINTS } from '@config/api.config';

export const aiAPI = {
  // Test AI connection
  testConnection: async () => {
    const response = await axios.get(API_ENDPOINTS.AI.TEST);
    return response.data;
  },

  // Classify file
  classify: async (fileData) => {
    const response = await axios.post(API_ENDPOINTS.AI.CLASSIFY, fileData);
    return response.data;
  },

  // Predict priority
  predictPriority: async (fileData) => {
    const response = await axios.post(API_ENDPOINTS.AI.PREDICT_PRIORITY, fileData);
    return response.data;
  },

  // Predict delay
  predictDelay: async (fileData) => {
    const response = await axios.post(API_ENDPOINTS.AI.PREDICT_DELAY, fileData);
    return response.data;
  },

  // Get all predictions
  predictAll: async (fileData) => {
    const response = await axios.post(API_ENDPOINTS.AI.PREDICT_ALL, fileData);
    return response.data;
  },
};