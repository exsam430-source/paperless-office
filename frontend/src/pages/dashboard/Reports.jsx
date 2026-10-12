import React, { useMemo, useState } from "react";
import {
  Download, FileSpreadsheet, Calendar, Filter, ShieldCheck, 
  Sparkles, BarChart3, CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import Card from "@components/common/Card";
import Button from "@components/common/Button";
import Badge from "@components/common/Badge";
import { useDashboard } from "@hooks/useDashboard";
import LoadingSpinner from "@components/common/LoadingSpinner";
import ReportFiltersModal from "@components/dashboard/ReportFiltersModal";
import { formatPercentage } from "@utils/formatters";
import { exportStatsToCsv, exportReportToPdf } from "@utils/exports";
import { exportReportToPdfManual } from "@utils/pdfExport";
import { useNotifications } from "@hooks/useNotifications";
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const Reports = () => {
  const { stats, aiInsights, isLoading, lastUpdated } = useDashboard();
  const { showToast } = useNotifications();
  const [range, setRange] = useState("30");
  const [filterModal, setFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const computed = useMemo(() => {
    const total = stats?.totalFiles || 0;
    const approved = stats?.approvedFiles || 0;
    const rejected = stats?.rejectedFiles || 0;
    const pending = stats?.pendingFiles || 0;

    const approvalRate = total ? (approved / total) * 100 : 0;
    const rejectionRate = total ? (rejected / total) * 100 : 0;

    return {
      total,
      approved,
      rejected,
      pending,
      approvalRate,
      rejectionRate,
      delayRate: stats?.delayRate ?? 0,
    };
  }, [stats]);

  const handleExportCsv = () => {
    try {
      exportStatsToCsv(stats, computed);
      showToast("success", "CSV exported successfully");
    } catch (error) {
      showToast("error", "Failed to export CSV");
      console.error("CSV Export Error:", error);
    }
  };

  const handleExportPdf = async () => {
    try {
      console.log("Starting PDF export...");

      try {
        await exportReportToPdf(stats, computed, aiInsights, range);
        showToast("success", "PDF exported successfully");
      } catch (autoTableError) {
        console.warn("AutoTable failed, using manual PDF:", autoTableError);
        await exportReportToPdfManual(stats, computed, aiInsights, range);
        showToast("success", "PDF exported successfully");
      }
    } catch (error) {
      console.error("PDF Export Error:", error);
      showToast("error", `Failed to export PDF: ${error.message}`);
    }
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    showToast("info", "Filters applied");
    console.log("Applied filters:", filters);
  };

  const hasActiveFilters = Object.values(activeFilters).some((val) =>
    Array.isArray(val) ? val.length > 0 : Boolean(val),
  );

  if (isLoading) return <LoadingSpinner fullScreen text="Loading reports..." />;

  const summaryCards = [
    {
      title: 'Total Files',
      value: computed.total,
      icon: BarChart3,
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      title: 'Approval Rate',
      value: formatPercentage(computed.approvalRate, 1),
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Rejection Rate',
      value: formatPercentage(computed.rejectionRate, 1),
      icon: XCircle,
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      title: 'Predicted Delay Rate',
      value: formatPercentage(computed.delayRate, 1),
      icon: AlertCircle,
      gradient: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black">
                Reports
              </h1>
            </div>
            <p className="text-white/90 text-base">
              Export workflow metrics and AI insights for your institution.
            </p>
            {lastUpdated && (
              <p className="text-xs text-white/70 mt-2">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-white/30 bg-white/20 backdrop-blur-sm">
              <Calendar className="w-5 h-5" />
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="bg-transparent text-sm font-bold outline-none text-white"
              >
                <option value="7" className="text-slate-900">Last 7 days</option>
                <option value="30" className="text-slate-900">Last 30 days</option>
                <option value="90" className="text-slate-900">Last 90 days</option>
                <option value="365" className="text-slate-900">Last 12 months</option>
              </select>
            </div>

            <Button
              leftIcon={<Filter className="w-4 h-4" />}
              onClick={() => setFilterModal(true)}
              className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30"
            >
              Filters
              {hasActiveFilters && (
                <Badge variant="danger" size="sm" className="ml-2">
                  Active
                </Badge>
              )}
            </Button>

            <Button
              leftIcon={<FileSpreadsheet className="w-4 h-4" />}
              onClick={handleExportCsv}
              className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30"
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative group">
                <div className={cn(
                  'absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-opacity bg-gradient-to-br',
                  card.gradient
                )} />
                
                <Card className="relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                        {card.title}
                      </p>
                      <div className={cn(
                        'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all',
                        card.gradient
                      )}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">
                      {card.value}
                    </p>
                  </div>
                </Card>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Summary */}
      <Card variant="gradient">
        <div className="p-8">
          <div className="absolute -right-24 -top-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl blur-xl opacity-60 animate-pulse" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-xl">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                  AI Insights Snapshot
                  <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                </h3>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Highlights based on AI predictions stored on files.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="primary" size="md" icon>
                AI Predictions: {aiInsights?.totalPredictions || 0}
              </Badge>
              <Badge variant="info" size="md" icon>
                Avg Confidence: {aiInsights?.avgConfidence || 0}%
              </Badge>
              <Badge variant="warning" size="md" icon>
                Delay Risk: {aiInsights?.delayRiskPercentage || 0}%
              </Badge>
              <Badge variant="secondary" size="md" icon>
                High Priority: {aiInsights?.highPriorityCount || 0}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Success Notice */}
      <Card className="border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
        <div className="p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-black text-emerald-900 dark:text-emerald-300 mb-1">
              Export Functionality Active
            </h4>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Click the buttons above to download CSV or PDF reports with comprehensive analytics.
            </p>
          </div>
        </div>
      </Card>

      <ReportFiltersModal
        open={filterModal}
        onClose={() => setFilterModal(false)}
        onApply={handleApplyFilters}
        currentFilters={activeFilters}
      />
    </div>
  );
};

export default Reports;