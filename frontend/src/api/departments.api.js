import axios from './axios';
import { API_ENDPOINTS } from '@config/api.config';

export const departmentsAPI = {
  // Get all departments
  getAllDepartments: async () => {
    const response = await axios.get(API_ENDPOINTS.DEPARTMENTS.BASE);
    return response.data;
  },

  // Get department by ID
  getDepartmentById: async (id) => {
    const response = await axios.get(API_ENDPOINTS.DEPARTMENTS.BY_ID(id));
    return response.data;
  },

  // Create department
  createDepartment: async (departmentData) => {
    const response = await axios.post(API_ENDPOINTS.DEPARTMENTS.BASE, departmentData);
    return response.data;
  },

  // Update department
  updateDepartment: async (id, departmentData) => {
    const response = await axios.put(API_ENDPOINTS.DEPARTMENTS.BY_ID(id), departmentData);
    return response.data;
  },

  // Delete department
  deleteDepartment: async (id) => {
    const response = await axios.delete(API_ENDPOINTS.DEPARTMENTS.BY_ID(id));
    return response.data;
  },
};