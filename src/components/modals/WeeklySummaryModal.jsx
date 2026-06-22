import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { useHabitStore } from '../../store/useHabitStore';
import { getSafeKey } from '../../utils';

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
);
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);
const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);

export default function WeeklySummaryModal({ setShowWeeklyModal }) {
  const theme = useHabitStore(state => state.theme);
  const trackerData = useHabitStore(state => state.trackerData);
  const habits = useHabitStore(state => state.habits);
  const archivedHabits = useHabitStore(state => state.archivedHabits);
  const weeklyGraphFilter = useHabitStore(state => state.weeklyGraphFilter);
  const setWeeklyGraphFilter = useHabitStore(state => state.setWeeklyGraphFilter);
  const getTextMuted = () => theme === 'dark' ? 'text-slate-500' : 'text-slate-400';

  const weeklySummary = useMemo(() => {
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(getSafeKey(d));
    }

    const activeHabits = habits.filter(h => !archivedHabits.includes(h));
    const weeklyStats = activeHabits.map(habit => {
      let earned = 0;
      last7Days.forEach(date => {
        const val = trackerData[date]?.[habit] ?? 0;
        earned += (val / 100);
      });
      return { name: habit, score: Math.round((earned / 7) * 100) };
    });

    const topHabits = [...weeklyStats].sort((a, b) => b.score - a.score).slice(0, 3);
    const avgScore = activeHabits.length > 0 ? Math.round(weeklyStats.reduce((acc, h) => acc + h.score, 0) / activeHabits.length) : 0;

    return { topHabits, avgScore, weeklyStats }; 
  }, [trackerData, habits, archivedHabits]);

  const weeklyGraphData = useMemo(() => {
    if (weeklyGraphFilter === 'all') return weeklySummary.weeklyStats;
    
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = getSafeKey(d);
      const valRaw = trackerData[key]?.[weeklyGraphFilter] ?? 0;
      const score = typeof valRaw === 'number' ? valRaw : (valRaw ? 100 : 0);
      days.push({ 
        name: d.toLocaleDateString(undefined, { weekday: 'short' }), 
        score 
      });
    }
    return days;
  }, [weeklyGraphFilter, weeklySummary, trackerData]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowWeeklyModal(false)}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl relative`} onClick={e => e.stopPropagation()}>
        
        <button onClick={() => setShowWeeklyModal(false)} className={`absolute top-6 right-6 p-2 ${getTextMuted()} hover:text-rose-500 transition-all`}><XIcon /></button>
        
        <div className="mb-8">
          <p className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-[0.2em] mb-1`}>Performance Overview</p>
          <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Weekly Summary</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-emerald-900/20 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'} flex flex-col items-center justify-center`}>
            <span className="text-4xl font-black text-emerald-500">{weeklySummary.avgScore}%</span>
            <span className={`text-[9px] font-black uppercase mt-2 ${getTextMuted()}`}>7-Day Average</span>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-emerald-500" />
                <p className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-widest`}>
                  {weeklyGraphFilter === 'all' ? 'Performance Graph' : `${weeklyGraphFilter} Trend`}
                </p>
              </div>
              <select 
                value={weeklyGraphFilter} 
                onChange={(e) => setWeeklyGraphFilter(e.target.value)}
                className={`text-[11px] font-black uppercase px-2 py-1 rounded-full border transition-all duration-500 cursor-pointer focus:outline-none max-w-[80px] md:max-w-[120px] truncate
                  ${theme === 'dark' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:bg-emerald-500/20' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-300 shadow-sm'}`}
              >
                <option value="all" className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>Overall</option>
                {habits.map(h => (
                  <option key={h} value={h} className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>{h}</option>
                ))}
              </select>
            </div>
            
            <div className={`w-full h-48 rounded-2xl border p-4 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyGraphData}>
                  <XAxis 
                    dataKey="name" 
                    stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false}
                    interval={0}
                    tickFormatter={(val) => val.slice(0, 3).toUpperCase()}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: theme === 'dark' ? '#334155' : '#e2e8f0', opacity: 0.4 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className={`px-2 py-1 rounded-lg border text-xs font-black uppercase ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                            {payload[0].payload.name}: <span className="text-emerald-500">{payload[0].value}%</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 4, 4]}>
                    {weeklyGraphData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= 80 ? '#10b981' : entry.score >= 50 ? '#3b82f6' : '#64748b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-3 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <TrophyIcon className="text-yellow-500" />
              <p className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-widest`}>Top Achievements</p>
            </div>
            {weeklySummary.topHabits.map((h, i) => (
              <div key={i} className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} flex items-center justify-between`}>
                <span className={`text-[10px] font-black uppercase ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{h.name}</span>
                <span className="text-sm font-black text-emerald-500">{h.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
