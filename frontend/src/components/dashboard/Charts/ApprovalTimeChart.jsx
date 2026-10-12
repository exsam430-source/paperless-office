import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Card from '@components/common/Card';
import { Clock, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@utils/cn';

const ApprovalTimeChart = ({ data = [] }) => {
  const chartData = data.map(item => ({
    department: item.departmentInfo?.name || 'Unknown',
    avgTime: Math.round(item.avgApprovalTimeHours),
    count: item.count,
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-strong p-4 rounded-2xl shadow-2xl border-2 border-white/20">
          <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            {payload[0].payload.department}
          </p>
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            ⏱️ Avg Time: {payload[0].value} hours
          </p>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            📊 Files: {payload[0].payload.count}
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
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Approval Time Analysis
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Average processing time by department
              </p>
            </div>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                <Clock className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white mb-2">No data available</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Data will appear when files are processed
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  {COLORS.map((color, index) => (
                    <linearGradient key={index} id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={1} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="currentColor" 
                  className="stroke-slate-200 dark:stroke-slate-700"
                  opacity={0.5}
                />
                <XAxis 
                  dataKey="department" 
                  tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 'bold' }}
                  axisLine={{ stroke: 'currentColor', strokeWidth: 2 }}
                  tickLine={{ stroke: 'currentColor' }}
                />
                <YAxis 
                  label={{ 
                    value: 'Hours', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontWeight: 'bold', fill: 'currentColor' }
                  }}
                  tick={{ fill: 'currentColor', fontWeight: 'bold' }}
                  axisLine={{ stroke: 'currentColor', strokeWidth: 2 }}
                  tickLine={{ stroke: 'currentColor' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
                <Bar 
                  dataKey="avgTime" 
                  name="Avg. Approval Time (hours)" 
                  radius={[12, 12, 0, 0]}
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#colorGradient${index % COLORS.length})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {chartData.slice(0, 4).map((item, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200/60 dark:border-slate-700/60"
                >
                  <div 
                    className="w-3 h-3 rounded-full mb-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 truncate">
                    {item.department}
                  </p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {item.avgTime}h
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {item.count} files
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ApprovalTimeChart;