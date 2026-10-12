import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, User, TrendingUp, AlertCircle, Eye, Sparkles, Zap } from 'lucide-react';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import Avatar from '@components/common/Avatar';
import { formatRelativeTime, formatPriorityLabel } from '@utils/formatters';
import { cn } from '@utils/cn';

const FileCard = ({ file }) => {
  const getPriorityConfig = (score) => {
    if (score >= 67) return {
      gradient: 'from-rose-500 to-pink-600',
      glow: 'shadow-rose-500/30',
      border: 'border-rose-500/30',
      text: 'text-rose-600 dark:text-rose-400'
    };
    if (score >= 34) return {
      gradient: 'from-amber-500 to-orange-600',
      glow: 'shadow-amber-500/30',
      border: 'border-amber-500/30',
      text: 'text-amber-600 dark:text-amber-400'
    };
    return {
      gradient: 'from-emerald-500 to-teal-600',
      glow: 'shadow-emerald-500/30',
      border: 'border-emerald-500/30',
      text: 'text-emerald-600 dark:text-emerald-400'
    };
  };

  const priorityConfig = getPriorityConfig(file.priorityScore);

  return (
    <Link to={`/files/${file._id}`} className="block group">
      <div className="relative">
        {/* Glow effect on hover */}
        <div className={cn(
          'absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500',
          'bg-gradient-to-br',
          priorityConfig.gradient
        )} />

        <Card hover className="relative h-full border-2 border-transparent group-hover:border-indigo-500/30 overflow-hidden">
          {/* Priority Bar - Animated */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r overflow-hidden">
            <div 
              className={cn('h-full bg-gradient-to-r transition-all duration-500', priorityConfig.gradient)}
              style={{ width: `${file.priorityScore}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-white/30 to-transparent animate-pulse" />
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start gap-4">
              {/* Icon with priority color */}
              <div className="relative">
                <div className={cn(
                  'absolute inset-0 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity bg-gradient-to-br',
                  priorityConfig.gradient
                )} />
                <div className={cn(
                  'relative w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300',
                  priorityConfig.gradient
                )}>
                  <FileText className="w-8 h-8 text-white" />
                  {file.predictedDelay && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-lg text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                  {file.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" size="sm">
                    {file.fileId}
                  </Badge>
                  <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Description */}
            {file.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {file.description}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={
                  file.status === 'APPROVED' ? 'success' :
                  file.status === 'REJECTED' ? 'danger' :
                  file.status === 'ESCALATED' ? 'danger' :
                  file.status === 'REVISION' ? 'info' :
                  'warning'
                }
                size="sm"
                icon
              >
                {file.status}
              </Badge>

              <Badge 
                variant={
                  file.priorityScore >= 67 ? 'danger' :
                  file.priorityScore >= 34 ? 'warning' : 'success'
                }
                size="sm"
              >
                <Zap className="w-3 h-3" />
                {formatPriorityLabel(file.priorityScore)}
              </Badge>

              {file.predictedDelay && (
                <Badge variant="danger" size="sm" className="animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  Delay Risk
                </Badge>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
              {/* Time */}
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Created</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {formatRelativeTime(file.createdAt)}
                  </p>
                </div>
              </div>

              {/* Priority Score */}
              <div className="flex items-center gap-2 text-sm">
                <div className={cn(
                  'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center',
                  priorityConfig.gradient
                )}>
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Priority</p>
                  <p className={cn('text-xs font-bold truncate', priorityConfig.text)}>
                    {file.priorityScore}/100
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
              {/* Creator */}
              {file.createdBy && (
                <div className="flex items-center gap-2">
                  <Avatar 
                    name={file.createdBy.name} 
                    size="sm"
                    src={file.createdBy.profilePicture}
                    showStatus={true}
                    isOnline={false}
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {file.createdBy.name}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      Creator
                    </p>
                  </div>
                </div>
              )}

              {/* View Button */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Eye className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Hover overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Card>
      </div>
    </Link>
  );
};

export default FileCard;