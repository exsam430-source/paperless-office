import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, ArrowRight, Eye, TrendingUp, AlertCircle, Sparkles, Zap } from 'lucide-react';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import Avatar from '@components/common/Avatar';
import { formatRelativeTime } from '@utils/formatters';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const RecentFiles = ({ files = [], isLoading }) => {
  if (isLoading) {
    return (
      <Card variant="gradient">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-32" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-24" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="gradient">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-60 animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Recent Files
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Latest {files.length} submissions
              </p>
            </div>
          </div>
          <Link
            to="/files"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              No recent files
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Files will appear here when created
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.slice(0, 8).map((file, index) => {
              const getPriorityConfig = (score) => {
                if (score >= 67) return {
                  gradient: 'from-rose-500 to-pink-600',
                  bg: 'bg-rose-50 dark:bg-rose-900/20',
                  text: 'text-rose-600 dark:text-rose-400',
                  border: 'border-rose-500/30'
                };
                if (score >= 34) return {
                  gradient: 'from-amber-500 to-orange-600',
                  bg: 'bg-amber-50 dark:bg-amber-900/20',
                  text: 'text-amber-600 dark:text-amber-400',
                  border: 'border-amber-500/30'
                };
                return {
                  gradient: 'from-emerald-500 to-teal-600',
                  bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                  text: 'text-emerald-600 dark:text-emerald-400',
                  border: 'border-emerald-500/30'
                };
              };

              const config = getPriorityConfig(file.priorityScore);

              return (
                <motion.div
                  key={file._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    to={`/files/${file._id}`}
                    className="block group relative"
                  >
                    {/* Glow on hover */}
                    <div className={cn(
                      'absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity bg-gradient-to-r',
                      config.gradient
                    )} />

                    <div className="relative p-4 rounded-2xl border-2 border-transparent hover:border-indigo-500/30 bg-white dark:bg-slate-800 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-900/10 dark:hover:to-purple-900/10 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        {/* Priority Bar */}
                        <div className={cn(
                          'w-1.5 h-full rounded-full flex-shrink-0 bg-gradient-to-b',
                          config.gradient
                        )} />

                        {/* Icon */}
                        <div className="relative">
                          <div className={cn(
                            'absolute inset-0 rounded-xl blur-lg opacity-60 bg-gradient-to-br',
                            config.gradient
                          )} />
                          <div className={cn(
                            'relative w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl bg-gradient-to-br',
                            config.gradient
                          )}>
                            <FileText className="w-7 h-7 text-white" />
                            {file.predictedDelay && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center animate-pulse">
                                <AlertCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-black text-base text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {file.title}
                            </h4>
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
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-semibold text-slate-600 dark:text-slate-400">
                                {formatRelativeTime(file.createdAt)}
                              </span>
                            </div>
                            <span className="text-slate-400">•</span>
                            <span className="font-semibold text-slate-600 dark:text-slate-400 truncate">
                              {file.fileType.replace(/_/g, ' ')}
                            </span>
                            
                            {file.predictedDelay && (
                              <>
                                <span className="text-slate-400">•</span>
                                <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                                  <AlertCircle className="w-4 h-4" />
                                  Delay Risk
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {file.createdBy && (
                                <>
                                  <Avatar 
                                    name={file.createdBy.name} 
                                    size="sm"
                                    showStatus={true}
                                    isOnline={false}
                                  />
                                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                    {file.createdBy.name}
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs',
                                config.bg,
                                config.text
                              )}>
                                <Zap className="w-3.5 h-3.5" />
                                Priority: {file.priorityScore}
                              </div>
                              
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                  <Eye className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentFiles;