import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Files, FileText, Clock, FilePlus, Users, 
  Building2, GitBranch, BarChart3, FileBarChart2, User, 
  Sliders, Settings, X, Sparkles, Zap
} from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { useUIStore } from '@store/uiStore';
import { cn } from '@utils/cn';
import Badge from '@components/common/Badge';
import Avatar from '@components/common/Avatar';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { sidebarOpen, mobileMenuOpen, toggleMobileMenu } = useUIStore();

  const isAdmin = user?.role === 'ADMIN';

  const navigation = isAdmin
    ? [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, gradient: 'from-indigo-500 to-purple-600' },
        { name: 'All Files', path: '/files', icon: Files, gradient: 'from-blue-500 to-cyan-600' },
        { name: 'My Files', path: '/my-files', icon: FileText, gradient: 'from-emerald-500 to-teal-600' },
        { name: 'Users', path: '/users', icon: Users, gradient: 'from-violet-500 to-purple-600' },
        { name: 'Departments', path: '/departments', icon: Building2, gradient: 'from-amber-500 to-orange-600' },
        { name: 'Workflows', path: '/workflows', icon: GitBranch, gradient: 'from-pink-500 to-rose-600' },
        { name: 'Analytics', path: '/analytics', icon: BarChart3, gradient: 'from-cyan-500 to-blue-600' },
        { name: 'Reports', path: '/reports', icon: FileBarChart2, gradient: 'from-fuchsia-500 to-pink-600' },
        { name: 'Settings', path: '/settings', icon: Settings, gradient: 'from-slate-500 to-slate-700' },
        { name: 'Profile', path: '/profile', icon: User, gradient: 'from-teal-500 to-emerald-600' },
        { name: 'Preferences', path: '/preferences', icon: Sliders, gradient: 'from-indigo-500 to-blue-600' },
      ]
    : [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, gradient: 'from-indigo-500 to-purple-600' },
        { name: 'My Files', path: '/my-files', icon: FileText, gradient: 'from-emerald-500 to-teal-600' },
        { name: 'Pending', path: '/pending', icon: Clock, badge: 0, gradient: 'from-amber-500 to-orange-600' },
        { name: 'Create File', path: '/files/create', icon: FilePlus, gradient: 'from-pink-500 to-rose-600' },
        { name: 'Settings', path: '/settings', icon: Settings, gradient: 'from-slate-500 to-slate-700' },
        { name: 'Profile', path: '/profile', icon: User, gradient: 'from-teal-500 to-emerald-600' },
        { name: 'Preferences', path: '/preferences', icon: Sliders, gradient: 'from-indigo-500 to-blue-600' },
      ];

  const isActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-6 border-b border-white/20 dark:border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-60" />
            <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black gradient-text">
              Paperless Office
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Smart System
            </p>
          </div>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  toggleMobileMenu();
                }
              }}
              style={{ animationDelay: `${index * 0.05}s` }}
              className={cn(
                'flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 group relative overflow-hidden animate-slide-right',
                active
                  ? 'bg-gradient-to-r shadow-xl scale-105'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105'
              )}
            >
              {/* Active gradient background */}
              {active && (
                <>
                  <div className={cn('absolute inset-0 bg-gradient-to-r opacity-100', item.gradient)} />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                </>
              )}

              {/* Icon */}
              <div className={cn(
                'relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
                active 
                  ? 'bg-white/30 backdrop-blur-sm shadow-lg' 
                  : 'bg-gradient-to-br ' + item.gradient
              )}>
                <Icon className={cn(
                  'w-5 h-5 transition-all duration-300',
                  active ? 'text-white' : 'text-white'
                )} />
              </div>

              {/* Text */}
              <span className={cn(
                'flex-1 relative transition-all duration-300',
                active ? 'text-white' : ''
              )}>
                {item.name}
              </span>

              {/* Badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <div className="relative">
                  <Badge variant="danger" size="sm" className="animate-bounce">
                    {item.badge}
                  </Badge>
                </div>
              )}

              {/* Active indicator */}
              {active && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info Card */}
      <div className="p-4 border-t border-white/20 dark:border-white/10">
        <div className="card-gradient p-[2px] rounded-2xl">
          <div className="card-gradient-inner p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Avatar
                  src={user?.profilePicture}
                  name={user?.name}
                  size="lg"
                  className="ring-4 ring-white dark:ring-slate-900"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {user?.department?.name || 'No Department'}
                </p>
              </div>
            </div>
            <Badge variant="primary" size="sm" className="w-full justify-center">
              <Zap className="w-3 h-3 mr-1" />
              {user?.role}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:block fixed left-0 top-0 bottom-0 z-40 glass-strong border-r border-white/20 dark:border-white/10 transition-all duration-500',
          sidebarOpen ? 'w-80' : 'w-0'
        )}
      >
        {sidebarOpen && <SidebarContent />}
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-50 transition-all duration-300',
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300',
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={toggleMobileMenu}
        />

        {/* Sidebar */}
        <aside
          className={cn(
            'absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] glass-strong shadow-2xl transition-transform duration-500',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <SidebarContent />
        </aside>
      </div>
    </>
  );
};

export default Sidebar;