import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import { AlertTriangle, Activity, TrendingDown, Sparkles, Zap } from 'lucide-react';
import { cn } from '@utils/cn';

const BottleneckChart = ({ data = [] }) => {
  const chartData = data.map(item => ({
    role: item._id,
    pending: item.count,
    avgPriority: Math.round(item.avgPriority),
  }));

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#ec4899'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-strong p-4 rounded-2xl shadow-2xl border-2 border-white/20">
          <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            {payload[0].payload.role}
          </p>
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            ⚠️ Pending: {payload[0].value} files
          </p>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            ⚡ Avg Priority: {payload[0].payload.avgPriority}
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
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl blur-xl opacity-60 animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-xl">
                <AlertTriangle className="w-7 h-7 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Workflow Bottlenecks
                <Sparkles className="w-5 h-5 text-rose-400 animate-pulse" />
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Identify process delays and blockages
              </p>
            </div>
          </div>
          {data.length > 0 && (
            <Badge variant="danger" size="md" icon className="animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              {data.length} Bottleneck{data.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="relative mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full blur-2xl opacity-30 animate-pulse" />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl">
                  <Activity className="w-16 h-16 text-white" />
                </div>
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                ✅ No bottlenecks detected
              </h4>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                All workflows are running smoothly
              </p>
            </div>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  {COLORS.map((color, index) => (
                    <linearGradient key={index} id={`bottleneckGradient${index}`} x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="role" 
                  tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 'bold' }}
                  axisLine={{ stroke: 'currentColor', strokeWidth: 2 }}
                  tickLine={{ stroke: 'currentColor' }}
                />
                <YAxis 
                  tick={{ fill: 'currentColor', fontWeight: 'bold' }}
                  label={{ 
                    value: 'Pending Files', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontWeight: 'bold', fill: 'currentColor' }
                  }}
                  axisLine={{ stroke: 'currentColor', strokeWidth: 2 }}
                  tickLine={{ stroke: 'currentColor' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }} />
                <Bar 
                  dataKey="pending" 
                  name="Pending Files" 
                  radius={[12, 12, 0, 0]}
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#bottleneckGradient${index % COLORS.length})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Detailed List */}
            <div className="mt-6 space-y-3">
              {chartData.map((item, index) => (
                <div 
                  key={index}
                  className="relative group"
                >
                  {/* Glow effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity"
                    style={{ background: `linear-gradient(to right, ${COLORS[index % COLORS.length]}, ${COLORS[(index + 1) % COLORS.length]})` }}
                  />
                  
                  <div className="relative flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200/60 dark:border-slate-700/60 hover:border-rose-500/30 transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ background: `linear-gradient(to bottom right, ${COLORS[index % COLORS.length]}, ${COLORS[(index + 1) % COLORS.length]})` }}
                      >
                        <TrendingDown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900 dark:text-white">
                          {item.role}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Processing bottleneck detected
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
                          {item.pending}
                        </p>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          pending files
                        </p>
                      </div>
                      <Badge 
                        variant="warning" 
                        size="md"
                        className="min-w-[100px] justify-center"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Priority: {item.avgPriority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-2 border-rose-500/30">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 animate-pulse" />
                <p className="text-sm font-black text-rose-900 dark:text-rose-300">
                  Critical Insights
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="font-semibold text-rose-700 dark:text-rose-400 mb-1">Total Bottlenecks</p>
                  <p className="text-2xl font-black text-rose-900 dark:text-rose-300">{chartData.length}</p>
                </div>
                <div>
                  <p className="font-semibold text-rose-700 dark:text-rose-400 mb-1">Total Pending</p>
                  <p className="text-2xl font-black text-rose-900 dark:text-rose-300">
                    {chartData.reduce((sum, item) => sum + item.pending, 0)}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-rose-700 dark:text-rose-400 mb-1">Avg Priority</p>
                  <p className="text-2xl font-black text-rose-900 dark:text-rose-300">
                    {Math.round(chartData.reduce((sum, item) => sum + item.avgPriority, 0) / chartData.length) || 0}
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

export default BottleneckChart;