import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Trash2, ToggleLeft, ToggleRight, Plus, UserRound, 
  Sparkles, Eye, Search, Filter, CheckCircle, XCircle 
} from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Avatar from '@components/common/Avatar';
import Modal from '@components/common/Modal';
import SearchBar from '@components/common/SearchBar';
import EmptyState from '@components/common/EmptyState';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { useUsers } from '@hooks/useUsers';
import { ROLES } from '@config/app.config';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const UsersList = () => {
  const { users, fetchUsers, updateUser, deleteUser, isLoading } = useUsers();
  const [q, setQ] = useState('');
  const [role, setRole] = useState('ALL');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (users || []).filter((u) => {
      const matchesQuery =
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.role?.toLowerCase().includes(term);

      const matchesRole = role === 'ALL' || u.role === role;
      return matchesQuery && matchesRole;
    });
  }, [users, q, role]);

  const toggleActive = async (u) => {
    await updateUser(u._id, { isActive: !u.isActive });
  };

  const doDelete = async () => {
    await deleteUser(confirmDelete._id);
    setConfirmDelete(null);
  };

  if (isLoading && (!users || users.length === 0)) {
    return <LoadingSpinner fullScreen text="Loading users..." />;
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
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-1 flex items-center gap-2">
                Users
                <Sparkles className="w-6 h-6 animate-pulse" />
              </h1>
              <p className="text-white/90">
                Manage users and role assignments.
              </p>
            </div>
          </div>

          <Link to="/users/create">
            <Button 
              leftIcon={<Plus className="w-5 h-5" />}
              className="bg-white text-indigo-600 hover:bg-white/90 font-bold shadow-xl"
            >
              New User
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="gradient">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SearchBar 
                value={q} 
                onChange={setQ} 
                onClear={() => setQ('')} 
                placeholder="Search by name/email/role..." 
              />
              
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-bold"
                >
                  <option value="ALL">All Roles</option>
                  {Object.values(ROLES).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-center md:justify-end px-4 py-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-500/30">
                <span className="text-sm font-bold text-indigo-900 dark:text-indigo-300">
                  Showing <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{filtered.length}</span> users
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Users Grid */}
      {filtered.length === 0 ? (
        <EmptyState 
          icon={Users} 
          title="No users found" 
          description="Create users to start processing files." 
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((u, index) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity" />
                
                <Card className="relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <Avatar
                          src={u.profilePicture}
                          name={u.name}
                          size="lg"
                          showStatus={true}
                          isOnline={u.isActive}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-black text-slate-900 dark:text-white truncate mb-1">
                            {u.name}
                          </h3>
                          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 truncate mb-3">
                            {u.email}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="primary" size="sm" icon>
                              {u.role}
                            </Badge>
                            <Badge variant="secondary" size="sm">
                              {u.department?.name || 'No dept'}
                            </Badge>
                            <Badge 
                              variant={u.isActive ? 'success' : 'danger'} 
                              size="sm"
                              icon
                            >
                              {u.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {u.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link to={`/users/${u._id}`}>
                          <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                            View
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={u.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          onClick={() => toggleActive(u)}
                          disabled={isLoading}
                          className={cn(
                            u.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                          )}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Trash2 className="w-4 h-4" />}
                          onClick={() => setConfirmDelete(u)}
                          disabled={isLoading}
                          className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
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

      {/* Delete Modal */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete User"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={doDelete} isLoading={isLoading} leftIcon={<Trash2 className="w-4 h-4" />}>
              Delete User
            </Button>
          </>
        }
      >
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-2 border-rose-500/30">
          <p className="text-base font-semibold text-rose-900 dark:text-rose-300">
            Are you sure you want to delete user{' '}
            <span className="font-black">{confirmDelete?.name}</span>?
          </p>
          <p className="text-sm text-rose-700 dark:text-rose-400 mt-2">
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default UsersList;