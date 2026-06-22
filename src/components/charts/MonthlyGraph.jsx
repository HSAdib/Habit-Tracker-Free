import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useHabitStore } from '../../store/useHabitStore';
import { getSafeKey } from '../../utils';

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default function MonthlyGraph({ setShowMonthlyGraphModal }) {
  const theme = useHabitStore(state => state.theme);
  const trackerData = useHabitStore(state => state.trackerData);
  const habits = useHabitStore(state => state.habits);
  const archivedHabits = useHabitStore(state => state.archivedHabits);
  const currentDate = useHabitStore(state => state.currentDate);
  const setCurrentDate = useHabitStore(state => state.setCurrentDate);
  const dashboardGraphFilter = useHabitStore(state => state.dashboardGraphFilter);
  const setDashboardGraphFilter = useHabitStore(state => state.setDashboardGraphFilter);
  
  const getTextMuted = () => theme === 'dark' ? 'text-slate-500' : 'text-slate-400';

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) { days.push(new Date(date)); date.setDate(date.getDate() + 1); }
    return days;
  }, [currentDate]);

  const monthlyGraphData = useMemo(() => {
    return daysInMonth.map((day) => {
      const key = getSafeKey(day); 
      let pct = 0;

      if (dashboardGraphFilter === 'all') {
         let totalPct = 0;
         const activeHabits = habits.filter(h => !archivedHabits.includes(h));
         activeHabits.forEach(h => { const r = trackerData[key]?.[h] ?? 0; totalPct += (typeof r === 'number' ? r : (r ? 100 : 0)); });
         pct = activeHabits.length > 0 ? totalPct / activeHabits.length : 0;
      } else {
         const r = trackerData[key]?.[dashboardGraphFilter] ?? 0;
         pct = typeof r === 'number' ? r : (r ? 100 : 0);
      }
      
      return { 
        date: day.getDate(), 
        fullDate: day.toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' }),
        score: Math.round(pct)
      };
    });
  }, [daysInMonth, trackerData, habits, archivedHabits, dashboardGraphFilter]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowMonthlyGraphModal(false)}>
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-[1.2rem] md:rounded-[2rem] w-full max-w-4xl p-6 md:p-8 shadow-2xl relative flex flex-col`} onClick={e => e.stopPropagation()}>
        <button onClick={() => setShowMonthlyGraphModal(false)} className={`absolute top-6 right-6 p-2 ${getTextMuted()} hover:text-rose-500 transition-all`}><XIcon /></button>
        
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-[0.2em] mb-2`}>Monthly Trends</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-emerald-400' : 'bg-slate-100 text-slate-500 hover:text-emerald-600'}`}>
                <ChevronLeftIcon />
              </button>
              <h3 className={`text-2xl md:text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} min-w-[160px] md:min-w-[200px] text-center`}>
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-emerald-400' : 'bg-slate-100 text-slate-500 hover:text-emerald-600'}`}>
                <ChevronRightIcon />
              </button>
            </div>
          </div>
          
          <select 
            value={dashboardGraphFilter}
            onChange={(e) => setDashboardGraphFilter(e.target.value)}
            className={`text-[11px] font-black uppercase px-3 py-2 rounded-full border transition-all duration-500 cursor-pointer focus:outline-none max-w-[120px] md:max-w-[160px] truncate shrink-0
              ${theme === 'dark' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:bg-emerald-500/20' 
                : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-300 shadow-sm'}`}
          >
            <option value="all" className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>Overall</option>
            {habits.filter(h => !archivedHabits.includes(h)).map(h => (
              <option key={h} value={h} className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>{h}</option>
            ))}
          </select>
        </div>
        
        <div className={`w-full h-48 md:h-80 rounded-2xl border p-2 md:p-6 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickMargin={10}
              />
              <YAxis 
                stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
              />
              <RechartsTooltip 
                cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '4 4' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className={`px-3 py-2 rounded-xl border shadow-xl flex flex-col gap-1 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <span className={`text-[10px] font-black uppercase ${getTextMuted()}`}>{payload[0].payload.fullDate}</span>
                        <span className="text-sm font-black text-emerald-500">{payload[0].value}% Score</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
                activeDot={{ r: 6, fill: '#10b981', stroke: theme === 'dark' ? '#0f172a' : '#ffffff', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
