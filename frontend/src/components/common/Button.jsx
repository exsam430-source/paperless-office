import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@utils/cn';

const Button = React.forwardRef(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';

    const variants = {
      primary: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 focus:ring-purple-500/50 hover:scale-105',
      secondary: 'bg-gradient-to-br from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 dark:from-slate-700 dark:to-slate-800 dark:hover:from-slate-600 dark:hover:to-slate-700 text-slate-900 dark:text-white shadow-lg hover:shadow-xl focus:ring-slate-500/50 hover:scale-105',
      success: 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 focus:ring-emerald-500/50 hover:scale-105',
      danger: 'bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-xl shadow-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/40 focus:ring-rose-500/50 hover:scale-105',
      warning: 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 focus:ring-amber-500/50 hover:scale-105',
      outline: 'border-2 border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 focus:ring-indigo-500/50 backdrop-blur-sm hover:scale-105 hover:border-indigo-600',
      ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:ring-slate-500/50 hover:scale-105',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {/* Shine effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Content */}
        <span className="relative flex items-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              {leftIcon && <span className="transition-transform group-hover:scale-110">{leftIcon}</span>}
              <span>{children}</span>
              {rightIcon && <span className="transition-transform group-hover:scale-110">{rightIcon}</span>}
            </>
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;