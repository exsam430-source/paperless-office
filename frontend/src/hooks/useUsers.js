import { useState } from 'react';
import { usersAPI } from '@api/users.api';
import { useNotifications } from '@hooks/useNotifications';

export const useUsers = () => {
  const { showToast } = useNotifications();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await usersAPI.getAllUsers();
      setUsers(res.data || []);
      return res;
    } catch (e) {
      showToast('error', e?.response?.data?.message || 'Failed to fetch users');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id, payload) => {
    setIsLoading(true);
    try {
      const res = await usersAPI.updateUser(id, payload);
      showToast('success', 'User updated');
      await fetchUsers();
      return res;
    } catch (e) {
      showToast('error', e?.response?.data?.message || 'Failed to update user');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setIsLoading(true);
    try {
      const res = await usersAPI.deleteUser(id);
      showToast('success', 'User deleted');
      await fetchUsers();
      return res;
    } catch (e) {
      showToast('error', e?.response?.data?.message || 'Failed to delete user');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { users, isLoading, fetchUsers, updateUser, deleteUser };
};