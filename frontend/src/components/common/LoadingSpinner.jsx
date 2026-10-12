import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@utils/cn';

const LoadingSpinner = ({ 
  size = 'md', 
  className,
  fullScreen = false,
  text = 'Loading...',
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse" />
        
        {/* Spinning gradient ring */}
        <div className={cn('relative', sizes[size])}>
          <Loader2 className="w-full h-full text-indigo-600 dark:text-indigo-400 animate-spin" />
          <Sparkles className="absolute top-0 right-0 w-1/3 h-1/3 text-purple-500 animate-pulse" />
        </div>
      </div>
      
      {text && (
        <div className="text-center">
          <p className="text-base font-bold text-slate-900 dark:text-white mb-1">
            {text}
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;