/**
 * Status badge colors
 */
export const STATUS_COLORS = {
  PENDING: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
  APPROVED: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
  REJECTED: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
  REVISION: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
  ESCALATED: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
};

/**
 * Priority colors
 */
export const PRIORITY_COLORS = {
  LOW: 'bg-success-500',
  MEDIUM: 'bg-warning-500',
  HIGH: 'bg-danger-500',
};

/**
 * Role badges
 */
export const ROLE_BADGES = {
  ADMIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  CLERK: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  REGISTRAR: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  DIRECTOR: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  FINANCE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  DEAN: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  VC: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

/**
 * File type icons
 */
export const FILE_TYPE_ICONS = {
  LEAVE_APPLICATION: '🏖️',
  BUDGET_REQUEST: '💰',
  PURCHASE_ORDER: '🛒',
  ACADEMIC_REQUEST: '🎓',
  HR_DOCUMENT: '👥',
};

/**
 * Navigation items based on role
 */
export const NAVIGATION = {
  ADMIN: [
    { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'All Files', path: '/files', icon: 'Files' },
    { name: 'My Files', path: '/my-files', icon: 'FileText' },
    { name: 'Users', path: '/users', icon: 'Users' },
    { name: 'Departments', path: '/departments', icon: 'Building2' },
    { name: 'Workflows', path: '/workflows', icon: 'GitBranch' },
    { name: 'Analytics', path: '/analytics', icon: 'BarChart3' },
    { name: 'Settings', path: '/settings', icon: 'Settings' },
  ],
  DEFAULT: [
    { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'My Files', path: '/my-files', icon: 'FileText' },
    { name: 'Pending', path: '/pending', icon: 'Clock' },
    { name: 'Create File', path: '/files/create', icon: 'FilePlus' },
    { name: 'Settings', path: '/settings', icon: 'Settings' },
  ],
};