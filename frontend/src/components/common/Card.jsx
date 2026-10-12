import React from 'react';
import { cn } from '@utils/cn';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  variant = 'default',
  ...props 
}) => {
  const variants = {
    default: 'card-3d',
    glass: 'glass',
    gradient: 'card-gradient',
    elevated: 'bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-800/60',
  };

  if (variant === 'gradient') {
    return (
      <div className={cn('card-gradient', hover && 'cursor-pointer', className)} {...props}>
        <div className="card-gradient-inner p-6">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-6 transition-all duration-300',
        variants[variant],
        hover && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;