export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  AI_SERVICE_URL: import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:5001',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  // Files
  FILES: {
    BASE: '/files',
    MY_FILES: '/files/my/created',
    PENDING: '/files/pending/me',
    ACTION: (id) => `/files/${id}/action`,
    BY_ID: (id) => `/files/${id}`,
    HOLDER_INFO: (id) => `/files/${id}/holder-info`,
  },
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    BY_ROLE: (role) => `/users/role/${role}`,
    CREATE_MISSING: '/users/create-missing-roles',
  },
  // Departments
  DEPARTMENTS: {
    BASE: '/departments',
    BY_ID: (id) => `/departments/${id}`,
  },
  // Workflows
  WORKFLOWS: {
    BASE: '/workflows',
    BY_ID: (id) => `/workflows/${id}`,
    BY_TYPE: (type, dept) => `/workflows/${type}/${dept}`,
  },
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    APPROVAL_TIME: '/dashboard/approval-time',
    PERFORMANCE: '/dashboard/officer-performance',
    BOTTLENECKS: '/dashboard/bottlenecks',
    FILES_BY_STATUS: '/dashboard/files-by-status',
  },
  // Audit
  AUDIT: {
    BASE: '/audit',
    BY_USER: (userId) => `/audit/user/${userId}`,
  },
  // AI
  AI: {
    TEST: '/ai/test',
    CLASSIFY: '/ai/classify',
    PREDICT_PRIORITY: '/ai/predict-priority',
    PREDICT_DELAY: '/ai/predict-delay',
    PREDICT_ALL: '/ai/predict-all',
  },
};