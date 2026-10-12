import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import Card from '@components/common/Card';
import { PieChart as PieChartIcon, Sparkles, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@utils/cn';

const FileStatusChart = ({ data = [] }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const STATUS_CONFIG = {
    PENDING: { 
      color: '#f59e0b', 
      gradient: 'from-amber-500 to-orange-600',
      icon: Clock,
      label: 'Pending'
    },
    APPROVED: { 
      color: '#22c55e', 
      gradient: 'from-emerald-500 to-teal-600',
      icon: CheckCircle,
      label: 'Approved'
    },
    REJECTED: { 
      color: '#ef4444', 
      gradient: 'from-rose-500 to-pink-600',
      icon: XCircle,
      label: 'Rejected'
    },
    REVISION: { 
      color: '#3b82f6', 
      gradient: 'from-blue-500 to-cyan-600',
      icon: AlertCircle,
      label: 'Revision'
    },
    ESCALATED: { 
      color: '#dc2626', 
      gradient: 'from-red-600 to-rose-700',
      icon: AlertCircle,
      label: 'Escalated'
    },
  };

  const chartData = data.map(item => ({
    name: item._id,
    value: item.count,
    color: STATUS_CONFIG[item._id]?.color || '#6b7280',
    config: STATUS_CONFIG[item._id],
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 16}
          fill={fill}
          opacity={0.3}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-strong p-4 rounded-2xl shadow-2xl border-2 border-white/20">
          <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            {data.config?.label || data.name}
          </p>
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            📊 Count: {data.value}
          </p>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            📈 Percentage: {((data.value / total) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card variant="gradient">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-60 animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                <PieChartIcon className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Files by Status
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Distribution across all file statuses
              </p>
            </div>
          </div>
          {total > 0 && (
            <div className="text-right">
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {total}
              </p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Total Files
              </p>
            </div>
          )}
        </div>

        {chartData.length === 0 ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                <PieChartIcon className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white mb-2">No data available</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Data will appear when files are created
              </p>
            </div>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <defs>
                  {chartData.map((entry, index) => (
                    <linearGradient key={index} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#pieGradient${index})`}
                      stroke="rgba(255, 255, 255, 0.8)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Status Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
              {chartData.map((item, index) => {
                const Icon = item.config?.icon || PieChartIcon;
                return (
                  <div 
                    key={item.name}
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {/* Glow */}
                    <div 
                      className={cn(
                        'absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity bg-gradient-to-br',
                        item.config?.gradient
                      )}
                    />
                    
                    <div className="relative p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200/60 dark:border-slate-700/60 hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br',
                            item.config?.gradient
                          )}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate">
                            {item.config?.label || item.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <p className="text-3xl font-black text-slate-900 dark:text-white">
                          {item.value}
                        </p>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                          {((item.value / total) * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-500/30">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1">Active</p>
                  <p className="text-2xl font-black text-indigo-900 dark:text-indigo-300">
                    {chartData.find(d => d.name === 'PENDING')?.value || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">Completed</p>
                  <p className="text-2xl font-black text-emerald-900 dark:text-emerald-300">
                    {chartData.find(d => d.name === 'APPROVED')?.value || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-rose-700 dark:text-rose-400 mb-1">Rejected</p>
                  <p className="text-2xl font-black text-rose-900 dark:text-rose-300">
                    {chartData.find(d => d.name === 'REJECTED')?.value || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">In Review</p>
                  <p className="text-2xl font-black text-amber-900 dark:text-amber-300">
                    {chartData.find(d => d.name === 'REVISION')?.value || 0}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default FileStatusChart;