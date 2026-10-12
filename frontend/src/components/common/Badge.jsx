import React from 'react';
import { cn } from '@utils/cn';
import { Sparkles, Zap, Shield, AlertCircle, CheckCircle, Info } from 'lucide-react';

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  rounded = 'full',
  icon = false,
  className,
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10',
    secondary: 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-700 dark:text-slate-300 border border-slate-500/30 shadow-lg shadow-slate-500/10',
    success: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10',
    warning: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/10',
    danger: 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 shadow-lg shadow-rose-500/10',
    info: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/10',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-[10px]',
    md: 'px-3.5 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm',
  };

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  };

  const icons = {
    primary: Sparkles,
    secondary: Shield,
    success: CheckCircle,
    warning: AlertCircle,
    danger: AlertCircle,
    info: Info,
  };

  const IconComponent = icons[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-bold uppercase tracking-wider backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-xl',
        variants[variant],
        sizes[size],
        roundedStyles[rounded],
        className
      )}
      {...props}
    >
      {icon && IconComponent && <IconComponent className="w-3 h-3" />}
      {children}
    </span>
  );
};

export default Badge;