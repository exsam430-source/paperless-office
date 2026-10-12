import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Trash2, GitBranch, Sparkles, Save, 
  FileText, Building2, Clock, Shield 
} from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Input from '@components/common/Input';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { useWorkflows } from '@hooks/useWorkflows';
import { departmentsAPI } from '@api/departments.api';
import { FILE_TYPES } from '@config/app.config';
import { useNotifications } from '@hooks/useNotifications';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const ROLE_OPTIONS = ['CLERK', 'REGISTRAR', 'DIRECTOR', 'FINANCE', 'DEAN', 'VC'];

const CreateWorkflow = () => {
  const navigate = useNavigate();
  const { showToast } = useNotifications();
  const { createWorkflow, isLoading } = useWorkflows();

  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState('');
  const [fileType, setFileType] = useState('LEAVE_APPLICATION');

  const [steps, setSteps] = useState([
    { stepNumber: 1, role: 'CLERK', slaHours: 24 }
  ]);

  useEffect(() => {
    (async () => {
      const res = await departmentsAPI.getAllDepartments();
      setDepartments(res.data || []);
      if (res.data?.[0]?._id) setDepartment(res.data[0]._id);
    })();
  }, []);

  const addStep = () => {
    const next = steps.length + 1;
    setSteps([...steps, { stepNumber: next, role: 'REGISTRAR', slaHours: 24 }]);
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index).map((s, idx) => ({
      ...s,
      stepNumber: idx + 1
    }));
    setSteps(newSteps);
  };

  const updateStep = (index, patch) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const validate = () => {
    if (!department) return 'Department is required';
    if (!fileType) return 'File type is required';
    if (!steps.length) return 'At least 1 step is required';

    for (const s of steps) {
      if (!ROLE_OPTIONS.includes(s.role)) return 'Invalid role in steps';
      if (!s.slaHours || s.slaHours <= 0) return 'SLA hours must be > 0';
    }
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) {
      showToast('error', err);
      return;
    }

    await createWorkflow({ fileType, department, steps });
    navigate('/workflows');
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          Back to Workflows
        </Button>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
          <div className="absolute inset-0">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
              <GitBranch className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-1">
                Create Workflow Template
              </h1>
              <p className="text-white/90">
                Workflows are loaded strictly by fileType + department.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Basic Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="gradient">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-indigo-500" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  File Type
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-semibold"
                >
                  {Object.keys(FILE_TYPES).map((k) => (
                    <option key={k} value={FILE_TYPES[k]}>
                      {FILE_TYPES[k].replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-500" />
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-semibold"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Approval Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="gradient">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Approval Steps
                </h2>
              </div>
              <Button 
                leftIcon={<Plus className="w-5 h-5" />} 
                onClick={addStep}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-xl"
              >
                Add Step
              </Button>
            </div>

            <div className="space-y-4">
              {steps.map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  <div className={cn(
                    'absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity bg-gradient-to-r',
                    getRoleGradient(s.role)
                  )} />
                  
                  <div className="relative p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Step Number */}
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                            <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black">
                              {s.stepNumber}
                            </span>
                            Step
                          </label>
                          <Input value={s.stepNumber} disabled />
                        </div>

                        {/* Role */}
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                            <Shield className="w-4 h-4 text-indigo-500" />
                            Role
                          </label>
                          <select
                            value={s.role}
                            onChange={(e) => updateStep(idx, { role: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-bold"
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>

                        {/* SLA Hours */}
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                            <Clock className="w-4 h-4 text-amber-500" />
                            SLA (hours)
                          </label>
                          <Input
                            type="number"
                            value={s.slaHours}
                            onChange={(e) => updateStep(idx, { slaHours: Number(e.target.value) })}
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash2 className="w-4 h-4" />}
                        onClick={() => removeStep(idx)}
                        disabled={steps.length === 1}
                        className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      >
                        Remove
                      </Button>
                    </div>

                    {/* Step Badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="secondary" size="sm">
                        No parallel approvals
                      </Badge>
                      <Badge variant="info" size="sm">
                        Sequential step
                      </Badge>
                      <Badge 
                        variant="primary" 
                        size="sm"
                        className={cn('bg-gradient-to-r text-white', getRoleGradient(s.role))}
                      >
                        {s.role}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row justify-end gap-3"
      >
        <Button variant="ghost" onClick={() => navigate('/workflows')}>
          Cancel
        </Button>
        <Button 
          leftIcon={<Save className="w-5 h-5" />} 
          isLoading={isLoading} 
          onClick={submit}
          size="lg"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl"
        >
          Create Workflow
        </Button>
      </motion.div>
    </div>
  );
};

export default CreateWorkflow;