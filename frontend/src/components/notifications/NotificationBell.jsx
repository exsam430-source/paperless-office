import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Bell, CheckCheck, X, Sparkles } from 'lucide-react';
import { useNotificationStore } from '@store/notificationStore';
import NotificationItem from './NotificationItem';
import Badge from '@components/common/Badge';
import Button from '@components/common/Button';

const NotificationBell = () => {
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotificationStore();
  const recentNotifications = notifications.slice(0, 5);

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="relative p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:scale-110 transition-all duration-300 group">
        <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:rotate-12 transition-transform duration-300" />
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-rose-500/50 animate-bounce">
              {unreadCount}
            </span>
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full animate-ping opacity-75" />
          </>
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-3 w-96 origin-top-right rounded-3xl glass-strong shadow-2xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none overflow-hidden">
          {/* Header */}
          <div className="relative p-6 border-b border-white/20 dark:border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
            <div className="relative flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {unreadCount} unread
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="relative flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline transition-colors"
                >
                  <CheckCheck className="w-4 h-4 inline mr-1" />
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline transition-colors ml-auto"
                >
                  <X className="w-4 h-4 inline mr-1" />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {recentNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                  <Bell className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  No notifications yet
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  We'll notify you when something arrives
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {recentNotifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 5 && (
            <div className="p-4 border-t border-white/20 dark:border-white/10">
              <Link
                to="/notifications"
                className="block text-center text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors py-2 px-4 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              >
                View all notifications →
              </Link>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NotificationBell;