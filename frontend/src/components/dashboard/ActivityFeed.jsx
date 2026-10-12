import React from 'react';
import { FileText, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import Card from '@components/common/Card';
import Avatar from '@components/common/Avatar';
import Badge from '@components/common/Badge';
import { formatRelativeTime } from '@utils/formatters';
import { cn } from '@utils/cn';

const ActivityFeed = ({ activities = [], isLoading }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'CREATED':
        return <FileText className="w-5 h-5 text-primary-600" />;
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-danger-600" />;
      case 'REVISION':
        return <AlertCircle className="w-5 h-5 text-warning-600" />;
      default:
        return <Clock className="w-5 h-5 text-secondary-600" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'CREATED':
        return 'bg-primary-100 dark:bg-primary-900/30';
      case 'APPROVED':
        return 'bg-success-100 dark:bg-success-900/30';
      case 'REJECTED':
        return 'bg-danger-100 dark:bg-danger-900/30';
      case 'REVISION':
        return 'bg-warning-100 dark:bg-warning-900/30';
      default:
        return 'bg-secondary-100 dark:bg-secondary-700';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex items-start gap-3">
              <div className="w-10 h-10 bg-secondary-200 dark:bg-secondary-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4" />
                <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.slice(0, 10).map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
              getActivityColor(activity.type)
            )}>
              {getActivityIcon(activity.type)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-secondary-900 dark:text-white">
                <span className="font-semibold">{activity.user?.name}</span>
                {' '}
                <span className="text-secondary-600 dark:text-secondary-400">
                  {activity.action}
                </span>
                {' '}
                <span className="font-medium">{activity.file?.title}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-secondary-500 dark:text-secondary-400">
                  {formatRelativeTime(activity.timestamp)}
                </span>
                {activity.file?.fileId && (
                  <>
                    <span className="text-xs text-secondary-400">•</span>
                    <Badge variant="secondary" size="sm">
                      {activity.file.fileId}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mx-auto mb-3" />
          <p className="text-secondary-500 dark:text-secondary-400">
            No recent activity
          </p>
        </div>
      )}
    </Card>
  );
};

export default ActivityFeed;