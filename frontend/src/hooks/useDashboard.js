import { useEffect, useState } from 'react';
import { dashboardAPI } from '@api/dashboard.api';
import { filesAPI } from '@api/files.api';
import { auditAPI } from '@api/audit.api';
import { useAuthStore } from '@store/authStore';
import { useNotifications } from '@hooks/useNotifications';

const mapAuditToActivity = (log) => {
  const action = log?.action || '';
  const map = {
    FILE_CREATED: { type: 'CREATED', actionText: 'created' },
    FILE_APPROVE: { type: 'APPROVED', actionText: 'approved' },
    FILE_REJECT: { type: 'REJECTED', actionText: 'rejected' },
    FILE_REVISION: { type: 'REVISION', actionText: 'requested revision for' },
    FILE_ESCALATED: { type: 'ESCALATED', actionText: 'escalated' }
  };
  const m = map[action] || { type: 'INFO', actionText: action.toLowerCase().replaceAll('_', ' ') };

  return {
    type: m.type,
    action: m.actionText,
    timestamp: log.timestamp,
    user: log.userId ? { name: log.userId.name, role: log.userId.role, email: log.userId.email } : null,
    file: log.fileId ? { fileId: log.fileId.fileId, title: log.fileId.title } : null
  };
};

export const useDashboard = () => {
  const { showToast } = useNotifications();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';

  const [stats, setStats] = useState(null);
  const [filesByStatus, setFilesByStatus] = useState([]);
  const [approvalTime, setApprovalTime] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [bottlenecks, setBottlenecks] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [activity, setActivity] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const computeAiInsights = (statsData, recent) => {
    const sample = Array.isArray(recent) ? recent : [];
    const delayed = sample.filter((f) => !!f.predictedDelay).length;
    const high = sample.filter((f) => (f.priorityScore ?? 0) >= 67).length;
    const avgConf = sample.reduce((acc, f) => acc + (Number(f.aiConfidence) || 0), 0) / (sample.length || 1);

    return {
      totalPredictions: statsData?.totalFiles || 0,
      delayRiskPercentage: sample.length ? ((delayed / sample.length) * 100).toFixed(1) : '0.0',
      highPriorityCount: high,
      avgConfidence: (avgConf * 100).toFixed(1)
    };
  };

  const fetchDashboardData = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);

    try {
      const [statsRes, statusRes, filesRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getFilesByStatus(),
        filesAPI.getAllFiles()
      ]);

      const allFiles = filesRes.data || [];
      const recent = allFiles.slice(0, 12);

      setStats(statsRes.data);
      setFilesByStatus(statusRes.data);
      setRecentFiles(recent);
      setAiInsights(computeAiInsights(statsRes.data, recent));

      if (isAdmin) {
        const [approvalRes, perfRes, bottleRes, auditRes] = await Promise.allSettled([
          dashboardAPI.getApprovalTime(),
          dashboardAPI.getOfficerPerformance(),
          dashboardAPI.getBottlenecks(),
          auditAPI.getLogs({})
        ]);

        if (approvalRes.status === 'fulfilled') setApprovalTime(approvalRes.value.data || []);
        if (perfRes.status === 'fulfilled') setPerformance(perfRes.value.data || []);
        if (bottleRes.status === 'fulfilled') setBottlenecks(bottleRes.value.data || []);

        if (auditRes.status === 'fulfilled') {
          const logs = auditRes.value.data || [];
          setActivity(
            logs
              .filter((l) => (l.action || '').startsWith('FILE_'))
              .slice(0, 12)
              .map(mapAuditToActivity)
          );
        }
      } else {
        setApprovalTime([]);
        setPerformance([]);
        setBottlenecks([]);
        setActivity([]);
      }

      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
      showToast('error', 'Failed to load dashboard data');
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  const refreshDashboard = async () => fetchDashboardData(false);

  useEffect(() => {
    fetchDashboardData(true);
    const t = setInterval(() => refreshDashboard(), 30000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  return {
    isAdmin,
    stats,
    filesByStatus,
    approvalTime,
    performance,
    bottlenecks,
    recentFiles,
    activity,
    aiInsights,
    isLoading,
    lastUpdated,
    refreshDashboard
  };
};