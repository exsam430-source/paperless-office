import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Sparkles, Shield, Building2, Mail, Lock, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { registerSchema } from '@utils/validators';
import { useAuth } from '@hooks/useAuth';
import { departmentsAPI } from '@api/departments.api';
import { ROLES } from '@config/app.config';
import { motion } from 'framer-motion';

const CreateUser = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [loadingDept, setLoadingDept] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({ resolver: yupResolver(registerSchema) });

  useEffect(() => {
    (async () => {
      setLoadingDept(true);
      const res = await departmentsAPI.getAllDepartments();
      setDepartments(res.data || []);
      if (res.data?.[0]?._id) setValue('department', res.data[0]._id);
      setLoadingDept(false);
    })();
  }, [setValue]);

  const onSubmit = async (data) => {
    await registerUser(data);
    navigate('/users');
  };

  if (loadingDept) return <LoadingSpinner fullScreen text="Loading departments..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
              <UserPlus className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-1">
                Create User
              </h1>
              <p className="text-white/90">
                Admin-only user creation (RBAC enforced by backend).
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="gradient">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                User Information
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input 
                label="Full Name *" 
                leftIcon={<User className="w-5 h-5" />}
                placeholder="John Doe"
                error={errors.name?.message} 
                {...register('name')} 
              />

              <Input 
                label="Email *" 
                type="email" 
                leftIcon={<Mail className="w-5 h-5" />}
                placeholder="john@institution.edu"
                error={errors.email?.message} 
                {...register('email')} 
              />

              <Input 
                label="Password *" 
                type="password" 
                leftIcon={<Lock className="w-5 h-5" />}
                placeholder="Minimum 8 characters"
                error={errors.password?.message} 
                {...register('password')} 
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    Role *
                  </label>
                  <select
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-semibold"
                    {...register('role')}
                  >
                    {Object.values(ROLES).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {errors.role && <p className="mt-2 text-sm font-semibold text-rose-600 dark:text-rose-400">{errors.role.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-500" />
                    Department *
                  </label>
                  <select
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-semibold"
                    {...register('department')}
                  >
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                  {errors.department && <p className="mt-2 text-sm font-semibold text-rose-600 dark:text-rose-400">{errors.department.message}</p>}
                </div>
              </div>

              <div className="pt-6 border-t-2 border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => navigate('/users')}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  isLoading={isLoading} 
                  leftIcon={<UserPlus className="w-5 h-5" />}
                  size="lg"
                >
                  Create User
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>

      {/* Tip Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <div className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h4 className="text-lg font-black text-indigo-900 dark:text-indigo-300 mb-1">
                💡 Workflow Tip
              </h4>
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
                Ensure each workflow role (CLERK, REGISTRAR, DIRECTOR, FINANCE, DEAN, VC) has at least one active user for email assignment and proper workflow execution.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateUser;