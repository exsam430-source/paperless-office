import React from 'react';
import { CheckCircle, XCircle, AlertCircle, FileText, Clock, Sparkles, Shield, Zap } from 'lucide-react';
import Avatar from '@components/common/Avatar';
import Badge from '@components/common/Badge';
import { formatDateTime } from '@utils/formatters';
import { cn } from '@utils/cn';

const iconByAction = (action) => {
  const icons = {
    CREATED: FileText,
    APPROVED: CheckCircle,
    REJECTED: XCircle,
    REVISION: AlertCircle,
    ESCALATED: Zap,
  };
  return icons[action] || Clock;
};

const configByAction = (action) => {
  const configs = {
    CREATED: {
      gradient: 'from-indigo-500 to-purple-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-500/30',
      text: 'text-indigo-700 dark:text-indigo-300',
    },
    APPROVED: {
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-500/30',
      text: 'text-emerald-700 dark:text-emerald-300',
    },
    REJECTED: {
      gradient: 'from-rose-500 to-pink-600',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      border: 'border-rose-500/30',
      text: 'text-rose-700 dark:text-rose-300',
    },
    REVISION: {
      gradient: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-500/30',
      text: 'text-amber-700 dark:text-amber-300',
    },
    ESCALATED: {
      gradient: 'from-purple-500 to-pink-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-500/30',
      text: 'text-purple-700 dark:text-purple-300',
    },
  };
  return configs[action] || configs.CREATED;
};

export default function FileTimeline({ history = [] }) {
  if (!history.length) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
          <Clock className="w-12 h-12 text-slate-400" />
        </div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          No history available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {history.map((step, idx) => {
        const Icon = iconByAction(step.action);
        const config = configByAction(step.action);
        const isLast = idx === history.length - 1;

        return (
          <div 
            key={idx} 
            className="relative flex gap-5 group animate-slide-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 to-transparent dark:from-slate-700 dark:to-transparent" />
            )}

            {/* Icon with glow */}
            <div className="relative z-10">
              <div className={cn(
                'absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity bg-gradient-to-br',
                config.gradient
              )} />
              <div className={cn(
                'relative w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300',
                config.gradient
              )}>
                <Icon className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  {step.action}
                </h4>
                <Badge variant="secondary" size="sm">
                  Step {step.stepNumber}
                </Badge>
                {step.signatureHash && (
                  <Badge variant="info" size="sm" icon>
                    <Shield className="w-3 h-3" />
                    Digitally Signed
                  </Badge>
                )}
              </div>

              {/* User info */}
              <div className="flex items-center gap-3 mb-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200/60 dark:border-slate-700/60">
                <Avatar 
                  name={step.userId?.name || 'Unknown'} 
                  src={step.userId?.profilePicture}
                  size="md"
                  showStatus={true}
                  isOnline={false}
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {step.userId?.name || 'Unknown User'}
                  </p>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {step.role}
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>

              {/* Remarks */}
              {step.remarks && (
                <div className={cn(
                  'p-5 rounded-2xl border-2 backdrop-blur-sm mb-4',
                  config.bg,
                  config.border
                )}>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    📝 Remarks:
                  </p>
                  <p className={cn('text-sm font-medium', config.text)}>
                    {step.remarks}
                  </p>
                </div>
              )}

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-xs">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-slate-500 dark:text-slate-400">
                  {formatDateTime(step.timestamp)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}