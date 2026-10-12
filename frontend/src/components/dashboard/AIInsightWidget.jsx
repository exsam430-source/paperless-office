import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Sparkles, Zap } from 'lucide-react';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const AIInsightsWidget = ({ insights, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="col-span-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-secondary-200 dark:bg-secondary-700 rounded w-1/4" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-secondary-200 dark:bg-secondary-700 rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const insightCards = [
    {
      icon: Brain,
      label: 'AI Predictions',
      value: insights?.totalPredictions || 0,
      suffix: 'files',
      color: 'purple',
      trend: '+12%',
    },
    {
      icon: Target,
      label: 'Avg Confidence',
      value: insights?.avgConfidence || 0,
      suffix: '%',
      color: 'success',
      trend: '+5%',
    },
    {
      icon: AlertTriangle,
      label: 'Delay Risk',
      value: insights?.delayRiskPercentage || 0,
      suffix: '%',
      color: insights?.delayRiskPercentage > 30 ? 'danger' : 'warning',
      trend: '-3%',
    },
    {
      icon: Zap,
      label: 'High Priority',
      value: insights?.highPriorityCount || 0,
      suffix: 'files',
      color: 'info',
      trend: '+8%',
    },
  ];

  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    success: 'from-success-500 to-success-600',
    danger: 'from-danger-500 to-danger-600',
    warning: 'from-warning-500 to-warning-600',
    info: 'from-blue-500 to-blue-600',
  };

  return (
    <Card className="col-span-full relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                AI Insights
                <Badge variant="primary" size="sm">Live</Badge>
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Real-time machine learning analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-100 dark:bg-success-900/30">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-success-700 dark:text-success-400">
                AI Active
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {insightCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="p-4 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 bg-white dark:bg-secondary-800/50 backdrop-blur-sm">
                  {/* Icon */}
                  <div className={cn(
                    'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform',
                    colorClasses[card.color]
                  )}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Label */}
                  <p className="text-xs font-medium text-secondary-600 dark:text-secondary-400 mb-2">
                    {card.label}
                  </p>

                  {/* Value */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-secondary-900 dark:text-white">
                      {card.value}
                    </span>
                    <span className="text-sm text-secondary-500 dark:text-secondary-400">
                      {card.suffix}
                    </span>
                  </div>

                  {/* Trend */}
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-success-600" />
                    <span className="text-success-600 dark:text-success-400 font-semibold">
                      {card.trend}
                    </span>
                    <span className="text-secondary-500 dark:text-secondary-400">
                      this week
                    </span>
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AI Model Info */}
        <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">85%</p>
              <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                Priority Model Accuracy
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">81%</p>
              <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                Delay Prediction Accuracy
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">94%</p>
              <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                Category Classification
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIInsightsWidget;