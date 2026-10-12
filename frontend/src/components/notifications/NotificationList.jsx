import React from 'react';
import { useNotificationStore } from '@store/notificationStore';
import NotificationItem from './NotificationItem';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import EmptyState from '@components/common/EmptyState';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';

const NotificationList = () => {
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotificationStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white mb-2">
            Notifications
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<CheckCheck className="w-4 h-4" />}
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={clearAll}
            >
              Clear all
              </Button>
          </div>
        )}
      </div>

      {/* Notifications */}
      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! We'll notify you when something happens."
        />
      ) : (
        <Card className="divide-y divide-secondary-200 dark:divide-secondary-700 p-0">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </Card>
      )}
    </div>
  );
};

export default NotificationList;