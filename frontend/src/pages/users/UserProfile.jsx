import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  UserRound, ArrowLeft, ToggleLeft, ToggleRight, Trash2, 
  Sparkles, Mail, Shield, Building2, CheckCircle, XCircle 
} from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Avatar from '@components/common/Avatar';
import LoadingSpinner from '@components/common/LoadingSpinner';
import Modal from '@components/common/Modal';
import { usersAPI } from '@api/users.api';
import { useUsers } from '@hooks/useUsers';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateUser, deleteUser } = useUsers();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await usersAPI.getUserById(id);
      setData(res.data);
      setLoading(false);
    })();
  }, [id]);

  const toggleActive = async () => {
    await updateUser(data._id, { isActive: !data.isActive });
    const res = await usersAPI.getUserById(id);
    setData(res.data);
  };

  const doDelete = async () => {
    await deleteUser(data._id);
    navigate('/users');
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading user..." />;

  const infoCards = [
    {
      icon: Mail,
      label: 'Email Address',
      value: data?.email,
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Shield,
      label: 'Role',
      value: data?.role,
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      icon: Building2,
      label: 'Department',
      value: data?.department?.name || 'No department',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: data?.isActive ? CheckCircle : XCircle,
      label: 'Status',
      value: data?.isActive ? 'Active' : 'Inactive',
      gradient: data?.isActive ? 'from-emerald-500 to-teal-600' : 'from-rose-500 to-pink-600',
    },
  ];

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
          Back to Users
        </Button>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
          <div className="absolute inset-0">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                <UserRound className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-1">
                  User Profile
                </h1>
                <p className="text-white/90">
                  Manage user details and permissions
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                leftIcon={data?.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                onClick={toggleActive}
                className={cn(
                  'shadow-xl',
                  data?.isActive 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                )}
              >
                {data?.isActive ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                leftIcon={<Trash2 className="w-5 h-5" />}
                onClick={() => setConfirmDelete(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white shadow-xl"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="gradient">
          <div className="p-8">
            {/* User Header */}
            <div className="flex flex-col sm:flex-row items-start gap-8 mb-8 pb-8 border-b-2 border-slate-200/60 dark:border-slate-700/60">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity" />
                <Avatar
                  src={data?.profilePicture}
                  name={data?.name}
                  size="2xl"
                  className="ring-8 ring-white dark:ring-slate-900"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    {data?.name}
                  </h2>
                  <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
                <p className="text-base font-semibold text-slate-600 dark:text-slate-400 mb-4">
                  {data?.email}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary" size="md" icon>
                    <Shield className="w-4 h-4" />
                    {data?.role}
                  </Badge>
                  <Badge variant="secondary" size="md" icon>
                    <Building2 className="w-4 h-4" />
                    {data?.department?.name || 'No dept'}
                  </Badge>
                  <Badge 
                    variant={data?.isActive ? 'success' : 'danger'} 
                    size="md"
                    icon
                  >
                    {data?.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {data?.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {infoCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div className="relative group">
                      <div className={cn(
                        'absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity bg-gradient-to-br',
                        card.gradient
                      )} />
                      
                      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200/60 dark:border-slate-700/60 transition-all group-hover:scale-105">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={cn(
                            'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg',
                            card.gradient
                          )}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {card.label}
                          </p>
                        </div>
                        <p className="text-lg font-black text-slate-900 dark:text-white break-words">
                          {card.value}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Delete Modal */}
      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete User"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={doDelete} leftIcon={<Trash2 className="w-4 h-4" />}>
              Delete User
            </Button>
          </>
        }
      >
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-2 border-rose-500/30">
          <p className="text-base font-semibold text-rose-900 dark:text-rose-300">
            Are you sure you want to delete{' '}
            <span className="font-black">{data?.name}</span>?
          </p>
          <p className="text-sm text-rose-700 dark:text-rose-400 mt-2">
            This action cannot be undone and will remove all associated data.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;