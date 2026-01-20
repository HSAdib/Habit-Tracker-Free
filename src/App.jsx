/* Credit: Adib | APM | RU | Bangladesh | email: hasanshahriaradib@gmail.com */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { motion, AnimatePresence } from 'framer-motion';

// --- Icons ---
const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6"/></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6 6-6"/></svg>
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

const getSafeKey = (date) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const DEFAULT_HABITS = ["sleep 7h", "calisthenics", "shower", "dept study", "coding", "vocab", "audiobook"];
const DEFAULT_CONFIGS = {
  "sleep 7h": { priority: 3, steps: 1 },
  "calisthenics": { priority: 4, steps: 1 },
  "shower": { priority: 1, steps: 1 },
  "dept study": { priority: 10, steps: 1 },
  "coding": { priority: 10, steps: 1 },
  "vocab": { priority: 2, steps: 15 },
  "audiobook": { priority: 3, steps: 1 }
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [trackerData, setTrackerData] = useState({});
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [habitConfigs, setHabitConfigs] = useState(DEFAULT_CONFIGS);
  const [editingHabitIdx, setEditingHabitIdx] = useState(null);
  const [tempHabitName, setTempHabitName] = useState("");
  const [viewingHabitMap, setViewingHabitMap] = useState(null);
  const [editingNoteDate, setEditingNoteDate] = useState(null);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('adib_habit_theme') || 'light' : 'light'));
  const [activeSlider, setActiveSlider] = useState(null); 
  const [isEditingTabName, setIsEditingTabName] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const longPressTimer = useRef(null);
  const scrollContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => { setIsMobile(window.innerWidth <= 768); };
    checkMobile(); window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('adib_habit_theme', newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.colorScheme = theme;
  }, [theme]);

  // Auto-scroll to today
  useEffect(() => {
    const scrollToToday = () => {
      const todayKey = getSafeKey(new Date());
      const element = document.getElementById(`row-${todayKey}`);
      if (element && scrollContainerRef.current) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    const timer = setTimeout(scrollToToday, 600);
    return () => clearTimeout(timer);
  }, [currentDate, habits]);

  // Persistence
  useEffect(() => {
    const savedData = localStorage.getItem('habit_tracker_master_v9_data');
    const savedHabits = localStorage.getItem('habit_tracker_master_v9_names');
    const savedConfigs = localStorage.getItem('habit_tracker_master_v9_configs');
    if (savedData) try { setTrackerData(JSON.parse(savedData)); } catch(e) {}
    if (savedHabits) try { setHabits(JSON.parse(savedHabits)); } catch(e) {}
    if (savedConfigs) try { setHabitConfigs(JSON.parse(savedConfigs)); } catch(e) {}
  }, []);

  const save = (data, names, configs) => {
    localStorage.setItem('habit_tracker_master_v9_data', JSON.stringify(data));
    localStorage.setItem('habit_tracker_master_v9_names', JSON.stringify(names));
    localStorage.setItem('habit_tracker_master_v9_configs', JSON.stringify(configs));
  };

  // Logic Handlers
  const handleDashboardRename = (idx) => {
    const oldName = habits[idx];
    const newName = tempHabitName.trim();
    if (newName === oldName) { setEditingHabitIdx(null); return; }
    if (!newName) { deleteHabit(oldName); } else { executeRename(oldName, newName); }
    setEditingHabitIdx(null);
  };

  const handleTabRename = () => {
    const oldName = viewingHabitMap;
    const newName = tempHabitName.trim();
    if (newName === oldName) { setIsEditingTabName(false); return; }
    if (!newName) { setShowDeleteConfirm(true); } else { executeRename(oldName, newName); setViewingHabitMap(newName); }
    setIsEditingTabName(false);
  };

  const executeRename = (oldName, newName) => {
    const newHabits = [...habits];
    const idx = newHabits.indexOf(oldName);
    if (idx === -1) return;
    newHabits[idx] = newName;
    const newConfigs = { ...habitConfigs };
    newConfigs[newName] = newConfigs[oldName] || { priority: 1, steps: 1 };
    delete newConfigs[oldName];
    const newData = { ...trackerData };
    Object.keys(newData).forEach(k => {
      if (newData[k] && newData[k][oldName] !== undefined) {
        newData[k][newName] = newData[k][oldName];
        delete newData[k][oldName];
      }
    });
    setHabits(newHabits);
    setHabitConfigs(newConfigs);
    setTrackerData(newData);
    save(newData, newHabits, newConfigs);
  };

  const deleteHabit = (name) => {
    const newHabits = habits.filter(h => h !== name);
    const newConfigs = { ...habitConfigs };
    delete newConfigs[name];
    const newData = { ...trackerData };
    Object.keys(newData).forEach(k => { if (newData[k]) delete newData[k][name]; });
    setHabits(newHabits);
    setHabitConfigs(newConfigs);
    setTrackerData(newData);
    save(newData, newHabits, newConfigs);
    setViewingHabitMap(null);
    setShowDeleteConfirm(false);
  };

  const saveNote = (dateKey, noteText) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newTrackerData = { 
      ...trackerData, 
      [dateKey]: { 
        ...(trackerData[dateKey] || {}), 
        note: noteText,
        noteTime: noteText.trim() ? (trackerData[dateKey]?.noteTime || nowTime) : null 
      } 
    };
    setTrackerData(newTrackerData);
    save(newTrackerData, habits, habitConfigs);
  };

  const updateHabitValue = (dateKey, habit, val) => {
    const newTrackerData = { ...trackerData, [dateKey]: { ...(trackerData[dateKey] || {}), [habit]: val } };
    setTrackerData(newTrackerData); save(newTrackerData, habits, habitConfigs);
  };

  // Slider Interaction Fix
  const handleHabitPressStart = (e, dateKey, habit, currentVal) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const val = typeof currentVal === 'number' ? currentVal : (currentVal ? 100 : 0);
    
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);

    longPressTimer.current = setTimeout(() => {
      setActiveSlider({ 
        dateKey, 
        habit, 
        value: val, 
        x: rect.left + rect.width / 2, 
        y: rect.top + rect.height / 2 
      });
      longPressTimer.current = null;
    }, 450); 
  };

  const handleHabitPressEnd = (e, dateKey, habit, currentVal) => {
    if (longPressTimer.current) {
        clearTimeout(longPressTimer.current); 
        longPressTimer.current = null;
        const val = typeof currentVal === 'number' ? currentVal : (currentVal ? 100 : 0);
        updateHabitValue(dateKey, habit, val >= 100 ? 0 : 100);
    }
  };

  // Memos & Logic
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) { days.push(new Date(date)); date.setDate(date.getDate() + 1); }
    return days;
  }, [currentDate]);

  const xpStats = useMemo(() => {
    let totalXP = 0;
    Object.keys(trackerData).forEach(dateKey => {
      habits.forEach(habit => {
        const val = trackerData[dateKey]?.[habit] ?? 0;
        const priority = habitConfigs[habit]?.priority ?? 1;
        totalXP += (val / 100) * priority * 10;
      });
    });
    const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;
    const currentLevelXP = Math.pow(level - 1, 2) * 100;
    const nextLevelXP = Math.pow(level, 2) * 100;
    const progressXP = totalXP - currentLevelXP;
    const requiredXP = nextLevelXP - currentLevelXP;
    const progressPct = requiredXP > 0 ? Math.min(100, Math.round((progressXP / requiredXP) * 100)) : 0;
    return { level, totalXP: Math.round(totalXP), progressPct, requiredXP: Math.round(requiredXP), progressXP: Math.round(progressXP) };
  }, [trackerData, habits, habitConfigs]);

  const analytics = useMemo(() => {
    let totalEarnedWeight = 0; let totalPossibleWeight = 0; let noteCount = 0; const stats = {};
    daysInMonth.forEach(day => {
      const key = getSafeKey(day); const dayData = trackerData[key] || {};
      if (dayData.note && dayData.note.trim() !== "") noteCount++;
      habits.forEach(h => {
        const raw = dayData[h] ?? 0; const val = typeof raw === 'number' ? raw : (raw ? 100 : 0);
        const priority = habitConfigs[h]?.priority ?? 1;
        stats[h] = (stats[h] || 0) + val; 
        totalEarnedWeight += (val / 100) * priority;
        totalPossibleWeight += priority;
      });
    });
    const monthlyPct = totalPossibleWeight > 0 ? Math.round((totalEarnedWeight / totalPossibleWeight) * 100) : 0;
    const habitPcts = {};
    habits.forEach(h => { habitPcts[h] = Math.round(((stats[h] || 0) / (daysInMonth.length * 100)) * 100) || 0; });
    return { habitPcts, monthlyPct, totalDone: Math.round(totalEarnedWeight), noteCount };
  }, [daysInMonth, trackerData, habits, habitConfigs]);

  const habitInsights = useMemo(() => {
    if (!viewingHabitMap) return null;
    let monthlyEarned = 0;
    daysInMonth.forEach(day => {
      const key = getSafeKey(day); const valRaw = trackerData[key]?.[viewingHabitMap] ?? 0;
      monthlyEarned += (typeof valRaw === 'number' ? valRaw : (valRaw ? 100 : 0));
    });
    const score = Math.round((monthlyEarned / (daysInMonth.length * 100)) * 100);
    let currentStreak = 0;
    const todayIdx = daysInMonth.findIndex(d => getSafeKey(d) === getSafeKey(new Date()));
    if (todayIdx !== -1) {
      let i = todayIdx;
      while (i >= 0 && (typeof (trackerData[getSafeKey(daysInMonth[i])]?.[viewingHabitMap]) === 'number' ? trackerData[getSafeKey(daysInMonth[i])]?.[viewingHabitMap] : (trackerData[getSafeKey(daysInMonth[i])]?.[viewingHabitMap] ? 100 : 0)) >= 70) { currentStreak++; i--; }
    }
    return { score, currentStreak, level: score >= 90 ? "Grandmaster" : score >= 75 ? "Elite" : score >= 50 ? "Adept" : score >= 25 ? "Apprentice" : "Seed" };
  }, [viewingHabitMap, trackerData, daysInMonth]);

  const heatmapConfig = useMemo(() => {
    const year = currentDate.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1).getDay(); 
    const cells = Array(firstDayOfYear).fill(null); 
    const daysInYear = (((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) ? 366 : 365);
    for (let i = 0; i < daysInYear; i++) {
      const d = new Date(year, 0, 1, 12); d.setDate(d.getDate() + i); const key = getSafeKey(d);
      let totalPct = 0; habits.forEach(h => { const r = trackerData[key]?.[h] ?? 0; totalPct += typeof r === 'number' ? r : (r ? 100 : 0); });
      const avg = habits.length > 0 ? totalPct / (habits.length * 100) : 0;
      cells.push({ date: d, key, intensity: avg === 0 ? 0 : avg <= 0.25 ? 1 : avg <= 0.5 ? 2 : avg <= 0.75 ? 3 : 4 });
    }
    const monthLabels = []; const addedMonths = new Set();
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
  }, [currentDate, trackerData, habits]);

  const trendPoints = useMemo(() => {
    if (daysInMonth.length < 2) return [];
    return daysInMonth.map((day, idx) => {
      const key = getSafeKey(day); let totalPct = 0;
      habits.forEach(h => { const r = trackerData[key]?.[h] ?? 0; totalPct += (typeof r === 'number' ? r : (r ? 100 : 0)); });
      const avgPct = habits.length > 0 ? totalPct / habits.length : 0;
      return { x: (idx / (daysInMonth.length - 1)) * 100, y: 100 - avgPct };
    }).filter(p => !isNaN(p.x));
  }, [daysInMonth, trackerData, habits]);

  const solveFluidPath = (points) => {
    if (!points || points.length < 2) return "";
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i]; const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2; const cp2x = curr.x + (next.x - curr.x) / 2;
      d += ` C ${cp1x},${curr.y} ${cp2x},${next.y} ${next.x},${next.y}`;
    }
    return d;
  };

  const modalCalendarGrid = useMemo(() => {
    if (!viewingHabitMap) return [];
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const cells = Array(firstDay).fill(null); 
    daysInMonth.forEach(day => cells.push(day));
    return cells;
  }, [viewingHabitMap, currentDate, daysInMonth]);

  const currentMonthNotes = useMemo(() => {
    return daysInMonth.map(d => ({ date: d, key: getSafeKey(d), note: trackerData[getSafeKey(d)]?.note })).filter(e => e.note && e.note.trim() !== "");
  }, [daysInMonth, trackerData]);

  // Styling Helpers
  const getButtonStyles = (val) => {
    if (!val) return theme === 'dark' ? 'bg-slate-800 text-red-500 border-slate-700' : 'bg-white text-red-500 border-slate-200 hover:bg-slate-50';
    if (val < 100) return 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-900/20';
    return 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-900/20';
  };
  const getContainerBg = () => theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900';
  const getCardStyle = () => theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-sm' : 'bg-white border-slate-200 shadow-sm';
  const getTextMuted = () => theme === 'dark' ? 'text-slate-500' : 'text-slate-400';
  const getTableHeadStyle = () => theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200';

  const CELL_SIZE = isMobile ? 9 : 11;
  const CELL_GAP = isMobile ? 2 : 3;

 return (
    <div className={`min-h-screen ${getContainerBg()} font-sans pb-20 select-none overflow-x-hidden transition-colors duration-300`}>
      <Analytics />
      
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto px-2 md:px-4 pt-8 flex flex-col min-h-screen">
        <div className="flex-grow">
          {/* Dashboard Header */}
          <motion.div variants={itemVariants} className={`flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-6 ${getCardStyle()} p-6 rounded-[2.5rem] border transition-colors relative overflow-hidden`}>
            <div className="flex items-center gap-4 z-10">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg animate-glow"><ZapIcon /></motion.div>
              <div>
                <h1 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight leading-none`}>Habit Mastery</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div onClick={toggleTheme} className={`group relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-500 shadow-inner ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <motion.div layout className={`bg-white w-4 h-4 rounded-full shadow-md`} style={{ marginLeft: theme === 'dark' ? '24px' : '0' }} />
                  </div>
                  <span className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-widest`}>Level {xpStats.level}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 max-w-md z-10">
               <div className="flex items-center justify-between mb-1.5 px-1">
                 <span className={`text-[10px] font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} uppercase tracking-tighter`}>Rank Progression</span>
                 <span className={`text-[10px] font-black ${getTextMuted()}`}>{xpStats.progressXP} / {xpStats.requiredXP} XP</span>
               </div>
               <div className={`h-3 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                 <motion.div initial={{ width: 0 }} animate={{ width: `${xpStats.progressPct}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-emerald-600 to-blue-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               </div>
            </div>

            <div className={`flex items-center ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'} rounded-xl p-1 border transition-colors z-10`}>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-white text-slate-600'} rounded-lg transition-all`}><ChevronLeftIcon /></motion.button>
              <span className={`px-4 font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'} min-w-[140px] text-center text-sm`}>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => currentDate.getMonth() + 1 <= new Date().getMonth() || currentDate.getFullYear() < new Date().getFullYear() ? setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)) : null} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-white text-slate-600'} rounded-lg transition-all`}><ChevronRightIcon /></motion.button>
            </div>
          </motion.div>

          {/* Activity Section */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8 items-stretch">
            <motion.div variants={itemVariants} className={`col-span-2 ${getCardStyle()} p-3 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border overflow-hidden flex flex-col transition-colors h-full min-w-0`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2 md:gap-4">
                <div className="flex items-center gap-2 md:gap-4">
                  <p className={`text-[8px] md:text-[10px] font-black ${getTextMuted()} uppercase tracking-widest leading-none shrink-0`}>Activity Heatmap</p>
                  <div className={`flex items-center gap-1.5 md:gap-3 border-l ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} pl-2 md:pl-4 overflow-hidden`}>
                    <div className="flex items-center gap-1" title="Mastery Score"><TargetIcon /><span className={`text-[10px] md:text-xs font-black ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{analytics.monthlyPct}%</span></div>
                    <motion.button whileHover={{ y: -2 }} onClick={() => setShowAllNotes(true)} className={`flex items-center gap-1 transition-all p-0.5 rounded-lg ${theme === 'dark' ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-50/50'}`}><NoteIcon /><span className={`text-[10px] md:text-xs font-black`}>{analytics.noteCount}</span></motion.button>
                    <div className="flex items-center gap-1" title="Full Wins"><TrophyIcon /><span className={`text-[10px] md:text-xs font-black ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{analytics.totalDone}</span></div>
                  </div>
                </div>
              </div>
              
              <div className={`overflow-x-auto custom-scrollbar pb-2 ${isMobile ? 'whitespace-nowrap' : ''}`}>
                <div className="inline-block min-w-full">
                  <div className="relative h-3 mb-1 ml-4 md:ml-5">
                    {heatmapConfig.monthLabels.map((m, idx) => (
                      <span key={idx} className={`absolute text-[7px] md:text-[8px] font-bold ${getTextMuted()} uppercase tracking-tighter`} style={{ left: `${m.weekIndex * (CELL_SIZE + CELL_GAP)}px` }}>
                        {m.label}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1 md:gap-2">
                    <div className="flex flex-col justify-between py-[2px] text-[6px] md:text-[7px] font-black opacity-60 uppercase tracking-tighter text-slate-500 w-3 md:w-4 shrink-0 text-right pr-1">
                      <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                    </div>
                    <div className="grid grid-rows-7 grid-flow-col gap-[2px] md:gap-[3px] min-h-[70px] md:min-h-[95px]">
                      {heatmapConfig.cells.map((cell, idx) => {
                        const intensityStyles = theme === 'dark' 
                          ? ['bg-slate-800', 'bg-emerald-900/40', 'bg-emerald-800', 'bg-emerald-600', 'bg-emerald-400']
                          : ['bg-slate-100', 'bg-emerald-100', 'bg-emerald-300', 'bg-emerald-500', 'bg-emerald-700'];
                        return cell ? (
                          <motion.div key={cell.key} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: idx * 0.001 }} style={{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px` }} className={`rounded-[1px] md:rounded-[2px] border-[0.5px] border-black/5 shadow-sm transition-colors ${intensityStyles[cell.intensity]}`} title={`${cell.key}`} />
                        ) : (
                          <div key={`empty-${idx}`} style={{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px` }} className={`opacity-0 pointer-events-none`}></div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className={`col-span-1 ${getCardStyle()} p-3 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border relative overflow-hidden flex flex-col justify-between transition-colors h-full min-w-0`}>
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <p className={`text-[8px] md:text-[10px] font-black ${getTextMuted()} uppercase tracking-widest`}>Trend</p>
                <div className="scale-75 md:scale-100"><ActivityIcon /></div>
              </div>
              <div className="flex-grow flex items-center h-16 md:h-28 w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} d={`${solveFluidPath(trendPoints)} L 100,100 L 0,100 Z`} fill="url(#emerald-grad-main)" className="opacity-10" />
                  <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} d={solveFluidPath(trendPoints)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                  <defs><linearGradient id="emerald-grad-main" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
                </svg>
              </div>
              <div className={`flex justify-between mt-1 md:mt-2 px-1 text-[6px] md:text-[8px] font-black ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'} uppercase tracking-widest`}>
                <span>START</span><span>END</span>
              </div>
            </motion.div>
          </div>

          {/* Habit Cards Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3 mb-8">
            <AnimatePresence mode='popLayout'>
            {habits.map((habit, idx) => (
              <motion.div layout variants={itemVariants} whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }} key={habit} className={`${getCardStyle()} p-2 rounded-2xl border flex flex-col items-center cursor-pointer overflow-hidden group transition-all min-h-[100px] hover:shadow-lg relative`} onClick={() => setViewingHabitMap(habit)}>
                <div className="flex items-center gap-1 mb-0.5 w-full justify-center px-1 min-h-[40px] flex-grow">
                    {editingHabitIdx === idx ? (
                      <input autoFocus className={`text-[10px] font-bold w-full text-center bg-transparent focus:outline-none border-b-2 border-emerald-500 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`} value={tempHabitName} onChange={(e) => setTempHabitName(e.target.value)} onBlur={() => handleDashboardRename(idx)} onKeyDown={(e) => e.key === 'Enter' && handleDashboardRename(idx)} onClick={(e) => e.stopPropagation()} />
                    ) : (
                      <>
                        <p className={`text-[10px] font-bold ${getTextMuted()} uppercase line-clamp-2 break-words flex-1 text-center leading-[1.2]`}>{habit}</p>
                        <button className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-300 hover:text-emerald-500 transition-all shrink-0 absolute right-2 top-2" onClick={(e) => { e.stopPropagation(); setEditingHabitIdx(idx); setTempHabitName(habit); }}><EditIcon /></button>
                      </>
                    )}
                </div>
                <div className="relative w-16 h-16 flex items-center justify-center mt-auto">
                  <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="23" fill="none" stroke={theme==='dark'?'#1e293b':'#f1f5f9'} strokeWidth="4.5" />
                    <motion.circle cx="30" cy="30" r="23" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray={145} initial={{ strokeDashoffset: 145 }} animate={{ strokeDashoffset: 145 - (145 * (analytics.habitPcts[habit] ?? 0) / 100) }} transition={{ duration: 1, ease: "easeInOut" }} strokeLinecap="round" />
                  </svg>
                  <span className={`text-[11px] font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{analytics.habitPcts[habit] ?? 0}%</span>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
            <motion.button layout whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {
                const name = `Habit ${habits.length + 1}`; const newHabits = [...habits, name]; 
                const newConfigs = {...habitConfigs, [name]: { priority: 1, steps: 1 }};
                setHabits(newHabits); setHabitConfigs(newConfigs); save(trackerData, newHabits, newConfigs); setEditingHabitIdx(newHabits.length - 1); setTempHabitName(name);
              }} className={`${getCardStyle()} p-2 rounded-2xl border-2 border-dashed flex items-center justify-center ${theme === 'dark' ? 'border-slate-800 text-slate-700 hover:border-emerald-700' : 'border-slate-200 text-slate-300 hover:border-emerald-400'} min-h-[100px] transition-all`}>
              <PlusIcon />
            </motion.button>
          </motion.div>

          {/* Table Log */}
          <motion.div variants={itemVariants} className={`${getCardStyle()} rounded-[2.5rem] overflow-hidden mb-8 relative transition-colors`}>
              <div ref={scrollContainerRef} className={`overflow-x-auto max-h-[70vh] overflow-y-auto custom-scrollbar scroll-smooth ${isMobile ? 'whitespace-nowrap' : ''}`}>
                  <table className="w-full border-separate border-spacing-0 table-fixed min-w-full">
                      <thead className={`sticky top-0 z-30 shadow-sm ${getTableHeadStyle()} border-b transition-colors`}>
                          <tr>
                            <th className={`p-4 font-black ${getTextMuted()} text-[9px] uppercase tracking-widest sticky top-0 left-0 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border-r w-[140px] z-40 text-center`}>Date Log</th>
                            {habits.map((h, i) => (
                                <th key={i} className={`p-4 border-r ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-600'} text-[9px] uppercase text-center font-bold`}>
                                    <div className="truncate px-1" title={h}>{h}</div>
                                </th>
                            ))}
                            <th className={`p-4 font-black text-emerald-600 text-[9px] sticky top-0 right-0 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border-l w-[100px] z-40 text-center`}>Efficiency</th>
                          </tr>
                      </thead>
                      <tbody>
                          {daysInMonth.map((day) => {
                            const key = getSafeKey(day); const dayData = trackerData[key] || {};
                            let totalEarnedWeight = 0; let totalPossibleWeight = 0;
                            habits.forEach(h => { 
                              const val = typeof dayData[h] === 'number' ? dayData[h] : (dayData[h] ? 100 : 0);
                              const priority = habitConfigs[h]?.priority ?? 1;
                              totalEarnedWeight += (val / 100) * priority;
                              totalPossibleWeight += priority;
                            });
                            const progress = totalPossibleWeight > 0 ? Math.round((totalEarnedWeight / totalPossibleWeight) * 100) : 0;
                            const isToday = new Date().toDateString() === day.toDateString();
                            const isPassed = new Date(day).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
                            const rowBgStyle = isToday ? (theme === 'dark' ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-50 border-emerald-100') : (theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100');

                            return (
                                <tr key={key} id={`row-${key}`}>
                                <td className={`p-4 sticky left-0 z-10 border-r border-b transition-colors ${rowBgStyle}`}>
                                    <div className="flex items-center justify-center gap-3">
                                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => setEditingNoteDate(key)} className={`p-2 rounded-xl transition-all ${dayData.note ? 'bg-blue-600 text-white shadow-md' : (theme === 'dark' ? 'bg-slate-800 text-slate-600 hover:bg-slate-700' : 'bg-slate-100 text-slate-300 hover:bg-slate-200')}`} title="Add reflection note"><NoteIcon /></motion.button>
                                      <div className="flex flex-col text-center"><span className={`text-[8px] uppercase opacity-80 leading-none ${theme === 'dark' ? 'text-slate-500' : ''}`}>{day.toLocaleDateString(undefined, { weekday: 'short' })}</span><span className={`text-sm font-black mt-0.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{day.getDate()}</span></div>
                                    </div>
                                </td>
                                {habits.map((h, i) => {
                                    const rawVal = dayData[h] ?? 0; const val = typeof rawVal === 'number' ? rawVal : (rawVal ? 100 : 0);
                                    const config = habitConfigs[h];
                                    const currentStep = config?.steps > 1 ? Math.round((val / 100) * config.steps) : null;
                                    return (
                                    <td key={i} className={`p-4 border-r border-b transition-colors text-center ${rowBgStyle}`}>
                                        <motion.button whileTap={{ scale: 0.9 }} className={`w-12 h-12 rounded-2xl transition-all flex flex-col items-center justify-center mx-auto border-2 text-xl font-black ${getButtonStyles(val)} touch-none select-none`} onPointerDown={(e) => handleHabitPressStart(e, key, h, val)} onPointerUp={(e) => handleHabitPressEnd(e, key, h, val)} onContextMenu={(e) => e.preventDefault()}>
                                          <span className={`text-[7px] font-black leading-none mb-0.5 pointer-events-none ${val > 0 ? 'text-white/60' : (theme === 'dark' ? 'text-slate-600' : 'text-slate-300')}`}>{day.getDate()}</span>
                                          <span className={`pointer-events-none font-bold ${val > 0 ? 'text-white' : (isPassed ? 'text-red-500' : 'text-white [text-shadow:_-1.5px_-1.5px_0_#000,_1.5px_-1.5px_0_#000,_-1.5px_1.5px_0_#000,_1.5px_1.5px_0_#000]')} ${val > 0 && val < 100 ? 'text-[10px]' : ''}`}>
                                            {currentStep !== null ? `${currentStep}` : (val === 100 ? '✔' : (val > 0 ? `${Math.round(val)}%` : '✘'))}
                                          </span>
                                        </motion.button>
                                    </td>
                                    );
                                })}
                                <td className={`p-4 sticky right-0 z-10 border-l border-b transition-colors text-center font-black text-sm ${rowBgStyle}`}>
                                    <span className={progress === 100 ? 'text-emerald-600 font-bold' : progress > 0 ? 'text-blue-600' : theme === 'dark' ? 'text-slate-700' : 'text-slate-300'}>{progress}%</span>
                                </td>
                                </tr>
                            );
                          })}
                      </tbody>
                  </table>
              </div>
          </motion.div>
        </div>
      </motion.div>

      {/* --- Modals --- */}
      <AnimatePresence>
        {/* All Notes Modal */}
        {showAllNotes && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setShowAllNotes(false)}>
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col`} onClick={e => e.stopPropagation()}>
                  <div className={`p-8 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
                      <div><h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Journal Archive</h3><p className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-widest mt-1`}>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} • {analytics.noteCount} Reflections</p></div>
                      <button onClick={() => setShowAllNotes(false)} className={`p-3 ${getTextMuted()} hover:text-rose-500 transition-all`}><XIcon /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                      {currentMonthNotes && currentMonthNotes.length > 0 ? currentMonthNotes.map((entry, idx) => (
                          <div key={idx} className={`group border-l-4 border-emerald-500 pl-6 py-2 transition-all ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-50'} rounded-r-2xl`}>
                              <div className="flex items-center gap-3 mb-2"><span className={`text-[10px] font-black text-emerald-600 uppercase ${theme === 'dark' ? 'bg-emerald-900/20' : 'bg-emerald-50'} px-2 py-1 rounded-md`}>{entry.date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', weekday: 'short' })}</span><button onClick={() => { setShowAllNotes(false); setEditingNoteDate(entry.key); }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-blue-500 transition-all"><EditIcon /></button></div>
                              <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} font-medium leading-relaxed italic`}>"{entry.note}"</p>
                          </div>
                      )) : <div className={`h-40 flex flex-col items-center justify-center ${getTextMuted()} gap-3`}><NoteIcon /><p className="font-bold text-sm">No reflections recorded yet.</p></div>}
                  </div>
              </motion.div>
          </motion.div>
        )}

        {/* Habit Detail Modal */}
        {viewingHabitMap && habitInsights && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => { setViewingHabitMap(null); setIsEditingTabName(false); }}>
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className={`rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row transition-colors ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
                
                <div className={`p-8 md:w-64 flex flex-col items-center border-b md:border-b-0 md:border-r ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="relative w-36 h-36 flex items-center justify-center mb-8">
                    <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 144 144">
                      <circle cx="72" cy="72" r="64" fill="none" stroke={theme==='dark'?'#334155':'#e2e8f0'} strokeWidth="10" />
                      <motion.circle initial={{ strokeDashoffset: 402 }} animate={{ strokeDashoffset: 402 - (402 * habitInsights.score / 100) }} transition={{ duration: 1.5, ease: "easeOut" }} cx="72" cy="72" r="64" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray={402} strokeLinecap="round" />
                    </svg>
                    <div className="flex flex-col items-center"><span className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{habitInsights.score}%</span><span className={`text-[9px] font-black ${getTextMuted()} uppercase tracking-widest`}>Score</span></div>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-lg' : 'bg-white border-slate-100 shadow-sm'} p-4 rounded-2xl border flex items-center gap-4 transition-colors`}><div className="text-emerald-600"><ActivityIcon /></div><div><span className={`text-[10px] block uppercase font-black ${getTextMuted()}`}>Rank</span><span className={`text-sm font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{habitInsights.level}</span></div></div>
                    <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-lg' : 'bg-white border-slate-100 shadow-sm'} p-4 rounded-2xl border flex items-center gap-4 transition-colors`}><div className="text-orange-600"><FlameIcon /></div><div><span className={`text-[10px] block uppercase font-black ${getTextMuted()}`}>Streak</span><span className={`text-sm font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{habitInsights.currentStreak} Days</span></div></div>
                  </div>

                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowDeleteConfirm(true)} className="mt-auto w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20"><TrashIcon /> Delete Habit</motion.button>
                </div>

                <div className="flex-1 p-8 flex flex-col">
                  <div className="flex items-start justify-between mb-8 gap-4">
                    <div className="flex-1">
                      {isEditingTabName ? (
                        <input autoFocus className={`text-2xl font-black bg-transparent focus:outline-none border-b-2 border-emerald-500 w-full ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`} value={tempHabitName} onChange={(e) => setTempHabitName(e.target.value)} onBlur={handleTabRename} onKeyDown={(e) => e.key === 'Enter' && handleTabRename()} />
                      ) : (
                        <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} leading-tight break-words pr-2 cursor-pointer hover:text-emerald-500 transition-colors flex items-center gap-3 group`} onClick={() => { setIsEditingTabName(true); setTempHabitName(viewingHabitMap); }}>{viewingHabitMap}<span className="opacity-0 group-hover:opacity-100 transition-opacity"><EditIcon /></span></h3>
                      )}
                      <div className={`flex items-center gap-1 mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1 hover:text-emerald-500 transition-colors"><ChevronLeftIcon /></button>
                        <span className="text-10px font-black uppercase tracking-widest min-w-[80px] text-center">{currentDate.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1 hover:text-emerald-500 transition-colors"><ChevronRightIcon /></button>
                      </div>
                    </div>
                    <button onClick={() => { setViewingHabitMap(null); setIsEditingTabName(false); }} className={`p-3 transition-all ${getTextMuted()} hover:text-rose-500 shrink-0`}><XIcon /></button>
                  </div>

                  <div className="mb-4">
                    <p className={`text-[10px] font-black ${getTextMuted()} uppercase mb-3`}>Habit Configuration</p>
                    <div className="flex gap-4">
                       <div className="flex-1">
                         <label className={`text-[8px] font-black uppercase ${getTextMuted()} block mb-1`}>Priority (1-10)</label>
                         <input type="range" min="1" max="10" value={habitConfigs[viewingHabitMap]?.priority ?? 1} onChange={(e) => {
                           const nc = {...habitConfigs, [viewingHabitMap]: {...(habitConfigs[viewingHabitMap]||{priority:1, steps:1}), priority: parseInt(e.target.value)}};
                           setHabitConfigs(nc); save(trackerData, habits, nc);
                         }} className="w-full accent-emerald-500" />
                       </div>
                       <div className="w-24">
                         <label className={`text-[8px] font-black uppercase ${getTextMuted()} block mb-1`}>Goal Steps</label>
                         <input type="number" min="1" max="100" value={habitConfigs[viewingHabitMap]?.steps ?? 1} onChange={(e) => {
                           const nc = {...habitConfigs, [viewingHabitMap]: {...(habitConfigs[viewingHabitMap]||{priority:1, steps:1}), steps: Math.max(1, parseInt(e.target.value) || 1)}};
                           setHabitConfigs(nc); save(trackerData, habits, nc);
                         }} className={`w-full text-xs font-black p-1 rounded bg-transparent border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`} />
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-3 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <span key={i} className={`text-[10px] font-black ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'} uppercase`}>{day}</span>)}
                    {modalCalendarGrid.map((day, idx) => {
                      if (!day) return <div key={idx} className="aspect-square" />;
                      const key = getSafeKey(day); const v = typeof trackerData[key]?.[viewingHabitMap] === 'number' ? trackerData[key]?.[viewingHabitMap] : (trackerData[key]?.[viewingHabitMap] ? 100 : 0);
                      const isTodayCell = new Date().toDateString() === day.toDateString();
                      const isPassedCell = new Date(day).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
                      const config = habitConfigs[viewingHabitMap];
                      const stepVal = config?.steps > 1 ? Math.round((v / 100) * config.steps) : null;
                      return (
                          <motion.div key={idx} whileTap={{ scale: 0.9 }} onPointerDown={(e) => handleHabitPressStart(e, key, viewingHabitMap, v)} onPointerUp={(e) => handleHabitPressEnd(e, key, viewingHabitMap, v)} className={`aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 touch-none select-none ${getButtonStyles(v)} ${isTodayCell ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}`}>
                              <span className={`text-[8px] font-black pointer-events-none ${v > 0 ? 'text-white/60' : (theme === 'dark' ? 'text-slate-600' : 'text-slate-400')}`}>{day.getDate()}</span>
                              <span className={`text-xs font-black pointer-events-none ${v > 0 ? 'text-white' : (isPassedCell ? 'text-red-500' : 'text-white [text-shadow:_-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,1px_1px_0_#000]')} ${v > 0 && v < 100 ? 'text-[9px]' : ''}`}>
                                  {stepVal !== null ? stepVal : (v === 100 ? '✔' : (v > 0 ? `${Math.round(v)}%` : '✘'))}
                              </span>
                          </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
        )}

        {/* --- FIXED MASTERY SLIDER --- */}
        {activeSlider && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md touch-none select-none" onPointerDown={() => setActiveSlider(null)}>
            <motion.div 
              initial={{ scale: 0.7, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.7, opacity: 0 }} 
              className="fixed flex flex-col items-center" 
              style={{ 
                left: activeSlider.x, 
                top: activeSlider.y, 
                transform: 'translate(-50%, -50%)',
                willChange: 'transform'
              }} 
              onPointerDown={(e) => e.stopPropagation()} 
              onPointerMove={(e) => {
                if (e.buttons === 1 || e.pointerType === 'touch') {
                  const track = document.getElementById('mastery-slider-track'); 
                  if (!track) return;
                  const rect = track.getBoundingClientRect(); 
                  const percentage = Math.max(0, Math.min(100, Math.round(((rect.bottom - e.clientY) / rect.height) * 100)));
                  const config = habitConfigs[activeSlider.habit];
                  let finalVal = config?.steps > 1 ? (Math.round((percentage / 100) * config.steps) / config.steps) * 100 : percentage;
                  updateHabitValue(activeSlider.dateKey, activeSlider.habit, finalVal); 
                  setActiveSlider(prev => ({ ...prev, value: finalVal }));
                }
              }}
            >
              <p className="absolute -top-12 text-white font-black uppercase text-xs tracking-widest whitespace-nowrap drop-shadow-xl z-10">{activeSlider.habit}</p>
              <div id="mastery-slider-track" className="relative w-24 h-64 bg-white/10 rounded-[2.5rem] border-4 border-white/30 overflow-hidden shadow-2xl backdrop-blur-3xl ring-8 ring-white/5 cursor-ns-resize">
                  <div className="absolute bottom-0 w-full bg-white transition-all duration-75 shadow-[0_0_25px_rgba(255,255,255,0.5)]" style={{ height: `${activeSlider.value}%` }} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className={`text-4xl font-black transition-colors ${activeSlider.value >= 47 ? 'text-slate-900' : 'text-white'}`}>
                      {habitConfigs[activeSlider.habit]?.steps > 1 ? Math.round((activeSlider.value / 100) * habitConfigs[activeSlider.habit].steps) : Math.round(activeSlider.value) + '%'}
                    </span>
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border p-8 rounded-[2rem] max-w-sm w-full shadow-2xl text-center`}>
              <div className="bg-rose-500/20 text-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"><TrashIcon /></div>
              <h4 className="text-xl font-black mb-2">Delete Habit?</h4>
              <p className={`text-sm ${getTextMuted()} mb-8 font-medium`}>This will permanently delete data for <span className="text-rose-500 font-bold">"{viewingHabitMap || tempHabitName}"</span>.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteConfirm(false)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>Cancel</button>
                <button onClick={() => deleteHabit(viewingHabitMap || habits[editingHabitIdx])} className="flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest bg-rose-500 text-white shadow-lg shadow-rose-500/20">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Note Editor */}
        {editingNoteDate && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setEditingNoteDate(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl`} onClick={e => e.stopPropagation()}>
              <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-2`}>Daily Reflection</h3>
              <textarea className={`w-full h-40 p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm`} placeholder="Add notes here..." value={trackerData[editingNoteDate]?.note || ""} onChange={(e) => saveNote(editingNoteDate, e.target.value)} />
              <button onClick={() => setEditingNoteDate(null)} className={`w-full mt-4 ${theme === 'dark' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-900 hover:bg-slate-800'} text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl`}>Save Reflection</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glow { 0% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.4); } 50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.8); } 100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.4); } }
        .animate-glow { animation: glow 2s infinite ease-in-out; filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.6)); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: ${theme === 'dark' ? '#0f172a' : '#f1f5f9'}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${theme === 'dark' ? '#334155' : '#cbd5e1'}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${theme === 'dark' ? '#475569' : '#94a3b8'}; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        tr[id^="row-"] { scroll-margin-top: 150px; scroll-margin-bottom: 150px; }
      `}} />
    </div>
  );
}