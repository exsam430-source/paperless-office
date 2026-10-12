import React from 'react';
import { FileX, Inbox, Sparkles } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon = Inbox,
  title = 'No data found',
  description = 'Get started by creating a new item',
  action,
  actionLabel = 'Create New',
}) => {
  return (
    <div className="text-center py-20 px-4">
      {/* Animated icon container */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse" />
          
          {/* Icon */}
          <div className="relative w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-full flex items-center justify-center shadow-2xl ring-8 ring-white/50 dark:ring-slate-800/50">
            <Icon className="w-16 h-16 text-slate-400 dark:text-slate-500" />
            <Sparkles className="absolute top-4 right-4 w-6 h-6 text-indigo-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Text */}
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-base text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
        {description}
      </p>

      {/* Action button */}
      {action && (
        <Button onClick={action} size="lg">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;