import { useState } from 'react';
import { workflowsAPI } from '@api/workflows.api';
import { useNotifications } from '@hooks/useNotifications';

export const useWorkflows = () => {
  const { showToast } = useNotifications();
  const [workflows, setWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWorkflows = async () => {
    setIsLoading(true);
    try {
      const res = await workflowsAPI.getAllWorkflows();
      setWorkflows(res.data || []);
      return res;
    } catch (e) {
      showToast('error', e?.response?.data?.message || 'Failed to fetch workflows');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const createWorkflow = async (payload) => {
    setIsLoading(true);
    try {
      const res = await workflowsAPI.createWorkflow(payload);
      showToast('success', 'Workflow created');
      await fetchWorkflows();
      return res;
    } catch (e) {
      showToast('error', e?.response?.data?.message || 'Failed to create workflow');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Backend update endpoint expects { steps, isActive } (your controller)
  const updateWorkflow = async (id, payload) => {
    setIsLoading(true);
    try {
      const res = await workflowsAPI.updateWorkflow(id, payload);
      showToast('success', 'Workflow updated');
      await fetchWorkflows();
      return res;
    } catch (e) {
      showToast('error', e?.response?.data?.message || 'Failed to update workflow');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorkflow = async (id) => {
    setIsLoading(true);
    try {
      const res = await workflowsAPI.deleteWorkflow(id);
      showToast('success', 'Workflow deleted');
      await fetchWorkflows();
      return res;
    } catch (e) {
      showToast('error', e?.response?.data?.message || 'Failed to delete workflow');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { workflows, isLoading, fetchWorkflows, createWorkflow, updateWorkflow, deleteWorkflow };
};