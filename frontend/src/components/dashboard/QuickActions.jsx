import React from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, Users, Building2, GitBranch } from 'lucide-react';
import Card from '@components/common/Card';
import { useAuth } from '@hooks/useAuth';
import { cn } from '@utils/cn';

const QuickActions = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const actions = [
    {
      name: 'Create File',
      description: 'Start a new document workflow',
      icon: FilePlus,
      path: '/files/create',
      color: 'from-primary-500 to-primary-600',
      show: true,
    },
    {
      name: 'Manage Users',
      description: 'Add or edit user accounts',
      icon: Users,
      path: '/users',
      color: 'from-purple-500 to-purple-600',
      show: isAdmin,
    },
    {
      name: 'Departments',
      description: 'Configure departments',
      icon: Building2,
      path: '/departments',
      color: 'from-blue-500 to-blue-600',
      show: isAdmin,
    },
    {
      name: 'Workflows',
      description: 'Set up approval workflows',
      icon: GitBranch,
      path: '/workflows',
      color: 'from-green-500 to-green-600',
      show: isAdmin,
    },
  ].filter(action => action.show);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.name}
              to={action.path}
              className="group relative overflow-hidden p-4 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform',
                  action.color
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {action.name}
                  </h4>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;