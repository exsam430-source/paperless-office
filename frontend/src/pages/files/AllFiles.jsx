import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Download, Eye } from 'lucide-react';
import { useFiles } from '@hooks/useFiles';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import Button from '@components/common/Button';
import SearchBar from '@components/common/SearchBar';
import Pagination from '@components/common/Pagination';
import EmptyState from '@components/common/EmptyState';
import LoadingSpinner from '@components/common/LoadingSpinner';
import FileCard from '@components/files/FileCard';
import { formatDateTime } from '@utils/formatters';

const AllFiles = () => {
  const { files, fetchFiles, isLoading } = useFiles();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchFiles();
  }, []);

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.fileId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || file.status === statusFilter;
    const matchesDepartment = departmentFilter === 'ALL' || file.department?._id === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'REVISION', label: 'Revision' },
    { value: 'ESCALATED', label: 'Escalated' },
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading files..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white mb-2">
            All Files
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Manage all files across departments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Link to="/files/create">
            <Button variant="primary">Create File</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search files..."
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <p className="text-2xl font-bold text-secondary-900 dark:text-white">
            {files.length}
          </p>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Files</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-2xl font-bold text-warning-600">
            {files.filter(f => f.status === 'PENDING').length}
          </p>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">Pending</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-2xl font-bold text-success-600">
            {files.filter(f => f.status === 'APPROVED').length}
          </p>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">Approved</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-2xl font-bold text-danger-600">
            {files.filter(f => f.status === 'REJECTED').length}
          </p>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">Rejected</p>
        </Card>
      </div>

      {/* Files Grid */}
      {paginatedFiles.length === 0 ? (
        <EmptyState
          title="No files found"
          description="Try adjusting your filters or create a new file"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedFiles.map((file) => (
              <FileCard key={file._id} file={file} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AllFiles;