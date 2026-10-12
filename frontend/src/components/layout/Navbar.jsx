import React from 'react';
import { Menu, Bell, Moon, Sun, LogOut, Settings, User, Sparkles } from 'lucide-react';
import { Menu as HeadlessMenu } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useUIStore } from '@store/uiStore';
import { useNotificationStore } from '@store/notificationStore';
import Avatar from '@components/common/Avatar';
import Badge from '../../components/common/Badge';
import { cn } from '../../utils/cn';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, toggleSidebar, toggleMobileMenu } = useUIStore();
  const { unreadCount } = useNotificationStore();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 dark:border-white/10">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-50" />
      
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* ===== LEFT SECTION ===== */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:scale-110 transition-all duration-300 group"
            >
              <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:scale-110 transition-all duration-300 group"
            >
              <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-7 h-7 text-white animate-pulse" />
                </div>
              </div>
              
              <div className="hidden sm:block">
                <h1 className="text-xl font-black gradient-text">
                  Paperless Office
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                  Smart Document System
                </p>
              </div>
            </Link>
          </div>

          {/* ===== RIGHT SECTION ===== */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-110 transition-all duration-300 group"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <Moon className="w-5 h-5 text-white group-hover:-rotate-12 transition-transform duration-500" />
              )}
            </button>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:scale-110 transition-all duration-300 group"
            >
              <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:rotate-12 transition-transform duration-300" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-rose-500/50 animate-bounce">
                    {unreadCount}
                  </span>
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full animate-ping opacity-75" />
                </>
              )}
            </Link>

            {/* User Menu */}
            <HeadlessMenu as="div" className="relative">
              <HeadlessMenu.Button className="flex items-center gap-3 p-2 pr-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 hover:border-indigo-500/40 backdrop-blur-sm transition-all duration-300 group">
                <div className="relative">
                  <Avatar
                    src={user?.profilePicture}
                    name={user?.name}
                    size="sm"
                    showStatus={true}
                    isOnline={true}
                    className="ring-2 ring-white dark:ring-slate-900 group-hover:ring-indigo-500 transition-all duration-300"
                  />
                </div>
                
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {user?.role}
                  </p>
                </div>
              </HeadlessMenu.Button>

              <HeadlessMenu.Items className="absolute right-0 mt-3 w-72 origin-top-right rounded-3xl glass-strong shadow-2xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none overflow-hidden animate-scale-in">
                {/* User Info Header */}
                <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-b border-white/20 dark:border-white/10">
                  <div className="flex items-center gap-4 mb-3">
                    <Avatar
                      src={user?.profilePicture}
                      name={user?.name}
                      size="lg"
                      className="ring-4 ring-white dark:ring-slate-900"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <Badge variant="primary" size="sm" className="w-full justify-center">
                    {user?.role}
                  </Badge>
                </div>

                <div className="p-2">
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings/profile"
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200',
                          active
                            ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-700 dark:text-indigo-300 scale-105'
                            : 'text-slate-700 dark:text-slate-300'
                        )}
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        My Profile
                      </Link>
                    )}
                  </HeadlessMenu.Item>

                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200',
                          active
                            ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-700 dark:text-indigo-300 scale-105'
                            : 'text-slate-700 dark:text-slate-300'
                        )}
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                          <Settings className="w-5 h-5 text-white" />
                        </div>
                        Settings
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                </div>

                <div className="p-2 border-t border-white/20 dark:border-white/10">
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200',
                          active
                            ? 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-600 dark:text-rose-400 scale-105'
                            : 'text-rose-600 dark:text-rose-400'
                        )}
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                          <LogOut className="w-5 h-5 text-white" />
                        </div>
                        Logout
                      </button>
                    )}
                  </HeadlessMenu.Item>
                </div>
              </HeadlessMenu.Items>
            </HeadlessMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;