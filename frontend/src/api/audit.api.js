import axios from './axios';

export const auditAPI = {
  getLogs: async (params = {}) => {
    const res = await axios.get('/audit', { params });
    return res.data;
  }
};