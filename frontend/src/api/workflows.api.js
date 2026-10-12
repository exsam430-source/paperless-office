import axios from './axios';
import { API_ENDPOINTS } from '@config/api.config';

export const workflowsAPI = {
  // Get all workflows
  getAllWorkflows: async () => {
    const response = await axios.get(API_ENDPOINTS.WORKFLOWS.BASE);
    return response.data;
  },

  // Get workflow by ID
  getWorkflowById: async (id) => {
    const response = await axios.get(API_ENDPOINTS.WORKFLOWS.BY_ID(id));
    return response.data;
  },

  // Get workflow by type and department
  getWorkflowByType: async (fileType, department) => {
    const response = await axios.get(API_ENDPOINTS.WORKFLOWS.BY_TYPE(fileType, department));
    return response.data;
  },

  // Create workflow
  createWorkflow: async (workflowData) => {
    const response = await axios.post(API_ENDPOINTS.WORKFLOWS.BASE, workflowData);
    return response.data;
  },

  // Update workflow
  updateWorkflow: async (id, workflowData) => {
    const response = await axios.put(API_ENDPOINTS.WORKFLOWS.BY_ID(id), workflowData);
    return response.data;
  },

  // Delete workflow
  deleteWorkflow: async (id) => {
    const response = await axios.delete(API_ENDPOINTS.WORKFLOWS.BY_ID(id));
    return response.data;
  },
};