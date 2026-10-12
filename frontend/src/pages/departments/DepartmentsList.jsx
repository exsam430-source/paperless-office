import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Pencil, Trash2, Plus, Sparkles, Search } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Modal from '@components/common/Modal';
import SearchBar from '@components/common/SearchBar';
import EmptyState from '@components/common/EmptyState';
import LoadingSpinner from '@components/common/LoadingSpinner';
import Input from '@components/common/Input';
import { useDepartments } from '@hooks/useDepartments';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const DepartmentsList = () => {
  const { departments, fetchDepartments, updateDepartment, deleteDepartment, isLoading } = useDepartments();
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (departments || []).filter((d) =>
      d.name.toLowerCase().includes(term) || d.code.toLowerCase().includes(term)
    );
  }, [departments, q]);

  const saveEdit = async () => {
    await updateDepartment(edit._id, {
      name: edit.name,
      code: edit.code,
      description: edit.description,
      isActive: edit.isActive,
    });
    setEdit(null);
  };

  const doDelete = async () => {
    await deleteDepartment(confirmDelete._id);
    setConfirmDelete(null);
  };

  if (isLoading && (!departments || departments.length === 0)) {
    return <LoadingSpinner fullScreen text="Loading departments..." />;
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
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-1">Departments</h1>
              <p className="text-white/90">Manage department master data used in workflows.</p>
            </div>
          </div>

          <Link to="/departments/create">
            <Button 
              leftIcon={<Plus className="w-5 h-5" />}
              className="bg-white text-indigo-600 hover:bg-white/90 font-bold shadow-xl"
            >
              New Department
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
              placeholder="Search by name or code..." 
            />
          </div>
        </Card>
      </motion.div>

      {/* Departments Grid */}
      {filtered.length === 0 ? (
        <EmptyState 
          icon={Building2} 
          title="No departments found" 
          description="Create a department to start configuring workflows." 
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((d, index) => (
            <motion.div
              key={d._id}
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
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <Building2 className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">
                              {d.name}
                            </h3>
                            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                              Code: {d.code}
                            </p>
                          </div>
                        </div>

                        {d.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                            {d.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <Badge 
                            variant={d.isActive ? 'success' : 'danger'} 
                            size="sm"
                            icon
                          >
                            {d.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          leftIcon={<Pencil className="w-4 h-4" />} 
                          onClick={() => setEdit({ ...d })}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          leftIcon={<Trash2 className="w-4 h-4" />} 
                          onClick={() => setConfirmDelete(d)}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!edit}
        onClose={() => setEdit(null)}
        title="Edit Department"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEdit(null)}>Cancel</Button>
            <Button variant="primary" onClick={saveEdit} isLoading={isLoading} leftIcon={<Sparkles className="w-4 h-4" />}>
              Save Changes
            </Button>
          </>
        }
      >
        {edit && (
          <div className="space-y-6">
            <Input 
              label="Department Name" 
              value={edit.name} 
              onChange={(e) => setEdit({ ...edit, name: e.target.value })} 
            />
            <Input 
              label="Department Code" 
              value={edit.code} 
              onChange={(e) => setEdit({ ...edit, code: e.target.value })} 
            />
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                rows={5}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-semibold"
                value={edit.description || ''}
                onChange={(e) => setEdit({ ...edit, description: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={!!edit.isActive} 
                onChange={(e) => setEdit({ ...edit, isActive: e.target.checked })} 
                className="w-5 h-5 rounded-lg border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Active Department
              </span>
            </label>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Department"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={doDelete} isLoading={isLoading} leftIcon={<Trash2 className="w-4 h-4" />}>
              Delete Department
            </Button>
          </>
        }
      >
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-2 border-rose-500/30">
          <p className="text-base font-semibold text-rose-900 dark:text-rose-300">
            Are you sure you want to delete{' '}
            <span className="font-black">{confirmDelete?.name}</span>? 
          </p>
          <p className="text-sm text-rose-700 dark:text-rose-400 mt-2">
            This action may affect workflow templates and cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentsList;