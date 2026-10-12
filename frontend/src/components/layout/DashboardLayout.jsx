import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useUIStore } from '@store/uiStore';
import { useSocket } from '@hooks/useSocket';
import { cn } from '@utils/cn';

const DashboardLayout = () => {
  const { sidebarOpen } = useUIStore();
  useSocket();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
      
      {/* Grid pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5" />
      
      {/* Gradient orbs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10">
        <Navbar />
        <Sidebar />
        
        <main
          className={cn(
            'lg:transition-all lg:duration-500 min-h-[calc(100vh-5rem)]',
            sidebarOpen ? 'lg:ml-80' : 'lg:ml-0'
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="stagger-children">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'glass-strong',
          style: {
            background: 'transparent',
            boxShadow: 'none',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default DashboardLayout;