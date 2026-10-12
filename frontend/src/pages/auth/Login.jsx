import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Mail, Lock, Eye, EyeOff, GraduationCap, Sparkles, Shield, Zap, CheckCircle } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { loginSchema } from '@utils/validators';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const features = [
    {
      icon: Sparkles,
      gradient: 'from-indigo-500 to-purple-600',
      title: 'AI-Powered Priority Detection',
      description: 'Automatically prioritize documents with machine learning'
    },
    {
      icon: Zap,
      gradient: 'from-amber-500 to-orange-600',
      title: 'Real-Time Collaboration',
      description: 'Instant notifications and seamless workflow tracking'
    },
    {
      icon: Shield,
      gradient: 'from-emerald-500 to-teal-600',
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with complete audit trails'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 relative z-10">
      {/* ===== LEFT SIDE - BRANDING ===== */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-center items-start space-y-8"
      >
        {/* Logo & Title */}
        <div className="space-y-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-60 animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black gradient-text">
                Paperless Office
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-xl font-semibold mt-1">
                Educational Workflow System
              </p>
            </div>
          </div>

          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl">
            Streamline your educational institution's document workflow with our 
            <span className="font-bold text-indigo-600 dark:text-indigo-400"> intelligent automation system.</span>
          </p>
        </div>

        {/* Features */}
        <div className="space-y-5 w-full">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                <div className="relative flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-500/30 transition-all duration-300 hover:scale-105">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 dark:text-white mb-1 text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ===== RIGHT SIDE - LOGIN FORM ===== */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-3xl opacity-20" />
          
          <Card variant="gradient" className="relative w-full max-w-md lg:max-w-none mx-auto p-0">
            <div className="p-8 lg:p-12">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center gap-4 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-60" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black gradient-text">
                    Paperless Office
                  </h1>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Educational Workflow System
                  </p>
                </div>
              </div>

              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">
                  Welcome back! 👋
                </h2>
                <p className="text-base text-slate-600 dark:text-slate-400">
                  Sign in to your account to continue
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@institution.edu"
                  leftIcon={<Mail className="w-5 h-5" />}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  leftIcon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  }
                  error={errors.password?.message}
                  {...register('password')}
                />

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-lg border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2 transition-all"
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold transition-colors hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  leftIcon={<Sparkles className="w-5 h-5" />}
                >
                  Sign In
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Quick Demo Access:
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleSubmit(onSubmit)({
                        email: 'admin@paperless.com',
                        password: 'Admin@123',
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSubmit(onSubmit)({
                        email: 'clerk@paperless.com',
                        password: 'Clerk@123',
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Clerk Login
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;