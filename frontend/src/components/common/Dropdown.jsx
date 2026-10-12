import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@utils/cn';

const Dropdown = ({ 
  trigger, 
  items = [], 
  align = 'right',
  width = 'w-64',
  className,
}) => {
  const alignmentClasses = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
  };

  return (
    <Menu as="div" className={cn('relative inline-block text-left', className)}>
      <Menu.Button className="inline-flex items-center justify-center">
        {trigger || (
          <button className="px-5 py-3 rounded-2xl glass border border-slate-200/50 dark:border-slate-700/50 text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105 font-semibold">
            Options
            <ChevronDown className="ml-2 w-4 h-4" />
          </button>
        )}
      </Menu.Button>

      <transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className={cn(
          'absolute mt-3 rounded-2xl glass-strong shadow-2xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none overflow-hidden',
          width,
          alignmentClasses[align]
        )}>
          <div className="p-2">
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  item.divider ? (
                    <div className="my-2 border-t border-white/20 dark:border-white/10" />
                  ) : (
                    <button
                      onClick={item.onClick}
                      disabled={item.disabled}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                        active && !item.disabled
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-slate-900 dark:text-white scale-105'
                          : 'text-slate-700 dark:text-slate-300',
                        item.disabled && 'opacity-50 cursor-not-allowed',
                        item.danger && 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                      )}
                    >
                      {item.icon && (
                        <span className={cn(
                          'flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center',
                          item.danger ? 'from-rose-500 to-pink-600' : 'from-indigo-500 to-purple-600'
                        )}>
                          <span className="text-white">{item.icon}</span>
                        </span>
                      )}
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs font-bold">{item.badge}</span>
                      )}
                    </button>
                  )
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </transition>
    </Menu>
  );
};

export default Dropdown;