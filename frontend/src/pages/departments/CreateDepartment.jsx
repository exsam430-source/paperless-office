import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Sparkles, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { departmentSchema } from '@utils/validators';
import { useDepartments } from '@hooks/useDepartments';
import { motion } from 'framer-motion';

const CreateDepartment = () => {
  const navigate = useNavigate();
  const { createDepartment, isLoading } = useDepartments();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(departmentSchema) });

  const onSubmit = async (data) => {
    await createDepartment(data);
    navigate('/departments');
  };

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
          Back to Departments
        </Button>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
          <div className="absolute inset-0">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-1">
                Create Department
              </h1>
              <p className="text-white/90">
                Departments are used for workflow templates and RBAC mapping.
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
                Department Information
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Department Name *"
                placeholder="e.g., Academic Affairs"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Department Code *"
                placeholder="e.g., ACAD"
                error={errors.code?.message}
                {...register('code')}
              />

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={5}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 font-semibold placeholder-slate-400"
                  placeholder="Optional notes about this department..."
                  {...register('description')}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t-2 border-slate-200/60 dark:border-slate-700/60">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => navigate('/departments')}
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={<Save className="w-5 h-5" />}
                  isLoading={isLoading}
                  size="lg"
                >
                  Create Department
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateDepartment;