import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  FileText,
  Brain,
  BellRing,
  ShieldCheck,
  Timer,
  Workflow,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import { useAuthStore } from '@store/authStore';
import { useUIStore } from '@store/uiStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();

  // Apply theme on mount
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Prioritization',
      desc: 'Automatically assigns priority score and delay risk to help officers act faster.',
      gradient: 'from-blue-700 to-indigo-600',
      hoverGradient: 'from-orange-500 to-amber-500',
    },
    {
      icon: Workflow,
      title: 'Strict Workflow Engine',
      desc: 'Sequential approvals with role-based steps (no parallel approvals).',
      gradient: 'from-indigo-700 to-blue-900',
      hoverGradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Timer,
      title: 'SLA Monitoring & Escalation',
      desc: '80% SLA warnings + automatic escalation on breach with email + real-time alerts.',
      gradient: 'from-blue-800 to-indigo-800',
      hoverGradient: 'from-purple-500 to-fuchsia-500',
    },
    {
      icon: BellRing,
      title: 'Real-Time Notifications',
      desc: 'Socket.io events keep all roles updated instantly when file status changes.',
      gradient: 'from-indigo-600 to-blue-800',
      hoverGradient: 'from-teal-500 to-cyan-500',
    },
  ];

  const moreFeatures = [
    {
      icon: ShieldCheck,
      title: 'Secure & Auditable',
      desc: 'JWT auth, RBAC enforcement, bcrypt passwords, audit logs for every action.',
      gradient: 'from-blue-900 to-indigo-700',
      hoverGradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: FileText,
      title: 'Paperless PDF Workflow',
      desc: 'PDF-only uploads and signed approvals—built for academic/administrative processes.',
      gradient: 'from-indigo-800 to-blue-700',
      hoverGradient: 'from-amber-500 to-yellow-500',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Submit a File',
      desc: 'Select department + file type, upload PDF, AI predicts priority and delay risk.',
      hoverGradient: 'from-indigo-500 to-blue-500',
    },
    {
      number: '2',
      title: 'Role-Based Approval',
      desc: 'Files move step-by-step through your workflow template: CLERK → REGISTRAR → ...',
      hoverGradient: 'from-orange-500 to-amber-500',
    },
    {
      number: '3',
      title: 'SLA Monitoring',
      desc: 'Real-time tracking of approval deadlines with escalation for delayed files.',
      hoverGradient: 'from-emerald-500 to-green-500',
    },
    {
      number: '4',
      title: 'Get Approved',
      desc: 'Receive the final approved document with audit trail of all approvals.',
      hoverGradient: 'from-violet-500 to-purple-500',
    },
  ];

  const stats = [
    { number: '7+', label: 'RBAC Roles' },
    { number: '15m', label: 'SLA Monitor' },
    { number: 'Real-time', label: 'Notifications' },
    { number: 'Secure', label: 'JWT & RBAC' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-indigo-950 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDYwaDYwVjBoLTYweiIvPjxwYXRoIGQ9Ik0zMCAzMGgxdjFoLTF6IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L2c+PC9zdmc+')] opacity-20"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/10">
              <span className="text-sm font-medium">🚀 AI-Powered Educational Workflow Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
              Your Complete Digital<br />
              <span className="text-blue-300">Paperless Office Solution</span>
            </h1>
            
            <p className="text-xl text-blue-100/90 mb-10 max-w-3xl mx-auto">
              Automate file workflows across departments with role-based approvals, AI-driven prioritization,
              SLA monitoring, audit logs, and instant notifications.
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/login" 
                  className="bg-blue-900/60 hover:bg-blue-800/70 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 backdrop-blur-sm border border-blue-500/30"
                >
                  Get Started Free →
                </Link>
                <button 
                  onClick={toggleTheme} 
                  className="bg-blue-900/20 backdrop-blur-sm text-white border border-white/20 hover:border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-800/30 transition"
                >
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            )}

            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="bg-blue-900/60 hover:bg-blue-800/70 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 backdrop-blur-sm border border-blue-500/30 inline-block"
              >
                Go to Dashboard →
              </Link>
            )}
          </div>

          <div className="mt-20 flex justify-center">
            <div className="bg-blue-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-4xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Workflow Preview</h3>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm border border-white/10">Example</span>
              </div>
              
              <div className="space-y-4">
                {[
                  { role: 'CLERK', status: 'Assigned', complete: true },
                  { role: 'REGISTRAR', status: 'Next', complete: false },
                  { role: 'DIRECTOR', status: 'Final', complete: false },
                ].map((item, idx) => (
                  <div
                    key={item.role}
                    className="flex items-center gap-4 p-4 rounded-xl bg-blue-950/50 border border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-900/40 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/30">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.role}</p>
                      <p className="text-xs text-blue-300/80">{item.status}</p>
                    </div>
                    {item.complete ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-white/40"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need for Better Administration
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Powered by artificial intelligence and modern technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={<feature.icon className="w-6 h-6 text-white" />}
              title={feature.title}
              description={feature.desc}
              gradient={feature.gradient}
              hoverGradient={feature.hoverGradient}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {moreFeatures.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={<feature.icon className="w-6 h-6 text-white" />}
              title={feature.title}
              description={feature.desc}
              gradient={feature.gradient}
              hoverGradient={feature.hoverGradient}
            />
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Simple, fast, and efficient workflow management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <StepCard 
                key={step.number} 
                number={step.number} 
                title={step.title} 
                description={step.desc} 
                hoverGradient={step.hoverGradient}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat) => (
              <StatCard 
                key={stat.label} 
                number={stat.number} 
                label={stat.label} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Administrative Experience?
            </h2>
            <p className="text-xl text-blue-100/90 mb-8">
              Join institutions that have transformed their paper-based processes into efficient digital workflows
            </p>
            {!isAuthenticated ? (
              <Link 
                to="/login" 
                className="inline-block bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Now - It's Free
              </Link>
            ) : (
              <Link 
                to="/dashboard" 
                className="inline-block bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Paperless Office</span>
          </div>
          <p className="text-sm">
            © 2026 Paperless Office System. All rights reserved.
          </p>
          <p className="text-xs mt-2">
            AI-powered educational workflow platform for better administration
          </p>

          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="secondary" className="bg-gray-800 text-white">React + Vite</Badge>
            <Badge variant="secondary" className="bg-gray-800 text-white">Node + MongoDB</Badge>
            <Badge variant="secondary" className="bg-gray-800 text-white">Flask AI</Badge>
          </div>
        </div>
      </footer>

      {/* CSS for the specific card hover effects */}
      <style>{`
        @keyframes borderGradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

const FeatureCard = ({ icon, title, description, gradient, hoverGradient }) => (
  <div className="feature-card group transition-all duration-500 hover:-translate-y-2">
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden border border-blue-500/10">
      {/* Normal state: subtle default border */}
      <div className="absolute inset-0 rounded-2xl z-0"></div>
      
      {/* Hover state: gradient border */}
      <div 
        className="absolute inset-0 p-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `linear-gradient(to right, var(--${hoverGradient.split('-')[1]}-500), var(--${hoverGradient.split('-')[2]}))`,
          backgroundSize: '200% 200%',
          animation: 'borderGradientMove 3s ease infinite'
        }}
      ></div>
      
      {/* Content container - stays transparent */}
      <div className="relative z-10 h-full">
        <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const StepCard = ({ number, title, description, hoverGradient }) => (
  <div className="text-center group transition-all duration-500 hover:-translate-y-2">
    <div className="relative border border-blue-500/10 rounded-2xl p-6 bg-white dark:bg-gray-900 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
      {/* Hover state: gradient border */}
      <div 
        className="absolute inset-0 p-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `linear-gradient(to right, var(--${hoverGradient.split('-')[1]}-500), var(--${hoverGradient.split('-')[2]}))`,
          backgroundSize: '200% 200%',
          animation: 'borderGradientMove 3s ease infinite'
        }}
      ></div>
      
      {/* Content - stays transparent */}
      <div className="relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg shadow-blue-900/20 group-hover:shadow-blue-800/30 transition-all duration-300">
          {number}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  </div>
);

const StatCard = ({ number, label }) => (
  <div className="transform transition-all duration-500 hover:-translate-y-2 group">
    <div className="text-4xl font-bold mb-2 relative">
      {number}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-400 group-hover:w-12 transition-all duration-500"></div>
    </div>
    <div className="text-blue-200">{label}</div>
  </div>
);