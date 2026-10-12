import React from 'react';
import { FileText, CheckCircle, XCircle, AlertCircle, Bell, Sparkles } from 'lucide-react';
import { useNotificationStore } from '@store/notificationStore';
import { formatRelativeTime } from '@utils/formatters';
import { cn } from '@utils/cn';

const NotificationItem = ({ notification }) => {
  const { markAsRead } = useNotificationStore();

  const iconConfig = {
    success: { icon: CheckCircle, gradient: 'from-emerald-500 to-teal-600' },
    error: { icon: XCircle, gradient: 'from-rose-500 to-pink-600' },
    warning: { icon: AlertCircle, gradient: 'from-amber-500 to-orange-600' },
    info: { icon: FileText, gradient: 'from-indigo-500 to-purple-600' },
  };

  const config = iconConfig[notification.type] || iconConfig.info;
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'p-4 hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10 transition-all duration-200 cursor-pointer group',
        !notification.read && 'bg-indigo-50/50 dark:bg-indigo-900/10'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn(
          'flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform',
          config.gradient
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            {notification.title}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            {notification.message}
          </p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {formatRelativeTime(notification.timestamp)}
          </p>
        </div>

        {/* Unread indicator */}
        {!notification.read && (
          <div className="flex-shrink-0">
            <div className="w-3 h-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg shadow-indigo-500/50">
              <span className="absolute w-3 h-3 bg-indigo-500 rounded-full animate-ping opacity-75" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;