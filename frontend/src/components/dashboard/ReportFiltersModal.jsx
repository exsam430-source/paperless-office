import React, { useState } from 'react';
import Modal from '@components/common/Modal';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import { X, Sparkles, Calendar, Filter } from 'lucide-react';
import { cn } from '@utils/cn';

export default function ReportFiltersModal({ open, onClose, onApply, currentFilters = {} }) {
  const [filters, setFilters] = useState({
    status: currentFilters.status || [],
    department: currentFilters.department || [],
    dateFrom: currentFilters.dateFrom || '',
    dateTo: currentFilters.dateTo || '',
    priority: currentFilters.priority || [],
  });

  const statusOptions = ['PENDING', 'APPROVED', 'REJECTED', 'REVISION', 'ESCALATED', 'ARCHIVED'];
  const priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];

  const toggleArrayFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      status: [],
      department: [],
      dateFrom: '',
      dateTo: '',
      priority: [],
    });
  };

  const hasActiveFilters = Object.values(filters).some(val => 
    Array.isArray(val) ? val.length > 0 : Boolean(val)
  );

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Advanced Report Filters"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleReset} disabled={!hasActiveFilters}>
            Reset All
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleApply}
              leftIcon={<Filter className="w-4 h-4" />}
            >
              Apply Filters
            </Button>
          </div>
        </>
      }
    >
      <div className="space-y-6">
        {/* Status Filter */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200/60 dark:border-slate-700/60">
          <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Filter className="w-4 h-4 text-white" />
            </div>
            Status Filter
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(status => {
              const isSelected = filters.status.includes(status);
              return (
                <button
                  key={status}
                  onClick={() => toggleArrayFilter('status', status)}
                  className={cn(
                    'px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 hover:scale-110',
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500/30'
                  )}
                >
                  {status}
                  {isSelected && <X className="w-3 h-3 ml-1.5 inline" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200/60 dark:border-slate-700/60">
          <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Priority Level
          </label>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map(priority => {
              const isSelected = filters.priority.includes(priority);
              return (
                <button
                  key={priority}
                  onClick={() => toggleArrayFilter('priority', priority)}
                  className={cn(
                    'px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 hover:scale-110',
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500/30'
                  )}
                >
                  {priority}
                  {isSelected && <X className="w-3 h-3 ml-1.5 inline" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Range */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200/60 dark:border-slate-700/60">
          <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            Date Range
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-500/30">
            <p className="text-sm font-black text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Active Filters:
            </p>
            <div className="space-y-2 text-xs">
              {filters.status.length > 0 && (
                <p className="font-bold text-indigo-700 dark:text-indigo-400">
                  📊 Status: {filters.status.join(', ')}
                </p>
              )}
              {filters.priority.length > 0 && (
                <p className="font-bold text-indigo-700 dark:text-indigo-400">
                  ⚡ Priority: {filters.priority.join(', ')}
                </p>
              )}
              {filters.dateFrom && (
                <p className="font-bold text-indigo-700 dark:text-indigo-400">
                  📅 From: {filters.dateFrom}
                </p>
              )}
              {filters.dateTo && (
                <p className="font-bold text-indigo-700 dark:text-indigo-400">
                  📅 To: {filters.dateTo}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}