import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, BarChart3, PieChart, Activity, Download, Calendar, 
  Filter, FileSpreadsheet, ChevronRight, Sparkles, Target, Zap, Brain
} from 'lucide-react';
import { useDashboard } from '@hooks/useDashboard';
import { useNotifications } from '@hooks/useNotifications';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Modal from '@components/common/Modal';
import FileStatusChart from '@components/dashboard/Charts/FileStatusChart';
import ApprovalTimeChart from '@components/dashboard/Charts/ApprovalTimeChart';
import PerformanceChart from '@components/dashboard/Charts/PerformanceChart';
import BottleneckChart from '@components/dashboard/Charts/BottleneckChart';
import LoadingSpinner from '@components/common/LoadingSpinner';
import AnalyticsFiltersModal from '@components/dashboard/AnalyticsFiltersModal';
import { motion } from 'framer-motion';
import { exportToCSV } from '@utils/exports';
import { exportAnalyticsToPdf } from '@utils/analyticsPdfExport';
import { cn } from '@utils/cn';

const Analytics = () => {
  const navigate = useNavigate();
  const { showToast } = useNotifications();
  
  const {
    stats,
    filesByStatus,
    approvalTime,
    performance,
    bottlenecks,
    aiInsights,
    isLoading,
  } = useDashboard();

  const [dateRange, setDateRange] = useState('30days');
  const [filterModal, setFilterModal] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  const totalProcessed = (stats?.approvedFiles || 0) + (stats?.rejectedFiles || 0);
  const approvalRate = stats?.totalFiles > 0 
    ? ((stats.approvedFiles / stats.totalFiles) * 100).toFixed(1) 
    : 0;

  const kpiCards = [
    {
      title: 'Total Processed',
      value: totalProcessed,
      icon: BarChart3,
      color: 'primary',
      gradient: 'from-indigo-500 to-purple-600',
      change: '+12%',
      action: () => navigate('/my-files?status=APPROVED,REJECTED'),
      description: 'Total files approved or rejected',
    },
    {
      title: 'Approval Rate',
      value: `${approvalRate}%`,
      icon: TrendingUp,
      color: 'success',
      gradient: 'from-emerald-500 to-teal-600',
      change: '+5%',
      action: () => navigate('/my-files?status=APPROVED'),
      description: 'Percentage of files approved',
    },
    {
      title: 'Avg Processing Time',
      value: '2.4 days',
      icon: Activity,
      color: 'info',
      gradient: 'from-blue-500 to-cyan-600',
      change: '-8%',
      action: () => setSelectedKpi('processing-time'),
      description: 'Average time to process files',
    },
    {
      title: 'SLA Compliance',
      value: '87%',
      icon: Target,
      color: 'warning',
      gradient: 'from-amber-500 to-orange-600',
      change: '+3%',
      action: () => setSelectedKpi('sla-compliance'),
      description: 'Files processed within SLA',
    },
  ];

  const handleExportCsv = () => {
    try {
      const analyticsData = [
        { Metric: 'Total Files', Value: stats?.totalFiles || 0 },
        { Metric: 'Approved Files', Value: stats?.approvedFiles || 0 },
        { Metric: 'Rejected Files', Value: stats?.rejectedFiles || 0 },
        { Metric: 'Pending Files', Value: stats?.pendingFiles || 0 },
        { Metric: 'Total Processed', Value: totalProcessed },
        { Metric: 'Approval Rate', Value: `${approvalRate}%` },
        { Metric: 'Average Processing Time', Value: '2.4 days' },
        { Metric: 'SLA Compliance', Value: '87%' },
        { Metric: 'AI Predictions', Value: aiInsights?.totalPredictions || 0 },
        { Metric: 'AI Confidence', Value: `${aiInsights?.avgConfidence || 0}%` },
        { Metric: 'Delay Risk', Value: `${aiInsights?.delayRiskPercentage || 0}%` },
      ];

      const filename = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(analyticsData, filename);
      showToast('success', 'Analytics exported to CSV successfully');
    } catch (error) {
      console.error('CSV Export Error:', error);
      showToast('error', 'Failed to export CSV');
    }
  };

  const handleExportPdf = async () => {
    try {
      console.log('Exporting PDF with data:', { stats, aiInsights, dateRange, kpiCards });
      
      await exportAnalyticsToPdf(stats, aiInsights, dateRange, kpiCards);
      showToast('success', 'Analytics exported to PDF successfully');
    } catch (error) {
      console.error('PDF Export Error:', error);
      showToast('error', `Failed to export PDF: ${error.message}`);
    }
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    console.log('Applied filters:', filters);
    showToast('success', 'Filters applied successfully');
  };

  const hasActiveFilters = Object.values(activeFilters).some(val => 
    Array.isArray(val) ? val.length > 0 : Boolean(val)
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading analytics..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black">
                Analytics & Reports
              </h1>
            </div>
            <p className="text-white/90 text-base">
              Comprehensive insights into file processing performance
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-white/30 bg-white/20 backdrop-blur-sm text-white font-bold focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
            >
              <option value="7days" className="text-slate-900">Last 7 Days</option>
              <option value="30days" className="text-slate-900">Last 30 Days</option>
              <option value="90days" className="text-slate-900">Last 90 Days</option>
              <option value="year" className="text-slate-900">This Year</option>
            </select>
            
            <Button 
              variant="outline" 
              leftIcon={<Filter className="w-4 h-4" />}
              onClick={() => setFilterModal(true)}
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              Filter
              {hasActiveFilters && (
                <Badge variant="danger" size="sm" className="ml-2">
                  {Object.values(activeFilters).reduce((count, val) => 
                    count + (Array.isArray(val) ? val.length : (val ? 1 : 0)), 0
                  )}
                </Badge>
              )}
            </Button>

            <Button 
              variant="outline" 
              leftIcon={<FileSpreadsheet className="w-4 h-4" />}
              onClick={handleExportCsv}
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              CSV
            </Button>
            
            <Button 
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExportPdf}
              className="bg-white text-indigo-600 hover:bg-white/90 font-bold shadow-xl"
            >
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card variant="gradient">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Active Filters:
              </span>
              {activeFilters.status?.map(s => (
                <Badge key={s} variant="primary" size="sm" icon>
                  {s}
                </Badge>
              ))}
              {activeFilters.priority?.map(p => (
                <Badge key={p} variant="warning" size="sm" icon>
                  {p}
                </Badge>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveFilters({})}
            >
              Clear All
            </Button>
          </div>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={kpi.action}
              className="cursor-pointer group"
            >
              <div className="relative">
                <div className={cn(
                  'absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-opacity bg-gradient-to-br',
                  kpi.gradient
                )} />
                
                <Card className="relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">
                          {kpi.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          {kpi.description}
                        </p>
                      </div>
                      <div className={cn(
                        'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all',
                        kpi.gradient
                      )}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-3">
                      {kpi.value}
                    </h3>

                    <div className="flex items-center justify-between">
                      <Badge variant="success" size="sm" icon>
                        {kpi.change}
                      </Badge>
                      <ChevronRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FileStatusChart data={filesByStatus} />
        <ApprovalTimeChart data={approvalTime} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart data={performance} />
        <Card variant="gradient">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Department Performance
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Processing volume by department
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {approvalTime.slice(0, 5).map((dept, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {dept.departmentInfo?.name || 'Unknown'}
                    </p>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                      {dept.count} files
                    </span>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 rounded-full"
                      style={{ width: `${Math.min(100, (dept.count / 20) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottlenecks */}
      <BottleneckChart data={bottlenecks} />

      {/* AI Insights Summary */}
      <Card variant="gradient">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                AI Performance Summary
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Machine learning insights and predictions
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
              <div className="relative text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-500/30 transition-all group-hover:scale-105">
                <p className="text-5xl font-black text-purple-600 dark:text-purple-400 mb-2">
                  {aiInsights?.totalPredictions || 0}
                </p>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  Total AI Predictions
                </p>
              </div>
            </div>
            
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
              <div className="relative text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-500/30 transition-all group-hover:scale-105">
                <p className="text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-2">
                  {aiInsights?.avgConfidence || 0}%
                </p>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  Average Confidence
                </p>
              </div>
            </div>
            
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
              <div className="relative text-center p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-2 border-rose-500/30 transition-all group-hover:scale-105">
                <p className="text-5xl font-black text-rose-600 dark:text-rose-400 mb-2">
                  {aiInsights?.delayRiskPercentage || 0}%
                </p>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  Delay Risk Rate
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* KPI Details Modal */}
      <Modal
        isOpen={!!selectedKpi}
        onClose={() => setSelectedKpi(null)}
        title={selectedKpi === 'processing-time' ? 'Processing Time Details' : 'SLA Compliance Details'}
        size="lg"
      >
        <div className="space-y-4">
          {selectedKpi === 'processing-time' && (
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">
                Average Processing Time by Department
              </h4>
              <div className="space-y-3">
                {approvalTime.slice(0, 5).map((dept, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {dept.departmentInfo?.name || 'Unknown'}
                    </span>
                    <Badge variant="info" size="md">
                      {(dept.avgTime / 24).toFixed(1)} days
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedKpi === 'sla-compliance' && (
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">
                SLA Compliance Overview
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-500/30 text-center">
                  <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mb-2">87%</p>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Within SLA</p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-2 border-rose-500/30 text-center">
                  <p className="text-4xl font-black text-rose-600 dark:text-rose-400 mb-2">13%</p>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Breached</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <AnalyticsFiltersModal
        open={filterModal}
        onClose={() => setFilterModal(false)}
        onApply={handleApplyFilters}
        currentFilters={activeFilters}
      />
    </div>
  );
};

export default Analytics;