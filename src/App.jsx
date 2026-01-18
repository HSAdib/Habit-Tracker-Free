import React, { useState, useMemo, useEffect, useRef } from 'react';

/**
 * HABIT TRACKER - MASTERY V13.1 (ULTRA STABLE)
 * 1. Interaction Fix: Hardened press-toggle logic to prevent double-firing and glitches.
 * 2. Scope Fix: Ensured getButtonStyles and all icons are correctly defined and accessible.
 * 3. Auto-Scroll: Maintained today's date positioning slightly down for visual comfort.
 * 4. Full Interactivity: Modal calendar now supports the same tap/hold logic as the main table.
 */

// --- Icons ---
const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
);
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);
const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);
const NoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
const FlameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
);

// --- Core Helper ---
const getSafeKey = (date) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const DEFAULT_HABITS = [
  "sleep 7h", 
  "calisthenics", 
  "shower", 
  "dept study", 
  "coding", 
  "vocab", 
  "audiobook"
];

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [trackerData, setTrackerData] = useState({});
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [editingHabitIdx, setEditingHabitIdx] = useState(null);
  const [tempHabitName, setTempHabitName] = useState("");
  const [viewingHabitMap, setViewingHabitMap] = useState(null);
  const [editingNoteDate, setEditingNoteDate] = useState(null);
  const [showAllNotes, setShowAllNotes] = useState(false);
  
  // Interaction Management
  const [activeSlider, setActiveSlider] = useState(null); 
  const longPressTimer = useRef(null);
  const scrollContainerRef = useRef(null);

  // Moved helper inside to avoid ReferenceErrors in some environments
  const getButtonStyles = (val) => {
    if (!val) return 'bg-white text-slate-300 border-slate-200 hover:bg-slate-50';
    if (val < 100) return 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-100';
    return 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-100';
  };

  useEffect(() => {
    const savedData = localStorage.getItem('habit_tracker_master_v7_data');
    const savedHabits = localStorage.getItem('habit_tracker_master_v7_names');
    if (savedData) try { 
        const parsed = JSON.parse(savedData);
        if (parsed && typeof parsed === 'object') setTrackerData(parsed); 
    } catch(e) {}
    if (savedHabits) try { 
        const parsed = JSON.parse(savedHabits);
        if (Array.isArray(parsed)) setHabits(parsed); 
    } catch(e) {}
  }, []);

  // Auto-scroll logic: centers today slightly down from top
  useEffect(() => {
    const today = new Date();
    if (currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
      setTimeout(() => {
        const todayKey = getSafeKey(today);
        const element = document.getElementById(`row-${todayKey}`);
        if (element && scrollContainerRef.current) {
          const offset = 180; 
          scrollContainerRef.current.scrollTop = Math.max(0, element.offsetTop - offset);
        }
      }, 300);
    }
  }, [currentDate]);

  const save = (data, names) => {
    localStorage.setItem('habit_tracker_master_v7_data', JSON.stringify(data));
    localStorage.setItem('habit_tracker_master_v7_names', JSON.stringify(names));
  };

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentDate]);

  const analytics = useMemo(() => {
    let totalEarnedPct = 0;
    let noteCount = 0;
    const stats = {};

    daysInMonth.forEach(day => {
      const key = getSafeKey(day);
      const dayData = trackerData[key] || {};
      if (dayData.note && dayData.note.trim() !== "") noteCount++;
      habits.forEach(h => {
        const raw = dayData[h] ?? 0;
        const val = typeof raw === 'number' ? raw : (raw ? 100 : 0);
        stats[h] = (stats[h] || 0) + val;
        totalEarnedPct += val;
      });
    });

    const possible = (daysInMonth.length * habits.length * 100) || 1;
    const monthlyPct = Math.round((totalEarnedPct / possible) * 100);
    const totalDoneCount = Math.round(totalEarnedPct / 100);
    const habitPcts = {};
    habits.forEach(h => {
        habitPcts[h] = Math.round(((stats[h] || 0) / (daysInMonth.length * 100)) * 100) || 0;
    });

    return { habitPcts, monthlyPct, totalDone: totalDoneCount, noteCount };
  }, [daysInMonth, trackerData, habits]);

  const updateHabitValue = (dateKey, habit, val) => {
    const newTrackerData = { 
      ...trackerData, 
      [dateKey]: { ...(trackerData[dateKey] || {}), [habit]: val } 
    };
    setTrackerData(newTrackerData);
    save(newTrackerData, habits);
  };

  // Robust Unified Press Handlers (Fixed double-firing)
  const handleHabitPressStart = (e, dateKey, habit, currentVal) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    // Capture pointer to ensure Up triggers even if moved
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);

    const val = typeof currentVal === 'number' ? currentVal : (currentVal ? 100 : 0);
    const rect = e.currentTarget.getBoundingClientRect();
    
    longPressTimer.current = setTimeout(() => {
      setActiveSlider({
        dateKey,
        habit,
        value: val,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
      longPressTimer.current = null; // Mark as slider opened
    }, 450); 
  };

  const handleHabitPressEnd = (e, dateKey, habit, currentVal) => {
    if (longPressTimer.current) {
        // Quick tap: toggle binary state because timer didn't finish
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
        
        const val = typeof currentVal === 'number' ? currentVal : (currentVal ? 100 : 0);
        updateHabitValue(dateKey, habit, val >= 100 ? 0 : 100);
    }
    // If timer was already null, slider is open, so we don't toggle
  };

  const handleRename = (idx) => {
    const old = habits[idx];
    const renamed = tempHabitName.trim();
    if (renamed === old) { setEditingHabitIdx(null); return; }
    if (!renamed) {
      const newHabits = habits.filter((_, i) => i !== idx);
      const newData = { ...trackerData };
      Object.keys(newData).forEach(k => { if(newData[k]) delete newData[k][old]; });
      setHabits(newHabits); setTrackerData(newData); save(newData, newHabits);
    } else {
      const newHabits = [...habits]; newHabits[idx] = renamed;
      const newData = { ...trackerData };
      Object.keys(newData).forEach(k => { if(newData[k] && newData[k][old] !== undefined) { newData[k][renamed] = newData[k][old]; delete newData[k][old]; }});
      setHabits(newHabits); setTrackerData(newData); save(newData, newHabits);
    }
    setEditingHabitIdx(null);
  };

  const solveFluidPath = (points) => {
    if (!points || points.length < 2) return "";
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      const cp2y = next.y;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }
    return d;
  };

  const heatmapData = useMemo(() => {
    const cells = [];
    const year = currentDate.getFullYear();
    const start = new Date(year, 0, 1, 12, 0, 0, 0); 
    const totalDays = ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) ? 366 : 365;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = getSafeKey(d);
      const dayHabits = trackerData[key] || {};
      let totalPct = 0;
      habits.forEach(h => {
        const raw = dayHabits[h] ?? 0;
        totalPct += typeof raw === 'number' ? raw : (raw ? 100 : 0);
      });
      const avgPct = habits.length > 0 ? totalPct / (habits.length * 100) : 0;
      let intensity = 0;
      if (avgPct > 0) {
        if (avgPct <= 0.25) intensity = 1;
        else if (avgPct <= 0.5) intensity = 2;
        else if (avgPct <= 0.75) intensity = 3;
        else intensity = 4;
      }
      cells.push({ key, intensity, completed: Math.round(avgPct * 100) });
    }
    return cells;
  }, [currentDate, trackerData, habits]);

  const trendPoints = useMemo(() => {
    if (daysInMonth.length < 2) return [];
    return daysInMonth.map((day, idx) => {
      const key = getSafeKey(day);
      const dayHabits = trackerData[key] || {};
      let totalPct = 0;
      habits.forEach(h => {
          const raw = dayHabits[h] ?? 0;
          totalPct += typeof raw === 'number' ? raw : (raw ? 100 : 0);
      });
      const avgPct = habits.length > 0 ? totalPct / habits.length : 0;
      return { x: (idx / (daysInMonth.length - 1)) * 100, y: 100 - avgPct };
    }).filter(p => !isNaN(p.x));
  }, [daysInMonth, trackerData, habits]);

  const currentMonthNotes = useMemo(() => {
    return daysInMonth
        .map(d => ({ date: d, key: getSafeKey(d), note: trackerData[getSafeKey(d)]?.note }))
        .filter(entry => entry.note && entry.note.trim() !== "");
  }, [daysInMonth, trackerData]);

  const habitInsights = useMemo(() => {
    if (!viewingHabitMap) return null;
    let monthlyEarned = 0;
    daysInMonth.forEach(day => {
      const raw = trackerData[getSafeKey(day)]?.[viewingHabitMap] ?? 0;
      monthlyEarned += (typeof raw === 'number' ? raw : (raw ? 100 : 0));
    });
    const score = Math.round((monthlyEarned / (daysInMonth.length * 100)) * 100);
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - i);
      const raw = trackerData[getSafeKey(d)]?.[viewingHabitMap] ?? 0;
      weeklyData.push({ label: d.toLocaleDateString(undefined, { weekday: 'narrow' }), val: typeof raw === 'number' ? raw : (raw ? 100 : 0) });
    }
    let currentStreak = 0;
    const todayStr = getSafeKey(new Date());
    const todayIdxInView = daysInMonth.findIndex(d => getSafeKey(d) === todayStr);
    if (todayIdxInView !== -1) {
        let checkIdx = todayIdxInView;
        const isDone = (k) => {
            const v = trackerData[getSafeKey(daysInMonth[k])]?.[viewingHabitMap] ?? 0;
            return (typeof v === 'number' ? v : (v ? 100 : 0)) >= 70;
        };
        if (!isDone(checkIdx)) checkIdx--;
        while (checkIdx >= 0 && isDone(checkIdx)) { currentStreak++; checkIdx--; }
    }
    let bestStreak = 0; let tempStreak = 0;
    daysInMonth.forEach(day => {
        const raw = trackerData[getSafeKey(day)]?.[viewingHabitMap] ?? 0;
        if ((typeof raw === 'number' ? raw : (raw ? 100 : 0)) >= 70) { tempStreak++; bestStreak = Math.max(bestStreak, tempStreak); }
        else tempStreak = 0;
    });
    let level = score >= 90 ? "Grandmaster" : score >= 75 ? "Elite" : score >= 50 ? "Adept" : score >= 25 ? "Apprentice" : "Seed";
    return { score, currentStreak, bestStreak, level, weeklyData, monthlyCount: Math.round(monthlyEarned/100) };
  }, [viewingHabitMap, trackerData, daysInMonth]);

  const modalCalendarGrid = useMemo(() => {
    if (!viewingHabitMap) return [];
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const cells = Array(firstDay).fill(null); 
    daysInMonth.forEach(day => cells.push(day));
    return cells;
  }, [viewingHabitMap, currentDate, daysInMonth]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 select-none overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2 md:px-4 pt-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4 bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-100"><ZapIcon /></div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">Habit Mastery</h1>
          </div>
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-white rounded-lg transition-all active:scale-90"><ChevronLeftIcon /></button>
            <span className="px-4 font-black text-slate-700 min-w-[140px] text-center text-sm">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-white rounded-lg transition-all active:scale-90"><ChevronRightIcon /></button>
          </div>
          <div className="hidden lg:block text-right pr-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mastery Engine</span>
          </div>
        </div>

        {/* Graphical Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Activity Heatmap</p>
                
                <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
                  <div className="flex items-center gap-1.5" title="Mastery Score">
                    <TargetIcon />
                    <span className="text-xs font-black text-slate-700">{analytics.monthlyPct}%</span>
                  </div>
                  <button 
                    onClick={() => setShowAllNotes(true)}
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-all p-1 rounded-lg hover:bg-blue-50/50 active:scale-95 group" 
                  >
                    <NoteIcon />
                    <span className="text-xs font-black group-hover:text-blue-700">{analytics.noteCount}</span>
                  </button>
                  <div className="flex items-center gap-1.5" title="Full Wins">
                    <TrophyIcon />
                    <span className="text-xs font-black text-slate-700">{analytics.totalDone}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 items-center">
                <span className="text-[8px] text-slate-300 mr-1">JAN 1</span>
                {[0,1,2,3,4].map(i => <div key={i} className={`w-2.5 h-2.5 rounded-sm ${['bg-slate-100', 'bg-emerald-100', 'bg-emerald-300', 'bg-emerald-500', 'bg-emerald-700'][i]}`}></div>)}
                <span className="text-[8px] text-slate-300 ml-1">DEC 31</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-[3px] justify-center lg:justify-start">
              {heatmapData.map((cell) => <div key={cell.key} className={`w-[11px] h-[11px] rounded-[2px] border-[0.5px] border-black/5 shadow-sm ${cell.intensity === 0 ? 'bg-slate-100' : cell.intensity === 1 ? 'bg-emerald-100' : cell.intensity === 2 ? 'bg-emerald-300' : cell.intensity === 3 ? 'bg-emerald-500' : cell.intensity === 4 ? 'bg-emerald-900' : 'bg-emerald-950'}`}></div>)}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Momentum</p>
                <ActivityIcon />
            </div>
            <div className="h-28 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d={`${solveFluidPath(trendPoints)} L 100,100 L 0,100 Z`} fill="url(#emerald-grad-main)" className="opacity-10" />
                <path d={solveFluidPath(trendPoints)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                <defs><linearGradient id="emerald-grad-main" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
              </svg>
            </div>
            <div className="flex justify-between mt-2 px-1 text-[8px] font-black text-slate-300 uppercase tracking-widest"><span>START</span><span>END</span></div>
          </div>
        </div>

        {/* Insight Rings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-3 mb-8">
          {habits.map((habit, idx) => (
            <div key={idx} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center cursor-pointer overflow-hidden group" onClick={() => setViewingHabitMap(habit)}>
              {editingHabitIdx === idx ? (
                <input autoFocus className="text-[10px] font-black text-slate-800 w-full text-center border-b-2 border-emerald-500 bg-emerald-50/50 rounded-t-md focus:outline-none" value={tempHabitName} onChange={(e) => setTempHabitName(e.target.value)} onBlur={() => handleRename(idx)} onKeyDown={(e) => e.key === 'Enter' && handleRename(idx)} onClick={(e) => e.stopPropagation()}/>
              ) : (
                <div className="flex items-center gap-1 mb-1 w-full justify-center px-2">
                  <p className="text-[8px] font-black text-slate-400 uppercase truncate flex-1 text-center">{habit}</p>
                  <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-emerald-500 transition-all" onClick={(e) => { e.stopPropagation(); setEditingHabitIdx(idx); setTempHabitName(habit); }}><EditIcon /></button>
                </div>
              )}
              <div className="relative w-12 h-12 flex items-center justify-center mt-1">
                <svg className="absolute w-full h-full -rotate-90"><circle cx="24" cy="24" r="18" fill="none" stroke="#f1f5f9" strokeWidth="4" /><circle cx="24" cy="24" r="18" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={113} strokeDashoffset={113 - (113 * (analytics.habitPcts[habit] ?? 0) / 100)} strokeLinecap="round" className="transition-all duration-1000" /></svg>
                <span className="text-[11px] font-black text-slate-800">{analytics.habitPcts[habit] ?? 0}%</span>
              </div>
            </div>
          ))}
          <button onClick={() => {
              const name = `Habit ${habits.length + 1}`;
              const newHabits = [...habits, name];
              setHabits(newHabits); save(trackerData, newHabits);
              setEditingHabitIdx(newHabits.length - 1); setTempHabitName(name);
          }} className="bg-white p-3 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-emerald-400 hover:text-emerald-50 min-h-[100px]"><PlusIcon /></button>
        </div>

        {/* Main Log Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden mb-20 relative">
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto max-h-[70vh] overflow-y-auto custom-scrollbar scroll-smooth"
            >
                <table className="w-full border-separate border-spacing-0">
                    <thead className="sticky top-0 z-30 shadow-sm">
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="p-4 font-black text-slate-400 text-[9px] uppercase tracking-widest sticky top-0 left-0 bg-slate-50 border-r w-[130px] z-40 text-left border-b border-slate-200">Date Log</th>
                          {habits.map((h, i) => (
                            <th key={i} className="p-2 border-r border-slate-100 text-[9px] uppercase text-center font-bold text-slate-600 min-w-[90px] sticky top-0 bg-slate-50 z-30 border-b border-slate-200">
                              {h}
                            </th>
                          ))}
                          <th className="p-4 font-black text-emerald-600 text-[9px] sticky top-0 right-0 bg-slate-50 border-l w-[100px] z-40 text-center pr-4 border-b border-slate-200">Efficiency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daysInMonth.map((day) => {
                        const key = getSafeKey(day);
                        const dayData = trackerData[key] || {};
                        let totalPct = 0; habits.forEach(h => { const raw = dayData[h] ?? 0; totalPct += (typeof raw === 'number' ? raw : (raw ? 100 : 0)); });
                        const progress = habits.length > 0 ? Math.round(totalPct / habits.length) : 0;
                        const isToday = new Date().toDateString() === day.toDateString();
                        return (
                            <tr key={key} id={`row-${key}`} className={isToday ? 'bg-emerald-50/10' : ''}>
                            <td className={`p-4 sticky left-0 z-10 border-r border-b border-slate-100 flex items-center gap-3 ${isToday ? 'bg-emerald-50' : 'bg-white group-hover:bg-slate-50'}`}>
                                <button onClick={() => setEditingNoteDate(key)} className={`p-2 rounded-xl transition-all ${dayData.note ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`} title="Add reflection note"><NoteIcon /></button>
                                <div className="flex flex-col"><span className="text-[8px] uppercase opacity-80 leading-none">{day.toLocaleDateString(undefined, { weekday: 'short' })}</span><span className="text-sm font-black mt-0.5">{day.getDate()}</span></div>
                            </td>
                            {habits.map((h, i) => {
                                const rawVal = dayData[h] ?? 0;
                                const val = typeof rawVal === 'number' ? rawVal : (rawVal ? 100 : 0);
                                return (
                                <td key={i} className="p-3 border-r border-b border-slate-100 text-center">
                                    <button 
                                      className={`w-12 h-12 rounded-2xl transition-all flex flex-col items-center justify-center mx-auto border-2 text-xl font-black ${getButtonStyles(val)} active:scale-90 touch-none select-none`}
                                      onPointerDown={(e) => handleHabitPressStart(e, key, h, val)}
                                      onPointerUp={(e) => handleHabitPressEnd(e, key, h, val)}
                                      onContextMenu={(e) => e.preventDefault()}
                                    >
                                      <span className={`text-[7px] font-black leading-none mb-0.5 pointer-events-none ${val > 0 ? 'text-white/60' : 'text-slate-300'}`}>{day.getDate()}</span>
                                      <span className={`pointer-events-none ${val > 0 && val < 100 ? 'text-[10px]' : ''}`}>{val === 100 ? '✔' : val > 0 ? `${val}%` : '✘'}</span>
                                    </button>
                                </td>
                                );
                            })}
                            <td className={`p-4 sticky right-0 z-10 border-l border-b border-slate-100 text-center font-black text-sm ${isToday ? 'bg-emerald-50' : 'bg-white'}`}>
                                <span className={progress === 100 ? 'text-emerald-600 font-bold' : progress > 0 ? 'text-blue-600' : 'text-slate-300'}>{progress}%</span>
                            </td>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* DETAILED HABIT INSIGHTS MODAL */}
      {viewingHabitMap && habitInsights && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => setViewingHabitMap(null)}>
            <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
              <div className="bg-slate-50 p-8 md:w-64 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-100">
                <div className="relative w-36 h-36 flex items-center justify-center mb-8">
                  <svg className="absolute w-full h-full -rotate-90"><circle cx="72" cy="72" r="64" fill="none" stroke="#e2e8f0" strokeWidth="10" /><circle cx="72" cy="72" r="64" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray={402} strokeDashoffset={402 - (402 * habitInsights.score / 100)} strokeLinecap="round" className="transition-all duration-1000" /></svg>
                  <div className="flex flex-col items-center"><span className="text-4xl font-black text-slate-800">{habitInsights.score}%</span><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Score</span></div>
                </div>
                <div className="w-full space-y-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"><div className="text-emerald-600"><ActivityIcon /></div><div><span className="text-[10px] block uppercase font-black text-slate-400">Rank</span><span className="text-sm font-black">{habitInsights.level}</span></div></div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"><div className="text-orange-600"><FlameIcon /></div><div><span className="text-[10px] block uppercase font-black text-slate-400">Streak</span><span className="text-sm font-black">{habitInsights.currentStreak} Days</span></div></div>
                </div>
              </div>
              <div className="flex-1 p-8 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div><h3 className="text-2xl font-black text-slate-800 leading-tight">{viewingHabitMap}</h3><div className="flex items-center gap-2 mt-1"><button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1 hover:bg-slate-200 rounded-md transition-colors"><ChevronLeftIcon /></button><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[120px] text-center">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</p><button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1 hover:bg-slate-200 rounded-md transition-colors"><ChevronRightIcon /></button></div></div>
                  <button onClick={() => setViewingHabitMap(null)} className="p-3 text-slate-400 hover:text-rose-500 transition-all"><XIcon /></button>
                </div>
                <div className="mb-8"><p className="text-[10px] font-black text-slate-400 uppercase mb-4 flex items-center gap-2 text-emerald-600"><ActivityIcon /> Last 7 Days Activity</p><div className="flex items-end justify-between px-2 h-16 gap-2">{habitInsights.weeklyData.map((day, idx) => (<div key={idx} className="flex flex-col items-center flex-1 gap-2 group"><div className="w-full relative h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200"><div className="absolute bottom-0 w-full bg-emerald-500 transition-all duration-700" style={{ height: `${day.val}%` }} /></div><span className="text-[9px] font-black text-slate-400 group-hover:text-emerald-500">{day.label}</span></div>))}</div></div>
                <div className="grid grid-cols-7 gap-3 text-center">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <span key={i} className="text-[10px] font-black text-slate-300 uppercase">{day}</span>)}
                  {modalCalendarGrid.map((day, idx) => {
                    if (!day) return <div key={idx} className="aspect-square" />;
                    const key = getSafeKey(day);
                    const valRaw = trackerData[key]?.[viewingHabitMap] ?? 0;
                    const val = typeof valRaw === 'number' ? valRaw : (valRaw ? 100 : 0);
                    const isToday = new Date().toDateString() === day.toDateString();
                    return (
                        <div 
                            key={idx} 
                            onPointerDown={(e) => handleHabitPressStart(e, key, viewingHabitMap, val)} 
                            onPointerUp={(e) => handleHabitPressEnd(e, key, viewingHabitMap, val)} 
                            onContextMenu={(e) => e.preventDefault()} 
                            className={`aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 touch-none select-none active:scale-90 ${getButtonStyles(val)} ${isToday ? 'ring-2 ring-emerald-400 ring-offset-2 shadow-inner' : ''}`}
                        >
                            <span className={`text-[8px] font-black pointer-events-none ${val > 0 ? 'text-white/60' : 'text-slate-400'}`}>{day.getDate()}</span>
                            <span className="text-xs font-black pointer-events-none">{val === 100 ? '✔' : val > 0 ? `${val}%` : '✘'}</span>
                        </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
      )}

      {/* Persistent Mastery Slider Overlay */}
      {activeSlider && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-md animate-in fade-in duration-200 touch-none" onPointerDown={() => setActiveSlider(null)}>
          <div 
            className="absolute flex flex-col items-center animate-in zoom-in duration-300 p-8 rounded-[3rem]" 
            style={{ left: activeSlider.x, top: activeSlider.y, transform: 'translate(-50%, -50%)' }} 
            onPointerDown={(e) => e.stopPropagation()} 
            onPointerMove={(e) => {
              if (e.buttons === 1) { 
                const track = e.currentTarget.querySelector('.slider-track');
                if (!track) return;
                const rect = track.getBoundingClientRect();
                const relativeY = e.clientY - rect.top;
                const percentage = Math.max(0, Math.min(100, Math.round(((rect.height - relativeY) / rect.height) * 100)));
                updateHabitValue(activeSlider.dateKey, activeSlider.habit, percentage);
                setActiveSlider(prev => ({ ...prev, value: percentage }));
              }
            }}
          >
            <p className="text-white font-black uppercase text-xs tracking-widest mb-6 opacity-80 drop-shadow-md">{activeSlider.habit}</p>
            <div className="slider-track relative w-24 h-64 bg-white/20 rounded-[2.5rem] border-4 border-white/30 overflow-hidden shadow-2xl backdrop-blur-3xl ring-8 ring-white/5 cursor-ns-resize">
                <div className="absolute bottom-0 w-full bg-white transition-all duration-75 shadow-[0_0_20px_rgba(255,255,255,0.4)]" style={{ height: `${activeSlider.value}%` }} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className={`text-4xl font-black transition-colors ${activeSlider.value > 50 ? 'text-slate-800' : 'text-white'}`}>{activeSlider.value}%</span>
                </div>
            </div>
            <div className="mt-8 text-center"><p className="text-white/80 font-bold text-[11px] uppercase tracking-tighter drop-shadow-sm">Drag to adjust</p><p className="text-white/40 font-bold text-[9px] uppercase tracking-widest mt-1">Tap outside to close</p></div>
          </div>
        </div>
      )}

      {/* Journal Archive Modal */}
      {showAllNotes && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4" onClick={() => setShowAllNotes(false)}>
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl animate-in zoom-in duration-200 flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800">Journal Archive</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} • {analytics.noteCount} Reflections</p>
                    </div>
                    <button onClick={() => setShowAllNotes(false)} className="p-3 text-slate-400 hover:text-rose-500 transition-all"><XIcon /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {currentMonthNotes.length > 0 ? (
                        currentMonthNotes.map((entry, idx) => (
                            <div key={idx} className="group border-l-4 border-emerald-500 pl-6 py-2 transition-all hover:bg-slate-50 rounded-r-2xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-md">
                                        {entry.date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', weekday: 'short' })}
                                    </span>
                                    <button onClick={() => { setShowAllNotes(false); setEditingNoteDate(entry.key); }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-blue-500 transition-all"><EditIcon /></button>
                                </div>
                                <p className="text-slate-600 font-medium leading-relaxed italic">"{entry.note}"</p>
                            </div>
                        ))
                    ) : (
                        <div className="h-40 flex flex-col items-center justify-center text-slate-300 gap-3">
                            <NoteIcon /><p className="font-bold text-sm">No reflections recorded this month yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Reflection Journal Modal */}
      {editingNoteDate && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => setEditingNoteDate(null)}>
            <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-black text-slate-800 mb-2">Daily Reflection</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Thoughts for the day?</p>
              <textarea className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm" placeholder="Add notes here..." value={trackerData[editingNoteDate]?.note || ""} onChange={(e) => saveNote(editingNoteDate, e.target.value)} />
              <button onClick={() => setEditingNoteDate(null)} className="w-full mt-4 bg-slate-900 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">Save Reflection</button>
            </div>
          </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}