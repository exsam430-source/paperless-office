import { useState } from 'react';
import { departmentsAPI } from '@api/departments.api';
import { useNotifications } from '@hooks/useNotifications';

export const useDepartments = () => {
  const { showToast } = useNotifications();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const res = await departmentsAPI.getAllDepartments();
      setDepartments(res.data || []);
      return res;
    } catch (e) {
      showToast('error', e?.response?.data?.message || 'Failed to fetch departments');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const createDepartment = async (payload) => {
    setIsLoading(true);
    try {
      const res = await departmentsAPI.createDepartment(payload);
      showToast('success', 'Department created');
      await fetchDepartments();
      return res;
    } catch (e) {
      showToast('error', e?.response?.data?.message || 'Failed to create department');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDepartment = async (id, payload) => {
    setIsLoading(true);
    try {
      const res = await departmentsAPI.updateDepartment(id, payload);
      showToast('success', 'Department updated');
      await fetchDepartments();
      return res;
    } catch (e) {
      showToast('error', e?.response?.data?.message || 'Failed to update department');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDepartment = async (id) => {
    setIsLoading(true);
    try {
      const res = await departmentsAPI.deleteDepartment(id);
      showToast('success', 'Department deleted');
      await fetchDepartments();
      return res;
    } catch (e) {
      showToast('error', e?.response?.data?.message || 'Failed to delete department');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    departments,
    isLoading,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};