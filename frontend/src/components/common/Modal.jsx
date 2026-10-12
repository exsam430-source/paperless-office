import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Sparkles } from 'lucide-react';
import { cn } from '@utils/cn';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full mx-4',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeOnBackdrop ? onClose : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  'w-full transform overflow-hidden rounded-3xl glass-strong text-left align-middle shadow-2xl transition-all',
                  sizes[size]
                )}
              >
                {/* Header with gradient */}
                {(title || showCloseButton) && (
                  <div className="relative px-8 py-6 border-b border-white/20 dark:border-white/10">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <Dialog.Title
                          as="h3"
                          className="text-2xl font-black text-slate-900 dark:text-white"
                        >
                          {title}
                        </Dialog.Title>
                      </div>
                      {showCloseButton && (
                        <button
                          onClick={onClose}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 hover:scale-110"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Body */}
                <div className="px-8 py-6">{children}</div>

                {/* Footer */}
                {footer && (
                  <div className="flex items-center justify-end gap-3 px-8 py-6 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/50 border-t border-white/20 dark:border-white/10">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;