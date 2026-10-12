export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Paperless Office',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DESCRIPTION: 'AI-Enabled Smart Paperless Office & Workflow Automation System',
  
  // Pagination
  ITEMS_PER_PAGE: 10,
  ITEMS_PER_PAGE_OPTIONS: [5, 10, 20, 50, 100],
  
  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['application/pdf'],
  MAX_FILES: 5,
  
  // Theme
  DEFAULT_THEME: 'light',
  
  // Notification Duration
  TOAST_DURATION: 3000,
  
  // Auto Refresh Intervals
  DASHBOARD_REFRESH: 30000, // 30 seconds
  NOTIFICATIONS_REFRESH: 10000, // 10 seconds
};

export const ROLES = {
  ADMIN: 'ADMIN',
  CLERK: 'CLERK',
  REGISTRAR: 'REGISTRAR',
  DIRECTOR: 'DIRECTOR',
  FINANCE: 'FINANCE',
  DEAN: 'DEAN',
  VC: 'VC',
};

export const FILE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVISION: 'REVISION',
  ESCALATED: 'ESCALATED',
};

export const FILE_TYPES = {
  LEAVE_APPLICATION: 'LEAVE_APPLICATION',
  BUDGET_REQUEST: 'BUDGET_REQUEST',
  PURCHASE_ORDER: 'PURCHASE_ORDER',
  ACADEMIC_REQUEST: 'ACADEMIC_REQUEST',
  HR_DOCUMENT: 'HR_DOCUMENT',
};

export const PRIORITY_LEVELS = {
  LOW: { value: 'LOW', color: 'success', range: [0, 33] },
  MEDIUM: { value: 'MEDIUM', color: 'warning', range: [34, 66] },
  HIGH: { value: 'HIGH', color: 'danger', range: [67, 100] },
};