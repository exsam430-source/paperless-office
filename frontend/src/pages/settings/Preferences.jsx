import React from 'react';
import { Moon, Sun, PanelLeftClose, PanelLeftOpen, Sparkles, Zap, Settings as SettingsIcon } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import { useUIStore } from '@store/uiStore';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const Preferences = () => {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUIStore();

  const preferences = [
    {
      title: 'Theme',
      description: 'Switch between light and dark mode for optimal viewing comfort.',
      current: theme,
      icon: theme === 'dark' ? Moon : Sun,
      gradient: 'from-indigo-500 to-purple-600',
      action: toggleTheme,
      buttonLabel: 'Toggle Theme',
      buttonIcon: theme === 'dark' ? Sun : Moon,
    },
    {
      title: 'Sidebar',
      description: 'Expand or collapse the sidebar in desktop view for more workspace.',
      current: sidebarOpen ? 'Open' : 'Closed',
      icon: sidebarOpen ? PanelLeftOpen : PanelLeftClose,
      gradient: 'from-emerald-500 to-teal-600',
      action: toggleSidebar,
      buttonLabel: 'Toggle Sidebar',
      buttonIcon: sidebarOpen ? PanelLeftClose : PanelLeftOpen,
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white"
      >
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
            <SettingsIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-1">
              Preferences
            </h1>
            <p className="text-white/90 text-base">
              Customize your UI and experience (saved locally)
            </p>
          </div>
        </div>
      </motion.div>

      {/* Preference Cards */}
      <div className="space-y-6">
        {preferences.map((pref, index) => {
          const Icon = pref.icon;
          const ButtonIcon = pref.buttonIcon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative group">
                <div className={cn(
                  'absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity bg-gradient-to-br',
                  pref.gradient
                )} />
                
                <Card variant="gradient" className="relative">
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      {/* Left Content */}
                      <div className="flex items-start gap-5 flex-1">
                        <div className="relative">
                          <div className={cn(
                            'absolute inset-0 rounded-2xl blur-xl opacity-60 bg-gradient-to-br',
                            pref.gradient
                          )} />
                          <div className={cn(
                            'relative w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl',
                            pref.gradient
                          )}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            {pref.title}
                            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                          </h3>
                          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                            {pref.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              Current:
                            </span>
                            <Badge variant="primary" size="md" icon>
                              <Zap className="w-3 h-3" />
                              {pref.current}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Right Action */}
                      <Button
                        leftIcon={<ButtonIcon className="w-5 h-5" />}
                        onClick={pref.action}
                        size="lg"
                        className={cn(
                          'bg-gradient-to-r text-white shadow-xl hover:shadow-2xl',
                          pref.gradient
                        )}
                      >
                        {pref.buttonLabel}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <div className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-black text-indigo-900 dark:text-indigo-300 mb-1">
                💡 Developer Note
              </h4>
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
                Want institutional preferences stored in the database per user? We can add a backend Settings collection with user-specific configurations.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Preferences;