import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getSafeKey } from '../utils';
import { useHabitStore } from '../store/useHabitStore';

const ActivityIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;


const NoteIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;


const HeatmapCell = React.memo(({ intensity, theme, isMobileMode, idx, cellKey, date }) => {
  const CELL_SIZE = isMobileMode ? 9 : 11;

  if (!date) {
    return <div style={{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px` }} className="opacity-0 pointer-events-none"></div>;
  }

  const intensityStyles = theme === 'dark' ?
  ['bg-slate-800', 'bg-emerald-900/40', 'bg-emerald-800', 'bg-emerald-600', 'bg-emerald-400'] :
  ['bg-slate-100', 'bg-emerald-100', 'bg-emerald-300', 'bg-emerald-500', 'bg-emerald-700'];

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: idx * 0.001 }}
      style={{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px` }}
      className={`rounded-[1px] md:rounded-[2px] border-[0.5px] border-black/5 shadow-sm transition-colors ${intensityStyles[intensity]}`}
      title={`${cellKey}`} />);


});

export default function Heatmap({ setShowAllNotes, noteCount }) {
  const trackerData = useHabitStore((state) => state.trackerData);
  const habits = useHabitStore((state) => state.habits);
  const archivedHabits = useHabitStore((state) => state.archivedHabits);
  const currentDate = useHabitStore((state) => state.currentDate);
  const theme = useHabitStore((state) => state.theme);
  const isMobileMode = useHabitStore((state) => state.isMobileMode);
  const heatmapFilter = useHabitStore((state) => state.heatmapFilter);
  const setHeatmapFilter = useHabitStore((state) => state.setHeatmapFilter);

  const getCardStyle = () => theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-sm' : 'bg-white border-slate-200 shadow-sm';
  const cardPadding = isMobileMode ? 'p-3 rounded-2xl' : 'p-6 rounded-[2.5rem]';
  const CELL_SIZE = isMobileMode ? 9 : 11;
  const CELL_GAP = isMobileMode ? 2 : 3;
  const getTextMuted = () => theme === 'dark' ? 'text-slate-500' : 'text-slate-400';

  const heatmapConfig = useMemo(() => {
    const year = currentDate.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1).getDay();
    const cells = Array(firstDayOfYear).fill(null);
    const daysInYear = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0 ? 366 : 365;

    for (let i = 0; i < daysInYear; i++) {
      const d = new Date(year, 0, 1, 12);d.setDate(d.getDate() + i);const key = getSafeKey(d);
      let intensity = 0;

      if (heatmapFilter === 'all') {
        let totalPct = 0;
        const activeHabits = habits.filter((h) => !archivedHabits.includes(h));
        activeHabits.forEach((h) => {
          const r = trackerData[key]?.[h] ?? 0;
          totalPct += typeof r === 'number' ? r : r ? 100 : 0;
        });
        const avg = activeHabits.length > 0 ? totalPct / (activeHabits.length * 100) : 0;
        intensity = avg === 0 ? 0 : avg <= 0.25 ? 1 : avg <= 0.5 ? 2 : avg <= 0.75 ? 3 : 4;
      } else {
        const r = trackerData[key]?.[heatmapFilter] ?? 0;
        const val = typeof r === 'number' ? r : r ? 100 : 0;
        const ratio = val / 100;
        intensity = ratio === 0 ? 0 : ratio <= 0.25 ? 1 : ratio <= 0.5 ? 2 : ratio <= 0.75 ? 3 : 4;
      }
      cells.push({ date: d, key, intensity });
    }

    const monthLabels = [];const addedMonths = new Set();
    cells.forEach((cell, index) => {
      if (cell && cell.date) {
        const m = cell.date.getMonth();
        if (!addedMonths.has(m)) {
          const weekIndex = Math.floor(index / 7);
          monthLabels.push({ label: cell.date.toLocaleString('default', { month: 'short' }), weekIndex: weekIndex });
          addedMonths.add(m);
        }
      }
    });
    return { cells, monthLabels };
  }, [currentDate, trackerData, habits, archivedHabits, heatmapFilter]);

  return (
    <div className={`${isMobileMode ? '' : 'col-span-2'} ${getCardStyle()} ${cardPadding} border overflow-hidden flex flex-col transition-colors h-full min-w-0`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 md:gap-3">
              <span className={`hidden md:block text-[8px] md:text-[9px] font-black uppercase tracking-widest shrink-0 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Activity Heatmap
              </span>
              <span className={`md:hidden text-emerald-500`}><ActivityIcon /></span>
              <select
                value={heatmapFilter}
                onChange={(e) => setHeatmapFilter(e.target.value)}
                className={`text-[11px] font-black uppercase px-2 py-1 rounded-full border transition-all duration-500 cursor-pointer focus:outline-none max-w-[80px] md:max-w-[120px] truncate
                  ${theme === 'dark' ?
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:bg-emerald-500/20' :
                'bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-300 shadow-sm'}`}>
                
                <option value="all" className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>Overall</option>
                {habits.filter((h) => !archivedHabits.includes(h)).map((h) =>
                <option key={h} value={h} className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>{h}</option>
                )}
              </select>
            </div> 
          </div>
          <div className="flex items-center gap-1.5 md:gap-3 pl-2 md:pl-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAllNotes(true)}
              className={`flex items-center gap-1.5 transition-all px-2.5 py-1.5 rounded-xl border relative
                ${noteCount > 0 ? 'animate-glow-blue' : ''} 
                ${theme === 'dark' ?
              'bg-blue-900/20 text-blue-400 border-blue-500/30' :
              'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'}`} title="Close">
              
              <NoteIcon />
              <span className={`text-[10px] md:text-xs font-black`}>{noteCount}</span>
              
              {noteCount > 0 &&
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              }
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className={`overflow-x-auto custom-scrollbar pb-2 ${isMobileMode ? 'whitespace-nowrap' : ''}`}>
        <div className="inline-block min-w-full">
          <div className="relative h-3 mb-1" style={{ marginLeft: `${isMobileMode ? 16 : 24}px` }}>
            {heatmapConfig.monthLabels.map((m, idx) =>
            <span key={idx} className={`absolute text-[7px] md:text-[8px] font-black ${getTextMuted()} uppercase tracking-tighter text-left`} style={{ left: `${m.weekIndex * (CELL_SIZE + CELL_GAP)}px` }}>
                {m.label}
              </span>
            )}
          </div>
          <div className="flex gap-1 md:gap-2">
            <div className="grid grid-rows-7 gap-[2px] md:gap-[3px] text-[6px] md:text-[7px] font-black opacity-60 uppercase tracking-tighter text-slate-500 w-3 md:w-4 shrink-0 text-right pr-1" style={{ height: `${7 * CELL_SIZE + 6 * CELL_GAP}px`, lineHeight: `${CELL_SIZE}px` }}>
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-[2px] md:gap-[3px] min-h-[70px] md:min-h-[95px]">
              {heatmapConfig.cells.map((cell, idx) =>
              <HeatmapCell
                key={cell ? cell.key : `empty-${idx}`}
                intensity={cell ? cell.intensity : 0}
                theme={theme}
                isMobileMode={isMobileMode}
                idx={idx}
                cellKey={cell ? cell.key : ''}
                date={cell ? cell.date : null} />

              )}
            </div>
          </div>
        </div>
      </div>
    </div>);

}