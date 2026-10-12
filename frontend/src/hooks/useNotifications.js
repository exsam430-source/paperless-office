import { useNotificationStore } from '@store/notificationStore';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationStore();

  // Show toast notification
  const showToast = (type, message, options = {}) => {
    const toastOptions = {
      duration: 4000,
      position: 'top-right',
      ...options,
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'info':
        toast(message, toastOptions);
        break;
      case 'warning':
        toast(message, { ...toastOptions, icon: '⚠️' });
        break;
      default:
        toast(message, toastOptions);
    }
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    showToast,
  };
};