import { ROLES } from './app.config';

export const ROUTES = {
  // Public routes
  PUBLIC: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },

  // Protected routes
  DASHBOARD: '/dashboard',
  MY_FILES: '/my-files',
  PENDING: '/pending',
  CREATE_FILE: '/files/create',
  FILE_DETAILS: '/files/:id',
  ALL_FILES: '/files',
  
  // Admin routes
  USERS: '/users',
  CREATE_USER: '/users/create',
  USER_PROFILE: '/users/:id',
  
  DEPARTMENTS: '/departments',
  CREATE_DEPARTMENT: '/departments/create',
  
  WORKFLOWS: '/workflows',
  CREATE_WORKFLOW: '/workflows/create',
  
  ANALYTICS: '/analytics',
  REPORTS: '/reports',
  
  // Settings
  SETTINGS: '/settings',
  PROFILE: '/profile',
  PREFERENCES: '/preferences',
  
  // Others
  NOTIFICATIONS: '/notifications',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
};

// Route permissions
export const ROUTE_PERMISSIONS = {
  [ROUTES.USERS]: [ROLES.ADMIN],
  [ROUTES.CREATE_USER]: [ROLES.ADMIN],
  [ROUTES.DEPARTMENTS]: [ROLES.ADMIN],
  [ROUTES.CREATE_DEPARTMENT]: [ROLES.ADMIN],
  [ROUTES.WORKFLOWS]: [ROLES.ADMIN],
  [ROUTES.CREATE_WORKFLOW]: [ROLES.ADMIN],
  [ROUTES.ANALYTICS]: [ROLES.ADMIN, ROLES.DIRECTOR, ROLES.VC],
  [ROUTES.REPORTS]: [ROLES.ADMIN, ROLES.DIRECTOR, ROLES.VC],
  [ROUTES.ALL_FILES]: [ROLES.ADMIN],
};