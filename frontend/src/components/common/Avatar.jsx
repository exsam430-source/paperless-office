import React, { useState } from 'react';
import { User, Sparkles } from 'lucide-react';
import { cn } from '@utils/cn';

const Avatar = ({ 
  src, 
  name = '', 
  size = 'md', 
  className = '',
  showStatus = false,
  isOnline = false 
}) => {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
    '2xl': 'w-32 h-32 text-5xl',
  };

  const statusSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
    '2xl': 'w-6 h-6',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getServerUrl = () => {
    return import.meta.env.VITE_SERVER_URL || 
           import.meta.env.VITE_API_URL?.replace('/api', '') || 
           'http://localhost:5000';
  };

  const imageUrl = src ? `${getServerUrl()}/uploads/${src}` : null;

  return (
    <div className={cn('relative inline-block group', className)}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
      
      {/* Avatar */}
      <div className={cn(
        'relative rounded-full overflow-hidden flex items-center justify-center font-bold',
        'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white',
        'ring-4 ring-white dark:ring-slate-900 shadow-xl',
        'transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
        sizes[size]
      )}>
        {imageUrl && !imgError ? (
          <>
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              onError={() => {
                console.error('Failed to load image:', imageUrl);
                setImgError(true);
              }}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="relative">
            <span className="relative z-10">{getInitials(name)}</span>
            {/* Sparkle effect for initials */}
            <Sparkles className="absolute top-0 right-0 w-3 h-3 text-white/60 animate-pulse" />
          </div>
        )}
      </div>

      {/* Status indicator */}
      {showStatus && (
        <div className="absolute bottom-0 right-0">
          <span className={cn(
            'block rounded-full ring-4 ring-white dark:ring-slate-900',
            statusSizes[size],
            isOnline 
              ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/50' 
              : 'bg-gradient-to-br from-slate-400 to-slate-500'
          )}>
            {isOnline && (
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default Avatar;