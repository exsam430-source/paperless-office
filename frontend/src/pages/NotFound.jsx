import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '@components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-secondary-900 dark:via-secondary-900 dark:to-primary-900/20">
      <div className="text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
          <Link to="/dashboard">
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;