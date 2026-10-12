import React, { useState } from 'react';
import { Copy, Mail, Shield, Building2, Camera, Sparkles, CheckCircle } from 'lucide-react';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import ProfilePictureModal from '@components/settings/ProfilePictureModal';
import { useAuth } from '@hooks/useAuth';
import { useNotifications } from '@hooks/useNotifications';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const Profile = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const [pictureModal, setPictureModal] = useState(false);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('success', 'Copied to clipboard');
    } catch {
      showToast('error', 'Copy failed');
    }
  };

  const infoCards = [
    {
      icon: Mail,
      label: 'Email',
      value: user?.email,
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Shield,
      label: 'Role',
      value: user?.role,
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      icon: Building2,
      label: 'Department',
      value: user?.department?.name || 'N/A',
      gradient: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white"
      >
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-1">
              My Profile
            </h1>
            <p className="text-white/90 text-base">
              Account details (read-only). Admin can update users from Users module.
            </p>
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
            {/* Profile Picture Section */}
            <div className="flex flex-col sm:flex-row items-start gap-8 mb-8 pb-8 border-b-2 border-slate-200/60 dark:border-slate-700/60">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity" />
                <div className="relative">
                  <Avatar
                    src={user?.profilePicture}
                    name={user?.name}
                    size="2xl"
                    className="ring-8 ring-white dark:ring-slate-900"
                  />
                  <button
                    onClick={() => setPictureModal(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Camera className="w-10 h-10 text-white" />
                      <span className="text-xs font-bold text-white">Change</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    {user?.name}
                  </h2>
                  <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
                <p className="text-base font-semibold text-slate-600 dark:text-slate-400 mb-4">
                  {user?.email}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="primary" size="md" icon>
                    <Shield className="w-4 h-4" />
                    {user?.role}
                  </Badge>
                  {user?.department?.name && (
                    <Badge variant="secondary" size="md" icon>
                      <Building2 className="w-4 h-4" />
                      {user.department.name}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button 
                    leftIcon={<Camera className="w-5 h-5" />}
                    onClick={() => setPictureModal(true)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-xl"
                  >
                    Change Picture
                  </Button>
                  <Button 
                    variant="outline" 
                    leftIcon={<Copy className="w-5 h-5" />} 
                    onClick={() => copy(user?.email || '')}
                  >
                    Copy Email
                  </Button>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Profile Picture Modal */}
      <ProfilePictureModal
        open={pictureModal}
        onClose={() => setPictureModal(false)}
      />
    </div>
  );
};

export default Profile;