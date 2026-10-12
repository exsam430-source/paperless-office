import React from 'react';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, User, Sliders, Sparkles, ChevronRight } from 'lucide-react';
import Card from '@components/common/Card';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const Settings = () => {
  const items = [
    {
      title: 'Profile',
      desc: 'View account details and role information',
      icon: User,
      to: '/profile',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      title: 'Preferences',
      desc: 'Theme and UI preferences',
      icon: Sliders,
      to: '/preferences',
      gradient: 'from-emerald-500 to-teal-600',
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
            <SettingsIcon className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-1 flex items-center gap-2">
              Settings
              <Sparkles className="w-6 h-6 animate-pulse" />
            </h1>
            <p className="text-white/90 text-base">
              Manage account and application preferences.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={item.to} className="block group">
                <div className="relative">
                  <div className={cn(
                    'absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-opacity bg-gradient-to-br',
                    item.gradient
                  )} />
                  
                  <Card className="relative h-full overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <div className="p-8">
                      <div className="flex items-start gap-5 mb-6">
                        <div className="relative">
                          <div className={cn(
                            'absolute inset-0 rounded-2xl blur-xl opacity-60 bg-gradient-to-br',
                            item.gradient
                          )} />
                          <div className={cn(
                            'relative w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all',
                            item.gradient
                          )}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                            {item.title}
                          </h3>
                          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-6 h-6 text-slate-400" />
                        </div>
                      </div>

                      <div className={cn(
                        'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all bg-gradient-to-r text-white shadow-lg group-hover:shadow-xl',
                        item.gradient
                      )}>
                        Open {item.title}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  </Card>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;