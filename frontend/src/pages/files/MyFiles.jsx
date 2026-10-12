import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Search, Filter, Download, Eye, Edit2, Trash2, Archive } from 'lucide-react';
import { useFiles } from '@hooks/useFiles';
import { useAuth } from '@hooks/useAuth';
import { useNotifications } from '@hooks/useNotifications';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import SearchBar from '@components/common/SearchBar';
import EmptyState from '@components/common/EmptyState';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { formatDateTime, formatPriorityLabel } from '@utils/formatters';
import { STATUS_COLORS, PRIORITY_COLORS } from '@utils/constants';
import { cn } from '@utils/cn';

const MyFiles = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const { myFiles, fetchMyFiles, deleteFile, archiveFile, isLoading } = useFiles(); // ✅ Add archiveFile
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteModal, setDeleteModal] = useState({ open: false, file: null });
  const [archiveModal, setArchiveModal] = useState({ open: false, file: null }); // ✅ Add archive modal
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false); // ✅ Add archiving state

  useEffect(() => {
    fetchMyFiles();
  }, []);

  const filteredFiles = myFiles.filter((file) => {
    const matchesSearch = file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.fileId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || file.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'REVISION', label: 'Revision' },
    { value: 'ESCALATED', label: 'Escalated' },
    { value: 'ARCHIVED', label: 'Archived' }, // ✅ Already added
  ];

  // ✅ Check if file can be edited/deleted
  const canModify = (file) => {
    return ['PENDING', 'REVISION'].includes(file.status);
  };

  // ✅ Check if file can be archived
  const canArchive = (file) => {
    return file.status === 'APPROVED';
  };

  // Delete handlers
  const openDeleteModal = (file) => {
    setDeleteModal({ open: true, file });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, file: null });
  };

  const confirmDelete = async () => {
    if (!deleteModal.file) return;

    setDeleting(true);
    try {
      await deleteFile(deleteModal.file._id);
      showToast('success', 'File deleted successfully');
      closeDeleteModal();
      await fetchMyFiles();
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to delete file');
      setDeleting(false);
    }
  };

  // ✅ Archive handlers
  const openArchiveModal = (file) => {
    setArchiveModal({ open: true, file });
  };

  const closeArchiveModal = () => {
    setArchiveModal({ open: false, file: null });
  };

  const confirmArchive = async () => {
    if (!archiveModal.file) return;

    setArchiving(true);
    try {
      await archiveFile(archiveModal.file._id);
      showToast('success', 'File archived successfully');
      closeArchiveModal();
      await fetchMyFiles();
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to archive file');
    } finally {
      setArchiving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading your files..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white mb-2">
            My Files
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            View and manage your submitted files
          </p>
        </div>
        <Link to="/files/create">
          <Button variant="primary" leftIcon={<FileText className="w-4 h-4" />}>
            Create New File
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search by title or file ID..."
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Files List */}
      {filteredFiles.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No files found"
          description={searchQuery || statusFilter !== 'ALL' 
            ? "Try adjusting your filters"
            : "Create your first file to get started"
          }
          action={() => navigate('/files/create')}
          actionLabel="Create File"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFiles.map((file) => (
            <Card key={file._id} hover className="p-0 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6">
                {/* Priority Indicator */}
                <div className={cn(
                  'w-1 h-full absolute left-0 top-0',
                  file.priorityScore >= 67 ? 'bg-danger-500' :
                  file.priorityScore >= 34 ? 'bg-warning-500' :
                  'bg-success-500'
                )} />

                {/* File Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg ml-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                      {file.title}
                    </h3>
                    <Badge variant="secondary" size="sm">
                      {file.fileId}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-secondary-600 dark:text-secondary-400">
                    <span>{file.fileType.replace(/_/g, ' ')}</span>
                    <span>•</span>
                    <span>{formatDateTime(file.createdAt)}</span>
                    <span>•</span>
                    <span>Step {file.currentStep}</span>
                    <span>•</span>
                    <span className="font-medium">
                      Priority: {formatPriorityLabel(file.priorityScore)}
                    </span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                  <Badge
                    variant={
                      file.status === 'APPROVED' ? 'success' :
                      file.status === 'REJECTED' ? 'danger' :
                      file.status === 'ESCALATED' ? 'danger' :
                      file.status === 'REVISION' ? 'info' :
                      file.status === 'ARCHIVED' ? 'secondary' :
                      'warning'
                    }
                    size="md"
                    className="flex-shrink-0"
                  >
                    {file.status}
                  </Badge>

                  <Link to={`/files/${file._id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </Link>

                  {/* Edit Button - Only for PENDING or REVISION */}
                  {canModify(file) && (
                    <Link to={`/files/${file._id}/edit`}>
                      <Button variant="ghost" size="sm" title="Edit file">
                        <Edit2 className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    </Link>
                  )}

                  {/* Delete Button - Only for PENDING or REVISION */}
                  {canModify(file) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openDeleteModal(file)}
                      className="text-danger-600 hover:text-danger-700 dark:text-danger-400"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  )}

                  {/* ✅ Archive Button - Only for APPROVED */}
                  {canArchive(file) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openArchiveModal(file)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      title="Archive file"
                    >
                      <Archive className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Archive</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-secondary-100 dark:bg-secondary-700">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
                  style={{ width: `${(file.currentStep / 3) * 100}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={closeDeleteModal}
        title="Delete File"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={closeDeleteModal} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} isLoading={deleting}>
              Delete
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800">
            <p className="text-sm text-danger-800 dark:text-danger-200">
              <strong>Warning:</strong> This action cannot be undone.
            </p>
          </div>

          {deleteModal.file && (
            <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-800/60">
              <p className="text-sm font-semibold text-secondary-900 dark:text-white mb-1">
                {deleteModal.file.title}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                {deleteModal.file.fileId}
              </p>
            </div>
          )}

          <p className="text-sm text-secondary-700 dark:text-secondary-300">
            Are you sure you want to delete this file? All associated data and history will be permanently removed.
          </p>
        </div>
      </Modal>

      {/* ✅ Archive Confirmation Modal */}
      <Modal
        isOpen={archiveModal.open}
        onClose={closeArchiveModal}
        title="Archive File"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={closeArchiveModal} disabled={archiving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmArchive} isLoading={archiving}>
              Archive
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Archived files can still be viewed but will be moved to the archive section.
            </p>
          </div>

          {archiveModal.file && (
            <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-800/60">
              <p className="text-sm font-semibold text-secondary-900 dark:text-white mb-1">
                {archiveModal.file.title}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                {archiveModal.file.fileId}
              </p>
              <Badge variant="success" size="sm" className="mt-2">
                {archiveModal.file.status}
              </Badge>
            </div>
          )}

          <p className="text-sm text-secondary-700 dark:text-secondary-300">
            Are you sure you want to archive this approved file? It will be automatically archived after 3 days anyway.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default MyFiles;