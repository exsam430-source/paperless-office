import React, { useState } from 'react';
import Modal from '@components/common/Modal';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import { X } from 'lucide-react';

export default function AnalyticsFiltersModal({ open, onClose, onApply, currentFilters = {} }) {
  const [filters, setFilters] = useState({
    status: currentFilters.status || [],
    departments: currentFilters.departments || [],
    fileTypes: currentFilters.fileTypes || [],
    priority: currentFilters.priority || [],
    dateFrom: currentFilters.dateFrom || '',
    dateTo: currentFilters.dateTo || '',
  });

  const statusOptions = ['PENDING', 'APPROVED', 'REJECTED', 'REVISION', 'ESCALATED', 'ARCHIVED'];
  const priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];
  const fileTypeOptions = [
    'LEAVE_APPLICATION',
    'BUDGET_REQUEST',
    'PURCHASE_ORDER',
    'ACADEMIC_REQUEST',
    'HR_DOCUMENT',
  ];

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
      departments: [],
      fileTypes: [],
      priority: [],
      dateFrom: '',
      dateTo: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(val => 
    Array.isArray(val) ? val.length > 0 : Boolean(val)
  );

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Analytics Filters"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleReset}>
            Reset All
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </>
      }
    >
      <div className="space-y-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(status => (
              <Badge
                key={status}
                variant={filters.status.includes(status) ? 'primary' : 'secondary'}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleArrayFilter('status', status)}
              >
                {status}
                {filters.status.includes(status) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Priority
          </label>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map(priority => (
              <Badge
                key={priority}
                variant={filters.priority.includes(priority) ? 'primary' : 'secondary'}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleArrayFilter('priority', priority)}
              >
                {priority}
                {filters.priority.includes(priority) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* File Type Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            File Type
          </label>
          <div className="flex flex-wrap gap-2">
            {fileTypeOptions.map(type => (
              <Badge
                key={type}
                variant={filters.fileTypes.includes(type) ? 'primary' : 'secondary'}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleArrayFilter('fileTypes', type)}
              >
                {type.replace(/_/g, ' ')}
                {filters.fileTypes.includes(type) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
            <p className="text-sm font-medium text-primary-800 dark:text-primary-300 mb-2">
              Active Filters:
            </p>
            <div className="text-xs text-primary-700 dark:text-primary-400 space-y-1">
              {filters.status.length > 0 && (
                <p>Status: {filters.status.join(', ')}</p>
              )}
              {filters.priority.length > 0 && (
                <p>Priority: {filters.priority.join(', ')}</p>
              )}
              {filters.fileTypes.length > 0 && (
                <p>File Types: {filters.fileTypes.map(t => t.replace(/_/g, ' ')).join(', ')}</p>
              )}
              {filters.dateFrom && (
                <p>From: {filters.dateFrom}</p>
              )}
              {filters.dateTo && (
                <p>To: {filters.dateTo}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}