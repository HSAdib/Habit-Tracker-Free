import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHabitStore } from '../../store/useHabitStore';
import { getSafeKey, parseLocalDate } from '../../utils';

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6"/></svg>
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
const FlameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
);

const AnimatedNumber = ({ value }) => {
  const digits = String(value).split('');
  return (
    <div className="inline-flex items-center overflow-hidden h-[1.2em] leading-[1.2em]">
      {digits.map((digit, idx) => (
        <div key={idx} className="relative w-[1.2ch] h-[1.2em]">
          <motion.div
            animate={{ y: `-${parseInt(digit) * 1.2}em` }}
            transition={{ type: "spring", stiffness: 40, damping: 14 }}
            className="absolute flex flex-col items-center w-full"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div key={n} className="h-[1.2em] flex items-center justify-center">{n}</div>
            ))}
          </motion.div>
        </div>
      ))}
      <span className="ml-0.5">%</span>
    </div>
  );
};

export default function HabitDetailModal({ handleTabRename, setShowDeleteConfirm, toggleArchiveHabit }) {
  const theme = useHabitStore(state => state.theme);
  const trackerData = useHabitStore(state => state.trackerData);
  const viewingHabitMap = useHabitStore(state => state.viewingHabitMap);
  const setViewingHabitMap = useHabitStore(state => state.setViewingHabitMap);
  const habitConfigs = useHabitStore(state => state.habitConfigs);
  const categories = useHabitStore(state => state.categories);
  const habits = useHabitStore(state => state.habits);
  const savePartialToIDB = useHabitStore(state => state.savePartialToIDB);
  const setStorePartial = useHabitStore(state => state.setStorePartial);
  const updateHabitValue = useHabitStore(state => state.updateHabitValue);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEditingTabName, setIsEditingTabName] = useState(false);
  const [tempHabitName, setTempHabitName] = useState("");
  const [tempGoalVal, setTempGoalVal] = useState(1);
  const [activeSlider, setActiveSlider] = useState(null);

  const pointerCaptureRef = useRef(null);
  const longPressTimer = useRef(null);

  const getTextMuted = () => theme === 'dark' ? 'text-slate-500' : 'text-slate-400';

  useEffect(() => {
    if (viewingHabitMap && habitConfigs[viewingHabitMap]) {
      setTempGoalVal(habitConfigs[viewingHabitMap].steps || 1);
    }
  }, [viewingHabitMap, habitConfigs]);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) { days.push(new Date(date)); date.setDate(date.getDate() + 1); }
    return days;
  }, [currentDate]);

  const habitInsights = useMemo(() => {
    if (!viewingHabitMap) return null;

    let monthlyEarned = 0;
    daysInMonth.forEach(day => {
      const key = getSafeKey(day); 
      const valRaw = trackerData[key]?.[viewingHabitMap] ?? 0;
      monthlyEarned += (typeof valRaw === 'number' ? valRaw : (valRaw ? 100 : 0));
    });
    const score = Math.round((monthlyEarned / (daysInMonth.length * 100)) * 100);

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    let checkDate = new Date(today);
    const todayKey = getSafeKey(checkDate);
    const todayValRaw = trackerData[todayKey]?.[viewingHabitMap] ?? 0;
    const todayVal = typeof todayValRaw === 'number' ? todayValRaw : (todayValRaw ? 100 : 0);

    if (Math.round(todayVal) < 100) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const key = getSafeKey(checkDate);
      const valRaw = trackerData[key]?.[viewingHabitMap] ?? 0;
      const val = typeof valRaw === 'number' ? valRaw : (valRaw ? 100 : 0);

      if (Math.round(val) >= 100) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const allDates = Object.keys(trackerData).sort();
    if (allDates.length > 0) {
      const [y, m, d_str] = allDates[0].split('-');
      let d = new Date(parseInt(y), parseInt(m) - 1, parseInt(d_str), 12, 0, 0, 0);
      
      while (d <= today) {
        const key = getSafeKey(d);
        const valRaw = trackerData[key]?.[viewingHabitMap] ?? 0;
        const val = typeof valRaw === 'number' ? valRaw : (valRaw ? 100 : 0);

        if (Math.round(val) >= 100) {
          tempStreak++;
          if (tempStreak > bestStreak) bestStreak = tempStreak;
        } else {
          tempStreak = 0;
        }
        d.setDate(d.getDate() + 1);
      }
    }

    if (currentStreak > bestStreak) bestStreak = currentStreak;

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = getSafeKey(d);
      const valRaw = trackerData[key]?.[viewingHabitMap] ?? 0;
      const val = typeof valRaw === 'number' ? valRaw : (valRaw ? 100 : 0);
      last7Days.push({ 
        label: d.toLocaleDateString(undefined, { weekday: 'narrow' }), 
        pct: val,
        isToday: d.toDateString() === new Date().toDateString(),
        key: key 
      });
    }

    return { 
      score: isNaN(score) ? 0 : score, 
      currentStreak, 
      bestStreak,
      last7Days,
      level: score >= 90 ? "Grandmaster" : score >= 75 ? "Elite" : score >= 50 ? "Adept" : score >= 25 ? "Apprentice" : "Seed" 
    };
  }, [viewingHabitMap, trackerData, daysInMonth]);

  const modalCalendarGrid = useMemo(() => {
    if (!viewingHabitMap) return [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const cells = [];
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      cells.push(new Date(year, month - 1, prevMonthLastDate - i));
    }
    daysInMonth.forEach(day => cells.push(day));
    return cells;
  }, [viewingHabitMap, currentDate, daysInMonth]);

  const getButtonStyles = (val, dateKey) => {
    const localDate = parseLocalDate(dateKey);
    const isToday = new Date().toDateString() === localDate.toDateString();
    const isPast = new Date(localDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
    
    if (!val) {
      const textCol = isToday ? (theme === 'dark' ? 'text-white' : 'text-slate-400') : (isPast ? 'text-red-500' : (theme === 'dark' ? 'text-slate-700' : 'text-slate-300'));
      return theme === 'dark' ? `bg-slate-800 ${textCol} border-slate-700` : `bg-white ${textCol} border-slate-200 hover:bg-slate-50`;
    }
    if (val < 100) return 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-900/20';
    return 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-900/20';
  };

  const handleHabitPressStart = (e, dateKey, habit, currentVal) => {
    if (parseLocalDate(dateKey).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    const startX = e.clientX;
    const startY = e.clientY;

    const val = typeof currentVal === 'number' ? currentVal : (currentVal ? 100 : 0);
    pointerCaptureRef.current = { target: e.currentTarget, pointerId: e.pointerId };
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);

    longPressTimer.current = setTimeout(() => {
      if (pointerCaptureRef.current) {
        try { pointerCaptureRef.current.target.releasePointerCapture(pointerCaptureRef.current.pointerId); } catch (err) {}
        pointerCaptureRef.current = null;
      }
      setActiveSlider({ dateKey, habit, value: val, x: startX, y: startY });
      longPressTimer.current = null;
    }, 450); 
  };

  const handleHabitPressEnd = (e, dateKey, habit, currentVal) => {
    if (parseLocalDate(dateKey).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)) return;
    if (pointerCaptureRef.current) {
      try { pointerCaptureRef.current.target.releasePointerCapture(pointerCaptureRef.current.pointerId); } catch (err) {}
      pointerCaptureRef.current = null;
    }
    if (longPressTimer.current) {
        clearTimeout(longPressTimer.current); 
        longPressTimer.current = null;
        const val = typeof currentVal === 'number' ? currentVal : (currentVal ? 100 : 0);
        updateHabitValue(dateKey, habit, val >= 100 ? 0 : 100);
    }
  };

  useEffect(() => {
    const handleGlobalPointerMove = (e) => {
      if (!activeSlider) return;
      const deltaY = activeSlider.y - e.clientY; 
      const sensitivity = 0.5; 
      let newVal = activeSlider.value + (deltaY * sensitivity);
      if (newVal > 100) newVal = 100;
      if (newVal < 0) newVal = 0;
      setActiveSlider(prev => ({ ...prev, value: newVal, y: e.clientY }));

      const track = document.getElementById('mastery-slider-track');
      if (track) {
          const fill = document.getElementById('mastery-slider-fill');
          const label = document.getElementById('mastery-slider-label');
          if (fill) fill.style.height = `${newVal}%`;
          if (label) {
              const cfg = habitConfigs[activeSlider.habit];
              label.textContent = cfg?.steps > 1 ? Math.round((newVal / 100) * cfg.steps) : Math.round(newVal) + '%';
              label.className = `text-4xl font-black transition-colors ${newVal >= 47 ? 'text-slate-900' : 'text-white'}`;
          }
      }
      
      const barFill = document.getElementById(`bar-fill-${activeSlider.dateKey}`);
      if (barFill && activeSlider.habit === viewingHabitMap) {
          barFill.style.height = `${newVal}%`;
          if (newVal >= 100) {
              barFill.classList.remove('bg-blue-600');
              barFill.classList.add('bg-emerald-500');
          } else {
              barFill.classList.remove('bg-emerald-500');
              barFill.classList.add('bg-blue-600');
          }
      }
    };

    const handleGlobalPointerUp = () => {
      if (activeSlider) {
        updateHabitValue(activeSlider.dateKey, activeSlider.habit, activeSlider.value);
        setActiveSlider(null);
      }
    };

    if (activeSlider) {
      window.addEventListener('pointermove', handleGlobalPointerMove, { passive: false });
      window.addEventListener('pointerup', handleGlobalPointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [activeSlider, habitConfigs, updateHabitValue, viewingHabitMap]);

  if (!viewingHabitMap || !habitInsights) return null;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => { setViewingHabitMap(null); setIsEditingTabName(false); }}>
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className={`rounded-[1.2rem] md:rounded-[2rem] w-[98vw] md:w-full max-w-[720px] h-fit max-h-[85vh] overflow-hidden shadow-2xl flex flex-row transition-colors ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
          
          <div className={`p-2 md:p-5 w-[105px] md:w-60 flex flex-col items-center border-r shrink-0 overflow-hidden ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
            <div className="relative w-14 h-14 md:w-28 md:h-28 flex items-center justify-center mb-2 md:mb-5 shrink-0">
              <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 144 144">
                <circle cx="72" cy="72" r="64" fill="none" stroke={theme==='dark'?'#334155':'#e2e8f0'} strokeWidth="10" />
                <motion.circle initial={{ strokeDashoffset: 402 }} animate={{ strokeDashoffset: 402 - (402 * habitInsights.score / 100) }} transition={{ duration: 1.5, ease: "easeOut" }} cx="72" cy="72" r="64" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray={402} strokeLinecap="round" />
              </svg>
              <div className="flex flex-col items-center"><span className={`text-sm md:text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}><AnimatedNumber value={habitInsights.score} /></span><span className={`text-[5px] md:text-[8px] font-black ${getTextMuted()} uppercase tracking-widest`}>Score</span></div>
            </div>

            <div className={`w-full mb-2 md:mb-5 p-1 md:p-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
              <label className={`text-[5px] md:text-[7px] font-black uppercase ${getTextMuted()} block mb-0.5 text-center`}>Goal Steps</label>
              <input 
                type="number" 
                value={tempGoalVal} 
                onChange={(e) => setTempGoalVal(e.target.value)} 
                onBlur={() => {
                  let val = parseInt(tempGoalVal);
                  if (isNaN(val) || val < 1) val = 1;
                  setTempGoalVal(val);
                  const nc = {
                    ...habitConfigs, 
                    [viewingHabitMap]: {
                      ...(habitConfigs[viewingHabitMap] || {priority: 1, steps: 1}), 
                      steps: val
                    }
                  };
                  setStorePartial({ habitConfigs: nc }); 
                  savePartialToIDB({ habitConfigs: nc });
                }} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur();
                }}
                className={`w-full text-center text-xl font-black p-1 rounded bg-transparent focus:outline-none focus:text-emerald-500 transition-colors`} 
              />
            </div>

            <div className="w-full space-y-1.5 md:space-y-4">
              <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-sm' : 'bg-white border-slate-100 shadow-sm'} py-2 px-2 md:p-4 rounded-xl border flex flex-col items-center text-center transition-all relative overflow-hidden group/rank w-full`}>
                <div className={`mb-1 transition-all duration-500 ${
                  habitInsights.level === "Grandmaster" ? "text-emerald-500 scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" : 
                  habitInsights.level === "Elite" ? "text-blue-500" : 
                  habitInsights.level === "Adept" ? "text-purple-500" : 
                  habitInsights.level === "Apprentice" ? "text-amber-500" : "text-slate-400 opacity-50"
                }`}>
                  <TrophyIcon />
                </div>
                <div>
                  <span className={`text-[6px] md:text-[9px] block uppercase font-black ${getTextMuted()} leading-none mb-0.5`}>Rank</span>
                  <span className={`text-[10px] md:text-xs font-black transition-colors ${
                    habitInsights.level === "Grandmaster" ? "text-emerald-500" : (theme === 'dark' ? 'text-slate-200' : 'text-slate-800')
                  }`}>{habitInsights.level}</span>
                </div>
                
                <div className="flex gap-0.5 mt-2 opacity-30 group-hover/rank:opacity-100 transition-opacity">
                  {['Seed', 'Apprentice', 'Adept', 'Elite', 'Grandmaster'].map((r) => (
                    <div key={r} className={`w-1 h-1 rounded-full ${habitInsights.level === r ? 'bg-emerald-500 scale-125' : 'bg-slate-600'}`} />
                  ))}
                </div>
              </div>

              <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-sm' : 'bg-white border-slate-100 shadow-sm'} py-2 px-2 md:p-3 rounded-xl border flex flex-col items-center text-center transition-colors w-full`}><div className="text-orange-600 scale-75 md:scale-90 mb-1"><FlameIcon /></div><div><span className={`text-[6px] md:text-[9px] block uppercase font-black ${getTextMuted()} leading-none`}>Streak</span><span className={`text-[10px] md:text-xs font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{habitInsights.currentStreak}d</span></div></div>
              <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-sm' : 'bg-white border-slate-100 shadow-sm'} py-2 px-2 md:p-3 rounded-xl border flex flex-col items-center text-center transition-colors ring-2 ring-emerald-500/10 w-full`}><div className="text-yellow-500 scale-75 md:scale-90 mb-1"><TrophyIcon /></div><div><span className={`text-[6px] md:text-[9px] block uppercase font-black ${getTextMuted()} leading-none`}>Best</span><span className={`text-[10px] md:text-xs font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{habitInsights.bestStreak}d</span></div></div>
            </div>

            <div className="flex flex-col gap-1.5 w-full mt-4 md:mt-8">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleArchiveHabit(viewingHabitMap)} title="Archive this habit (hides it from the tracker)" className={`w-full md:flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 px-2 md:px-4 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white border border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-500 hover:text-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7"/><path d="M9 13v-3"/><path d="M15 13v-3"/></svg>
                Archive
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowDeleteConfirm(true)} title="Permanently delete this habit and all its data" className="w-full md:flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 px-2 md:px-4 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20"><TrashIcon /> Delete</motion.button>
            </div>
          </div>

          <div className="flex-1 p-2 md:p-5 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="flex items-start justify-between mb-6 gap-3">
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-1.5 w-full">
                  {isEditingTabName ? (
                    <input autoFocus className={`text-xl font-black bg-transparent focus:outline-none border-b-2 border-emerald-500 text-center w-full max-w-[200px] ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`} value={tempHabitName} onChange={(e) => setTempHabitName(e.target.value)} onBlur={() => handleTabRename(tempHabitName)} onKeyDown={(e) => { if(e.key === 'Enter') handleTabRename(tempHabitName); }} />
                  ) : (
                    <h3 title="Click to rename this habit" className={`text-lg md:text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} leading-tight cursor-pointer hover:text-emerald-500 transition-colors flex items-center justify-center gap-2 group w-full`} onClick={() => { setIsEditingTabName(true); setTempHabitName(viewingHabitMap); }}>
                      {viewingHabitMap}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity"><EditIcon /></span>
                    </h3>
                  )}
                  
                  <select 
                    value={habitConfigs[viewingHabitMap]?.category || 'all'} 
                    onChange={(e) => {
                      const newConfigs = {
                        ...habitConfigs,
                        [viewingHabitMap]: { ...(habitConfigs[viewingHabitMap] || {steps: 1}), category: e.target.value }
                      };
                      setStorePartial({ habitConfigs: newConfigs });
                      savePartialToIDB({ habitConfigs: newConfigs });
                    }}
                    className={`px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer focus:outline-none appearance-none text-center
                      ${theme === 'dark' ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:border-emerald-500' : 'bg-slate-100 text-emerald-600 border-slate-200 hover:border-emerald-400'}`}
                  >
                    <option value="all">Add to category</option>
                    {categories.filter(cat => cat !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className={`flex items-center justify-center gap-1 mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} title="Previous month" className="p-1 hover:text-emerald-500 transition-colors"><ChevronLeftIcon /></button>
                  <span className="text-[10px] font-black uppercase tracking-widest min-w-[80px] text-center">{currentDate.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                  <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} title="Next month" className="p-1 hover:text-emerald-500 transition-colors"><ChevronRightIcon /></button>
                  </div>
              </div>
              <button onClick={() => { setViewingHabitMap(null); setIsEditingTabName(false); }} title="Close (ESC)" className={`p-3 transition-all ${getTextMuted()} hover:text-rose-500 shrink-0`}><XIcon /></button>
            </div>

            <div className={`mb-6 p-2 px-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'} flex items-center gap-4`}>
              <div className="flex items-center gap-2 shrink-0">
                <label className={`text-[8px] font-black uppercase ${getTextMuted()} tracking-widest`}>Priority</label>
                <span className="text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">{habitConfigs[viewingHabitMap]?.priority || 1}x</span>
              </div>
              <input 
                type="range" min="1" max="10" step="1"
                value={habitConfigs[viewingHabitMap]?.priority || 1}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const nc = {
                    ...habitConfigs,
                    [viewingHabitMap]: { ...(habitConfigs[viewingHabitMap] || {steps: 1}), priority: val }
                  };
                  setStorePartial({ habitConfigs: nc });
                  savePartialToIDB({ habitConfigs: nc });
                }}
                className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-all"
              />
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <ActivityIcon className="w-4 h-4 text-slate-400" />
                <p className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-widest`}>Last 7 Days Activity</p>
              </div>
              <div className="grid grid-cols-7 gap-3">
                {habitInsights.last7Days.map((day, i) => {
                  const isLiveDragging = activeSlider?.dateKey === day.key && activeSlider?.habit === viewingHabitMap;
                  const displayPct = isLiveDragging ? activeSlider.value : day.pct;

                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className={`w-full aspect-square rounded-2xl border-2 overflow-hidden relative ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <motion.div 
                          id={`bar-fill-${day.key}`} 
                          initial={{ height: 0 }}
                          animate={{ height: `${displayPct}%` }}
                          transition={{ duration: 0.7, ease: "easeInOut" }}
                          className={`absolute bottom-0 w-full ${displayPct >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                        />
                      </div>
                      <span className={`text-[10px] font-black ${day.isToday ? 'text-emerald-500' : (theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}`}>
                        {day.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <span key={i} className={`text-[10px] font-black ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'} uppercase`}>{day}</span>)}
              {modalCalendarGrid.map((day, idx) => {
                const key = getSafeKey(day); 
                const isOtherMonth = day.getMonth() !== currentDate.getMonth();
                const v = typeof trackerData[key]?.[viewingHabitMap] === 'number' ? trackerData[key]?.[viewingHabitMap] : (trackerData[key]?.[viewingHabitMap] ? 100 : 0);
                const isTodayCell = new Date().toDateString() === day.toDateString();
                const isPassedCell = new Date(day).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
                const config = habitConfigs[viewingHabitMap];
                const stepVal = config?.steps > 1 ? Math.round((v / 100) * config.steps) : null;
                
                return (
                    <motion.div key={idx} whileTap={{ scale: 0.9 }} 
                      onPointerDown={(e) => handleHabitPressStart(e, key, viewingHabitMap, v)} 
                      onPointerUp={(e) => handleHabitPressEnd(e, key, viewingHabitMap, v)} 
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 touch-none select-none ${getButtonStyles(v, key)} ${isTodayCell ? 'ring-2 ring-emerald-400 ring-offset-2' : ''} ${isOtherMonth ? 'opacity-30' : ''}`}>
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

      {activeSlider && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md touch-none select-none"
        >
          <div 
            className="fixed flex flex-col items-center" 
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', position: 'fixed', willChange: 'transform' }} 
          >
            <p className="absolute -top-12 text-white font-black uppercase text-xs tracking-widest whitespace-nowrap drop-shadow-xl z-10">{activeSlider.habit}</p>
            <div id="mastery-slider-track" className="relative w-24 h-64 bg-white/10 rounded-[2.5rem] border-4 border-white/30 overflow-hidden shadow-2xl backdrop-blur-3xl ring-8 ring-white/5 cursor-ns-resize">
                <div 
                  id="mastery-slider-fill"
                  className="absolute bottom-0 w-full bg-white transition-all duration-75 shadow-[0_0_25px_rgba(255,255,255,0.5)]" 
                  style={{ height: `${activeSlider.value}%` }} 
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span 
                    id="mastery-slider-label"
                    className={`text-4xl font-black transition-colors ${activeSlider.value >= 47 ? 'text-slate-900' : 'text-white'}`}
                  >
                    {habitConfigs[activeSlider.habit]?.steps > 1 
                      ? Math.round((activeSlider.value / 100) * habitConfigs[activeSlider.habit].steps) 
                      : Math.round(activeSlider.value) + '%'}
                  </span>
                </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
