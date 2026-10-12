import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import Button from '@components/common/Button';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-danger-50 via-white to-danger-100 dark:from-secondary-900 dark:via-secondary-900 dark:to-danger-900/20">
      <div className="text-center">
        <div className="w-24 h-24 bg-danger-100 dark:bg-danger-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-12 h-12 text-danger-600 dark:text-danger-400" />
        </div>
        
        <h1 className="text-5xl font-bold text-secondary-900 dark:text-white mb-4">
          Access Denied
        </h1>
        <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8 max-w-md mx-auto">
          You don't have permission to access this page.
        </p>
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-8">
          Contact your administrator if you believe this is an error.
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

export default Unauthorized;