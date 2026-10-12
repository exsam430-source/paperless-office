import React, { useState } from 'react';
import { 
  Files, Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp, 
  RefreshCw, Download, Calendar, Users, Sparkles, Zap, Target, Heart
} from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { useDashboard } from '@hooks/useDashboard';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentFiles from '../../components/dashboard/RecentFiles';
import QuickActions from '../../components/dashboard/QuickActions';
import FileStatusChart from '../../components/dashboard/Charts/FileStatusChart';
import ApprovalTimeChart from '../../components/dashboard/Charts/ApprovalTimeChart';
import PerformanceChart from '../../components/dashboard/Charts/PerformanceChart';
import BottleneckChart from '../../components/dashboard/Charts/BottleneckChart';
import AIInsightsWidget from '../../components/dashboard/AIInsightWidget';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatRelativeTime } from '@utils/formatters';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    stats,
    filesByStatus,
    approvalTime,
    performance,
    bottlenecks,
    recentFiles,
    aiInsights,
    isLoading,
    lastUpdated,
    refreshDashboard,
  } = useDashboard();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshDashboard();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      {/* Welcome Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-10 text-white"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Floating Sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute text-white/20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 16 + 8}px`,
                height: `${Math.random() * 16 + 8}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left Content */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-black mb-1">
                      Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-white/90 text-lg font-semibold">
                      Here's what's happening with your files today
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                    <Users className="w-5 h-5" />
                    <span className="text-sm font-bold">{user?.role}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-bold">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>

                  {lastUpdated && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-sm font-bold">
                        Updated {formatRelativeTime(lastUpdated)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Button
                leftIcon={<RefreshCw className={cn('w-5 h-5', isRefreshing && 'animate-spin')} />}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 font-bold"
              >
                Refresh
              </Button>
              <Button
                leftIcon={<Download className="w-5 h-5" />}
                className="bg-white text-indigo-600 hover:bg-white/90 font-bold shadow-xl"
              >
                Export Report
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* AI Insights Widget */}
      <AIInsightsWidget insights={aiInsights} isLoading={isLoading} />

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Files"
          value={stats?.totalFiles || 0}
          change={12}
          trend="up"
          icon={Files}
          color="primary"
          link="/files"
          subtitle="All submissions"
          loading={isLoading}
          index={0}
        />
        <StatsCard
          title="Pending"
          value={stats?.pendingFiles || 0}
          change={5}
          trend="down"
          icon={Clock}
          color="warning"
          link="/files?status=PENDING"
          subtitle="Awaiting action"
          loading={isLoading}
          index={1}
        />
        <StatsCard
          title="Approved"
          value={stats?.approvedFiles || 0}
          change={18}
          trend="up"
          icon={CheckCircle}
          color="success"
          link="/files?status=APPROVED"
          subtitle="Completed"
          loading={isLoading}
          index={2}
        />
        <StatsCard
          title="Rejected"
          value={stats?.rejectedFiles || 0}
          change={3}
          trend="down"
          icon={XCircle}
          color="danger"
          link="/files?status=REJECTED"
          subtitle="Declined"
          loading={isLoading}
          index={3}
        />
      </div>

      {/* Secondary Stats - Admin Only */}
      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatsCard
            title="Escalated Files"
            value={stats?.escalatedFiles || 0}
            change={15}
            trend="up"
            icon={AlertTriangle}
            color="danger"
            link="/files?status=ESCALATED"
            subtitle="SLA breached"
            loading={isLoading}
            index={4}
          />
          <StatsCard
            title="Delay Rate"
            value={`${stats?.delayRate || 0}%`}
            change={2}
            trend="down"
            icon={TrendingUp}
            color="warning"
            subtitle="Predicted delays"
            loading={isLoading}
            index={5}
          />
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FileStatusChart data={filesByStatus} />
        </div>
        <div className="lg:col-span-2">
          <RecentFiles files={recentFiles} isLoading={isLoading} />
        </div>
      </div>

      {/* Admin Advanced Analytics */}
      {isAdmin && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ApprovalTimeChart data={approvalTime} />
            <PerformanceChart data={performance} />
          </div>

          <BottleneckChart data={bottlenecks} />
        </>
      )}

      {/* Quick Actions */}
      <QuickActions />

      {/* Pending Actions Alert */}
      {stats?.pendingFiles > 0 && user?.role !== 'ADMIN' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-500/30 p-8"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 blur-2xl" />
          
          <div className="relative flex items-start gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl blur-xl opacity-60" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 animate-bounce shadow-xl">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-black text-amber-900 dark:text-amber-300 mb-2">
                You have {stats.pendingFiles} file{stats.pendingFiles !== 1 ? 's' : ''} waiting for your action
              </h3>
              <p className="text-base text-amber-700 dark:text-amber-400 mb-6 font-semibold">
                Review and process pending files to keep workflows moving smoothly
              </p>
              <Button
                onClick={() => window.location.href = '/pending'}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40"
                leftIcon={<Zap className="w-5 h-5" />}
              >
                View Pending Files
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;