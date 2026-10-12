import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import Card from '@components/common/Card';
import { TrendingUp, Award, Target, Sparkles, Crown, Medal, Trophy } from 'lucide-react';
import Badge from '@components/common/Badge';
import Avatar from '@components/common/Avatar';
import { cn } from '@utils/cn';

const PerformanceChart = ({ data = [] }) => {
  const chartData = data.map(item => ({
    name: item.userInfo?.name || 'Unknown',
    score: Math.round(item.performanceScore),
    approvals: item.approvals,
    rejections: item.rejections,
    total: item.totalActions,
    user: item.userInfo,
  }));

  // Sort by score for leaderboard
  const sortedData = [...chartData].sort((a, b) => b.score - a.score);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-strong p-4 rounded-2xl shadow-2xl border-2 border-white/20">
          <p className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            {data.name}
          </p>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              📊 Performance: {data.score}%
            </p>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              ✅ Approvals: {data.approvals}
            </p>
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              ❌ Rejections: {data.rejections}
            </p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              🎯 Total Actions: {data.total}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getRankBadge = (index) => {
    const badges = [
      { icon: Crown, color: 'from-yellow-400 to-amber-500', text: '🥇 1st Place' },
      { icon: Medal, color: 'from-slate-300 to-slate-400', text: '🥈 2nd Place' },
      { icon: Trophy, color: 'from-orange-400 to-orange-600', text: '🥉 3rd Place' },
    ];
    return badges[index] || { icon: Award, color: 'from-indigo-500 to-purple-600', text: `#${index + 1}` };
  };

  return (
    <Card variant="gradient">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl blur-xl opacity-60 animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Officer Performance
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Top performers ranked by efficiency
              </p>
            </div>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                <TrendingUp className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white mb-2">No data available</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Performance data will appear when actions are recorded
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chart */}
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="currentColor" 
                  className="stroke-slate-200 dark:stroke-slate-700"
                  opacity={0.5}
                />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 'bold' }}
                  axisLine={{ stroke: 'currentColor', strokeWidth: 2 }}
                  tickLine={{ stroke: 'currentColor' }}
                />
                <YAxis 
                  tick={{ fill: 'currentColor', fontWeight: 'bold' }}
                  domain={[0, 100]}
                  axisLine={{ stroke: 'currentColor', strokeWidth: 2 }}
                  tickLine={{ stroke: 'currentColor' }}
                  label={{ 
                    value: 'Performance Score (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontWeight: 'bold', fill: 'currentColor' }
                  }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }} />
                <Area
                  type="monotone"
                  dataKey="score"
                  fill="url(#performanceGradient)"
                  stroke="none"
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  name="Performance Score (%)" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', r: 6, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 3 }}
                  animationDuration={1000}
                />
              </ComposedChart>
            </ResponsiveContainer>

            {/* Leaderboard */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  Top Performers
                </h4>
              </div>

              {sortedData.slice(0, 5).map((item, index) => {
                const rankBadge = getRankBadge(index);
                const RankIcon = rankBadge.icon;

                return (
                  <div 
                    key={index}
                    className="relative group"
                  >
                    {/* Glow for top 3 */}
                    {index < 3 && (
                      <div 
                        className={cn(
                          'absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity bg-gradient-to-r',
                          rankBadge.color
                        )}
                      />
                    )}

                    <div className="relative flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200/60 dark:border-slate-700/60 hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Rank Badge */}
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br',
                          rankBadge.color
                        )}>
                          <RankIcon className="w-6 h-6 text-white" />
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar 
                            name={item.name}
                            src={item.user?.profilePicture}
                            size="md"
                            showStatus={false}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-black text-slate-900 dark:text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {item.total} total actions
                            </p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                              Score
                            </p>
                            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                              {item.score}%
                            </p>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <Badge variant="success" size="sm">
                              ✓ {item.approvals}
                            </Badge>
                            <Badge variant="danger" size="sm">
                              ✗ {item.rejections}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-500/30">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">Top Score</p>
                  <p className="text-2xl font-black text-emerald-900 dark:text-emerald-300">
                    {Math.max(...chartData.map(d => d.score))}%
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">Avg Score</p>
                  <p className="text-2xl font-black text-emerald-900 dark:text-emerald-300">
                    {Math.round(chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length) || 0}%
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">Total Actions</p>
                  <p className="text-2xl font-black text-emerald-900 dark:text-emerald-300">
                    {chartData.reduce((sum, d) => sum + d.total, 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">Officers</p>
                  <p className="text-2xl font-black text-emerald-900 dark:text-emerald-300">
                    {chartData.length}
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

export default PerformanceChart;