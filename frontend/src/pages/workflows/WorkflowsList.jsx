import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GitBranch, Plus, Trash2, ToggleLeft, ToggleRight, Eye, 
  Sparkles, FileText, Building2, Clock, CheckCircle, XCircle 
} from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Modal from '@components/common/Modal';
import SearchBar from '@components/common/SearchBar';
import EmptyState from '@components/common/EmptyState';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { useWorkflows } from '@hooks/useWorkflows';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const WorkflowList = () => {
  const { workflows, fetchWorkflows, updateWorkflow, deleteWorkflow, isLoading } = useWorkflows();
  const [q, setQ] = useState('');
  const [view, setView] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchWorkflows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (workflows || []).filter((w) => {
      const dept = w.department?.name?.toLowerCase() || '';
      const ft = w.fileType?.toLowerCase() || '';
      return dept.includes(term) || ft.includes(term);
    });
  }, [workflows, q]);

  const toggleActive = async (w) => {
    await updateWorkflow(w._id, { steps: w.steps, isActive: !w.isActive });
  };

  const doDelete = async () => {
    await deleteWorkflow(confirmDelete._id);
    setConfirmDelete(null);
  };

  const getRoleGradient = (role) => {
    const gradients = {
      CLERK: 'from-blue-500 to-cyan-600',
      REGISTRAR: 'from-indigo-500 to-purple-600',
      DIRECTOR: 'from-amber-500 to-orange-600',
      FINANCE: 'from-emerald-500 to-teal-600',
      DEAN: 'from-pink-500 to-rose-600',
      VC: 'from-purple-500 to-fuchsia-600',
    };
    return gradients[role] || 'from-slate-500 to-slate-600';
  };

  if (isLoading && (!workflows || workflows.length === 0)) {
    return <LoadingSpinner fullScreen text="Loading workflows..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white"
      >
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
              <GitBranch className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-1 flex items-center gap-2">
                Workflow Templates
                <Sparkles className="w-6 h-6 animate-pulse" />
              </h1>
              <p className="text-white/90">
                Loaded strictly by fileType + department.
              </p>
            </div>
          </div>

          <Link to="/workflows/create">
            <Button 
              leftIcon={<Plus className="w-5 h-5" />}
              className="bg-white text-indigo-600 hover:bg-white/90 font-bold shadow-xl"
            >
              New Workflow
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="gradient">
          <div className="p-4">
            <SearchBar 
              value={q} 
              onChange={setQ} 
              onClear={() => setQ('')} 
              placeholder="Search by file type or department..." 
            />
          </div>
        </Card>
      </motion.div>

      {/* Workflows Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={GitBranch}
          title="No workflows found"
          description="Create workflow templates so files can move through approval steps."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((w, index) => (
            <motion.div
              key={w._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity" />
                
                <Card className="relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <GitBranch className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">
                              {w.fileType?.replaceAll('_', ' ')}
                            </h3>
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              {w.department?.name}
                            </p>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge 
                            variant={w.isActive ? 'success' : 'danger'} 
                            size="sm"
                            icon
                          >
                            {w.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {w.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="secondary" size="sm" icon>
                            <FileText className="w-3 h-3" />
                            {w.steps?.length || 0} Steps
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          leftIcon={<Eye className="w-4 h-4" />} 
                          onClick={() => setView(w)}
                        >
                          View
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={w.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          onClick={() => toggleActive(w)}
                          disabled={isLoading}
                          className={cn(
                            w.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                          )}
                        >
                          {w.isActive ? 'Disable' : 'Enable'}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Trash2 className="w-4 h-4" />}
                          onClick={() => setConfirmDelete(w)}
                          disabled={isLoading}
                          className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Steps Preview */}
                    <div className="pt-4 border-t-2 border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Step Sequence
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {w.steps?.map((s) => (
                          <Badge 
                            key={`${w._id}-${s.stepNumber}`} 
                            variant="primary" 
                            size="sm"
                            className={cn('bg-gradient-to-r text-white', getRoleGradient(s.role))}
                          >
                            {s.stepNumber}. {s.role} ({s.slaHours}h)
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View Modal */}
      <Modal
        isOpen={!!view}
        onClose={() => setView(null)}
        title="Workflow Details"
        size="lg"
        footer={<Button variant="primary" onClick={() => setView(null)}>Close</Button>}
      >
        {view && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">File Type</span>
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white">
                  {view.fileType?.replaceAll('_', ' ')}
                </p>
              </div>
              
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Department</span>
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white">
                  {view.department?.name}
                </p>
              </div>
            </div>

            {/* Steps */}
            <div className="pt-4 border-t-2 border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  Approval Steps
                </h4>
              </div>
              <div className="space-y-3">
                {view.steps?.map((s, idx) => (
                  <motion.div
                    key={s.stepNumber}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200/60 dark:border-slate-700/60"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-black shadow-lg',
                          getRoleGradient(s.role)
                        )}>
                          {s.stepNumber}
                        </span>
                        <Badge 
                          variant="primary" 
                          size="md"
                          className={cn('bg-gradient-to-r text-white', getRoleGradient(s.role))}
                        >
                          {s.role}
                        </Badge>
                      </div>
                      <Badge variant="secondary" size="md" icon>
                        <Clock className="w-3 h-3" />
                        {s.slaHours} hours SLA
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Workflow"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={doDelete} isLoading={isLoading} leftIcon={<Trash2 className="w-4 h-4" />}>
              Delete Workflow
            </Button>
          </>
        }
      >
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-2 border-rose-500/30">
          <p className="text-base font-semibold text-rose-900 dark:text-rose-300">
            Are you sure you want to delete the workflow for{' '}
            <span className="font-black">{confirmDelete?.fileType?.replaceAll('_', ' ')}</span>?
          </p>
          <p className="text-sm text-rose-700 dark:text-rose-400 mt-2">
            This may affect files that use this workflow template.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default WorkflowList;