import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '@components/common/Card';
import { cn } from '@utils/cn';
import { motion } from 'framer-motion';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend, 
  color = 'primary',
  link,
  subtitle,
  loading = false,
  index = 0,
}) => {
  const isPositive = trend === 'up';
  
  const colorClasses = {
    primary: {
      gradient: 'from-indigo-500 to-purple-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      text: 'text-indigo-600 dark:text-indigo-400',
      ring: 'ring-indigo-500/30',
    },
    success: {
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      ring: 'ring-emerald-500/30',
    },
    warning: {
      gradient: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-600 dark:text-amber-400',
      ring: 'ring-amber-500/30',
    },
    danger: {
      gradient: 'from-rose-500 to-pink-600',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      text: 'text-rose-600 dark:text-rose-400',
      ring: 'ring-rose-500/30',
    },
    info: {
      gradient: 'from-blue-500 to-cyan-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      ring: 'ring-blue-500/30',
    },
    purple: {
      gradient: 'from-purple-500 to-fuchsia-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      ring: 'ring-purple-500/30',
    },
  };

  const config = colorClasses[color];

  const CardContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <div className="relative group h-full">
        {/* Glow effect */}
        <div className={cn(
          'absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 bg-gradient-to-br',
          config.gradient
        )} />

        <Card 
          className={cn(
            'relative h-full overflow-hidden transition-all duration-500',
            link && 'cursor-pointer hover:scale-105 hover:shadow-2xl hover:ring-4',
            link && config.ring
          )}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={cn(
              'absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10 blur-3xl transition-transform duration-700 group-hover:scale-150',
              config.bg
            )} />
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-5">
              {Icon && <Icon className="w-full h-full" />}
            </div>
          </div>

          <div className="relative z-10 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  {title}
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                </p>
                {subtitle && (
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-500">
                    {subtitle}
                  </p>
                )}
              </div>
              
              {/* Icon with animations */}
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className={cn(
                  'absolute inset-0 rounded-2xl blur-xl opacity-60 bg-gradient-to-br',
                  config.gradient
                )} />
                <div className={cn(
                  'relative w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
                  config.gradient
                )}>
                  {Icon && <Icon className="w-8 h-8 text-white" />}
                  {loading && (
                    <div className="absolute inset-0 rounded-2xl animate-pulse bg-white/20" />
                  )}
                </div>
              </motion.div>
            </div>

            <div className="space-y-4">
              {/* Value */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                {loading ? (
                  <div className="h-12 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
                ) : (
                  <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {value}
                  </h3>
                )}
              </motion.div>
              
              {/* Change indicator */}
              {change !== undefined && !loading && (
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className={cn(
                      'inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-xl',
                      isPositive 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30'
                    )}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(change)}%
                  </motion.div>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    vs last month
                  </span>
                </div>
              )}
            </div>

            {/* Link indicator */}
            {link && (
              <div className="mt-6 pt-6 border-t-2 border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-sm">
                  <span className={cn('font-bold', config.text)}>View Details</span>
                  <ArrowUpRight className={cn('w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform', config.text)} />
                </div>
              </div>
            )}
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        </Card>
      </div>
    </motion.div>
  );

  if (link) {
    return (
      <Link to={link} className="block h-full">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default StatsCard;