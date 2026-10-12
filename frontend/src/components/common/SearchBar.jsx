import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { cn } from '@utils/cn';

const SearchBar = ({ 
  value, 
  onChange, 
  onClear,
  placeholder = 'Search anything...',
  className,
}) => {
  return (
    <div className={cn('relative group', className)}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-14 pr-14 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 focus:scale-[1.02] font-semibold shadow-lg"
        />
        
        {value && onClear && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-rose-500 transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-colors">
              <X className="h-4 w-4" />
            </div>
          </button>
        )}
        
        {!value && (
          <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
            <Sparkles className="h-5 w-5 text-indigo-400 opacity-50 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;