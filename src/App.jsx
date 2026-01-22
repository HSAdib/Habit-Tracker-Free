/* Credit: Adib | APM | RU | Bangladesh | email: hasanshahriaradib@gmail.com */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { motion, AnimatePresence, animate } from 'framer-motion';

// --- Icons ---
const TimerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="m7 4 12 8-12 8V4z"/></svg>
);
const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect width="4" height="16" x="6" y="4" rx="1"/><rect width="4" height="16" x="14" y="4" rx="1"/></svg>
);
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);
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
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/> 
  </svg>
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
const SquareTargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="2"/><rect width="12" height="12" x="6" y="6" rx="1.5"/><rect width="4" height="4" x="10" y="10" rx="1"/></svg>
);
const FlameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
);
const ExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-300"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);
const TableRotateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="10" height="14" x="3" y="5" rx="1.5" opacity="0.4"/>
    <rect width="14" height="10" x="7" y="11" rx="1.5" />
    
  </svg>
);
const ImportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
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
const getSafeKey = (date) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const DEFAULT_HABITS = ["sleep 7h", "calisthenics", "meditation", "dept study", "coding", "vocab", "audiobook"];
const DEFAULT_CONFIGS = {
  "sleep 7h": { steps: 1, category: "health" },
  "calisthenics": { steps: 1, category: "health" },
  "meditation": { steps: 1, category: "lifestyle" },
  "dept study": { steps: 1, category: "academic" },
  "coding": { steps: 1, category: "dev" },
  "vocab": { steps: 15, category: "academic" },
  "audiobook": { steps: 1, category: "lifestyle" }
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
  const [tabLayout, setTabLayout] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('adib_habit_layout') || 'square' : 'square'));
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [habitConfigs, setHabitConfigs] = useState(DEFAULT_CONFIGS);
  const [editingHabitName, setEditingHabitName] = useState(null);
  const [tempHabitName, setTempHabitName] = useState("");
  const [viewingHabitMap, setViewingHabitMap] = useState(null);
  const [editingNoteDate, setEditingNoteDate] = useState(null);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('adib_habit_theme') || 'light' : 'light'));
  const [tableOrientation, setTableOrientation] = useState(() => 
    (typeof window !== 'undefined' ? localStorage.getItem('adib_table_orientation') || 'vertical' : 'vertical')
  );
const [showWeeklyModal, setShowWeeklyModal] = useState(false);
const [heatmapFilter, setHeatmapFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adib_habit_categories');
      return saved ? JSON.parse(saved) : ["all", "health", "academic", "dev", "lifestyle"];
    }
    return ["all", "health", "academic", "dev", "lifestyle"];
  });

  const addCategory = () => {
    const name = prompt("Enter new category name:").toLowerCase().trim();
    if (name && !categories.includes(name)) {
      const newCats = [...categories, name];
      setCategories(newCats);
      localStorage.setItem('adib_habit_categories', JSON.stringify(newCats));
    }
  };

  const deleteCategory = (catToDelete) => {
    if (catToDelete === 'all') return;
    if (window.confirm(`Delete category "${catToDelete}"?`)) {
      const newCats = categories.filter(c => c !== catToDelete);
      setCategories(newCats);
      localStorage.setItem('adib_habit_categories', JSON.stringify(newCats));
      
      // এই ক্যাটাগরির হ্যাবিটগুলোকে 'all' ক্যাটাগরিতে পাঠিয়ে দেওয়া
      const newConfigs = { ...habitConfigs };
      Object.keys(newConfigs).forEach(h => {
        if (newConfigs[h].category === catToDelete) {
          newConfigs[h].category = 'all';
        }
      });
      setHabitConfigs(newConfigs);
      if (selectedCategory === catToDelete) setSelectedCategory('all');
      save(trackerData, habits, newConfigs);
    }
  };
  const [activeSlider, setActiveSlider] = useState(null); 
  const [isEditingTabName, setIsEditingTabName] = useState(false);
  const [tableVisibleRows, setTableVisibleRows] = useState(6);
  const [tableHeight, setTableHeight] = useState(484);
  const [tempGoalVal, setTempGoalVal] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Pomodoro States
  const [showPomo, setShowPomo] = useState(false);
  const [pomoWorkTime, setPomoWorkTime] = useState(() => (typeof window !== 'undefined' ? parseInt(localStorage.getItem('adib_pomo_work')) || 25 : 25));
  const [pomoBreakTime, setPomoBreakTime] = useState(() => (typeof window !== 'undefined' ? parseInt(localStorage.getItem('adib_pomo_break')) || 5 : 5));
  const [pomoMode, setPomoMode] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('adib_pomo_mode') || 'work' : 'work'));
  const [pomoActive, setPomoActive] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('adib_pomo_active') === 'true' : false));
  const [pomoTime, setPomoTime] = useState(() => {
    if (typeof window === 'undefined') return 25 * 60;
    const active = localStorage.getItem('adib_pomo_active') === 'true';
    if (active) {
      const end = parseInt(localStorage.getItem('adib_pomo_end_timestamp'));
      const diff = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      return diff;
    }
    const savedLeft = localStorage.getItem('adib_pomo_time_left');
    return savedLeft !== null ? parseInt(savedLeft) : (parseInt(localStorage.getItem('adib_pomo_work')) || 25) * 60;
  });
  const [isEditingPomo, setIsEditingPomo] = useState(false);
  useEffect(() => {
    let interval = null;
    if (pomoActive && pomoTime > 0) {
      const storedEnd = parseInt(localStorage.getItem('adib_pomo_end_timestamp'));
      const activeState = localStorage.getItem('adib_pomo_active') === 'true';
      const endTimestamp = (activeState && storedEnd > Date.now()) ? storedEnd : Date.now() + pomoTime * 1000;
      
      localStorage.setItem('adib_pomo_end_timestamp', endTimestamp);
      localStorage.setItem('adib_pomo_active', 'true');
      localStorage.setItem('adib_pomo_mode', pomoMode);

      interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((endTimestamp - Date.now()) / 1000));
        setPomoTime(remaining);
        if (remaining <= 0) {
          // পপ-আপ দেখানোর আগেই টাইমারটি বন্ধ করে দিচ্ছি যাতে এটি আর দ্বিতীয়বার ট্রিগার না হয়
          clearInterval(interval); 
          setPomoActive(false);
          localStorage.setItem('adib_pomo_active', 'false');
          localStorage.setItem('adib_pomo_time_left', '0');
          
          // সামান্য বিলম্ব করে পপ-আপ দেখাচ্ছি যাতে UI আপডেট হওয়ার সুযোগ পায়
          setTimeout(() => {
            triggerNotification();
            alert(pomoMode === 'work' ? "Work session done! Take a break." : "Break over! Back to work.");
          }, 100);
        }
      }, 1000);
    } else {
      if (pomoActive && pomoTime === 0) {
        setPomoActive(false);
        localStorage.setItem('adib_pomo_active', 'false');
        triggerNotification();
        alert(pomoMode === 'work' ? "Work session done! Take a break." : "Break over! Back to work.");
      }
      localStorage.setItem('adib_pomo_active', 'false');
      localStorage.setItem('adib_pomo_time_left', pomoTime);
    }
    return () => { if(interval) clearInterval(interval); };
  }, [pomoActive, pomoMode]);

  const formatPomoTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  
  const longPressTimer = useRef(null);
  const scrollContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const triggerNotification = () => {
    // Vibration: ৫শ' মিলি-সেকেন্ড ভাইব্রেশন (অ্যান্ড্রয়েড ডিভাইসের জন্য)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([500, 200, 500]);
    }
    
    // Web Audio API Beep: কোনো অডিও ফাইল ছাড়াই সাউন্ড তৈরি
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 নোট
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1);
    } catch (e) {
      console.log("Audio notification failed:", e);
    }
  };

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

  const toggleTableOrientation = () => {
    const next = tableOrientation === 'vertical' ? 'horizontal' : 'vertical';
    setTableOrientation(next);
    localStorage.setItem('adib_table_orientation', next);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
  if (viewingHabitMap) {
    setTempGoalVal(habitConfigs[viewingHabitMap]?.steps || 1);
  }
}, [viewingHabitMap, habitConfigs]);

  // Auto-scroll to today
  useEffect(() => {
    const scrollToToday = () => {
      const todayKey = getSafeKey(new Date());
      const container = scrollContainerRef.current;
      if (!container) return;

      if (tableOrientation === 'vertical') {
        const element = document.getElementById(`row-${todayKey}`);
        if (element) {
          container.scrollTo({ top: element.offsetTop - 144, behavior: 'smooth' });
        }
      } else {
        const element = document.getElementById(`col-${todayKey}`);
        if (element) {
          // Today-কে ৩য় কলামে দেখানোর জন্য ২টা কলামের জায়গা (colWidth * 2) আগে থেকে স্ক্রল করা
          const colWidth = element.offsetWidth;
          container.scrollTo({ 
            left: element.offsetLeft - 120 - (colWidth * 2), 
            behavior: 'smooth' 
          });
        }
      }
    };
    const timer = setTimeout(scrollToToday, 600);
    const handleTableScroll = () => {
      if (scrollContainerRef.current && tableOrientation === 'vertical') {
        const { scrollTop, scrollHeight } = scrollContainerRef.current;
        const container = scrollContainerRef.current;
        
        const headerHeight = 72;
        const rowHeight = 72;
        const spacerHeight = 216;
        const dataContentHeight = scrollHeight - spacerHeight;
        
        // --- NEW: THE STOP LOGIC ---
        // We want to stop scrolling when the 31st row (the end of dataContentHeight)
        // is at the bottom of a 3-row view (header + 3 rows).
        const minHeightLimit = (3 * rowHeight) + headerHeight; // 268px
        const stopScrollAt = dataContentHeight - minHeightLimit;

        if (scrollTop > stopScrollAt) {
          container.scrollTop = stopScrollAt;
          setTableHeight(minHeightLimit);
          setTableVisibleRows(3);
          return;
        }
        // ---------------------------

        const remainingDataHeight = dataContentHeight - scrollTop;
        const maxHeightLimit = (6 * rowHeight) + headerHeight; // 484px

        let targetHeight = remainingDataHeight;
        if (targetHeight > maxHeightLimit) targetHeight = maxHeightLimit;
        if (targetHeight < minHeightLimit) targetHeight = minHeightLimit;

        setTableHeight(targetHeight);

        const calculatedRows = Math.max(3, Math.min(6, Math.ceil((targetHeight - headerHeight) / rowHeight)));
        if (calculatedRows !== tableVisibleRows) {
          setTableVisibleRows(calculatedRows);
        }
      }
    };
const container = scrollContainerRef.current;
if (container) container.addEventListener('scroll', handleTableScroll);
return () => {
  clearTimeout(timer);
  if (container) container.removeEventListener('scroll', handleTableScroll);
};
    return () => clearTimeout(timer);
  }, [currentDate, habits, tableOrientation]);

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
  const handleDashboardRename = (oldName) => {
    const newName = tempHabitName.trim();
    if (newName === oldName) { setEditingHabitName(null); return; }
    if (!newName) { 
      setShowDeleteConfirm(true); 
      // Ekhane setEditingHabitName(null) kora hobena jate delete button habit name-ti pay
    } else { 
      executeRename(oldName, newName); 
      setEditingHabitName(null);
    }
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
    newConfigs[newName] = newConfigs[oldName] || { steps: 1 };
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
    if (!name) return;
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
    setEditingHabitName(null); // Cleanup
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
    const updatedDay = { ...(trackerData[dateKey] || {}), [habit]: val };
    const newTrackerData = { ...trackerData, [dateKey]: updatedDay };
    
    let earned = 0;
    habits.forEach(h => {
      const v = typeof updatedDay[h] === 'number' ? updatedDay[h] : (updatedDay[h] ? 100 : 0);
      earned += (v / 100);
    });
    
    if (Math.round((earned / habits.length) * 100) === 100) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      s.onload = () => window.confetti({ 
        particleCount: 150, 
        spread: 80, 
        origin: { y: 0.6 }, 
        colors: ['#10b981', '#3b82f6', '#10b981', '#ffffff'] 
      });
      document.head.appendChild(s);
    }

    setTrackerData(newTrackerData);
    save(newTrackerData, habits, habitConfigs);
  };
  const handleExport = () => {
    const data = {
      trackerData,
      habits,
      habitConfigs,
      version: 'v9',
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habit-mastery-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.trackerData && imported.habits) {
          setTrackerData(imported.trackerData);
          setHabits(imported.habits);
          setHabitConfigs(imported.habitConfigs || {});
          save(imported.trackerData, imported.habits, imported.habitConfigs || {});
          alert("Data imported successfully!");
        }
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  // Slider Interaction
  const handleHabitPressStart = (e, dateKey, habit, currentVal) => {
    if (new Date(dateKey).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    
    const startX = e.clientX;
    const startY = e.clientY;

    const val = typeof currentVal === 'number' ? currentVal : (currentVal ? 100 : 0);
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);

    longPressTimer.current = setTimeout(() => {
      setActiveSlider({ 
        dateKey, habit, value: val, 
        x: startX, y: startY 
      });
      longPressTimer.current = null;
    }, 450); 
  };

  const handleHabitPressEnd = (e, dateKey, habit, currentVal) => {
    if (new Date(dateKey).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)) return;
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

  const xpStats = useMemo(() => {
    let totalXP = 0;
    Object.keys(trackerData).forEach(dateKey => {
      habits.forEach(habit => {
        const val = trackerData[dateKey]?.[habit] ?? 0;
        // Standardized: (Percentage / 100) * 10 XP
        totalXP += (val / 100) * 10;
      });
    });
    
    // Growth logic: Level 2 at 100 XP, Level 3 at 400 XP, etc.
    const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;
    const currentLevelXP = Math.pow(level - 1, 2) * 100;
    const nextLevelXP = Math.pow(level, 2) * 100;
    const progressXP = totalXP - currentLevelXP;
    const requiredXP = nextLevelXP - currentLevelXP;
    const progressPct = requiredXP > 0 ? Math.min(100, Math.round((progressXP / requiredXP) * 100)) : 0;
    
    return { 
      level, 
      totalXP: Math.round(totalXP), 
      progressPct, 
      requiredXP: Math.round(requiredXP), 
      progressXP: Math.round(progressXP) 
    };
  }, [trackerData, habits, habitConfigs]);;

  const analytics = useMemo(() => {
    let totalEarnedWeight = 0; let totalPossibleWeight = 0; let noteCount = 0; const stats = {};
    daysInMonth.forEach(day => {
      const key = getSafeKey(day); const dayData = trackerData[key] || {};
      if (dayData.note && dayData.note.trim() !== "") noteCount++;
      habits.forEach(h => {
        const raw = dayData[h] ?? 0; const val = typeof raw === 'number' ? raw : (raw ? 100 : 0);
        stats[h] = (stats[h] || 0) + val; 
        totalEarnedWeight += (val / 100);
        totalPossibleWeight += 1;
      });
    });
    const monthlyPct = totalPossibleWeight > 0 ? Math.round((totalEarnedWeight / totalPossibleWeight) * 100) : 0;
    const habitPcts = {};
    habits.forEach(h => { habitPcts[h] = Math.round(((stats[h] || 0) / (daysInMonth.length * 100)) * 100) || 0; });
    return { habitPcts, monthlyPct, totalDone: Math.round(totalEarnedWeight), noteCount };
  }, [daysInMonth, trackerData, habits, habitConfigs]);
      const weeklySummary = useMemo(() => {
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(getSafeKey(d));
    }

    const weeklyStats = habits.map(habit => {
      let earned = 0;
      last7Days.forEach(date => {
        const val = trackerData[date]?.[habit] ?? 0;
        earned += (val / 100);
      });
      return { name: habit, score: Math.round((earned / 7) * 100) };
    });

    const topHabits = [...weeklyStats].sort((a, b) => b.score - a.score).slice(0, 3);
    const avgScore = habits.length > 0 ? Math.round(weeklyStats.reduce((acc, h) => acc + h.score, 0) / habits.length) : 0;

    return { topHabits, avgScore };
  }, [trackerData, habits]);
  const habitInsights = useMemo(() => {
    if (!viewingHabitMap) return null;

    let monthlyEarned = 0;
    daysInMonth.forEach(day => {
      const key = getSafeKey(day); 
      const valRaw = trackerData[key]?.[viewingHabitMap] ?? 0;
      monthlyEarned += (typeof valRaw === 'number' ? valRaw : (valRaw ? 100 : 0));
    });
    const score = Math.round((monthlyEarned / (daysInMonth.length * 100)) * 100);

    const allDates = Object.keys(trackerData).sort();
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    if (allDates.length > 0) {
      const firstDate = new Date(allDates[0]);
      const today = new Date();
      let d = new Date(firstDate);

      while (d <= today) {
        const key = getSafeKey(d);
        const valRaw = trackerData[key]?.[viewingHabitMap] ?? 0;
        const val = typeof valRaw === 'number' ? valRaw : (valRaw ? 100 : 0);

        if (val >= 70) {
          tempStreak++;
          if (tempStreak > bestStreak) bestStreak = tempStreak;
        } else {
          tempStreak = 0;
        }
        d.setDate(d.getDate() + 1);
      }
      
      let checkDate = new Date();
      while (true) {
        const key = getSafeKey(checkDate);
        const valRaw = trackerData[key]?.[viewingHabitMap] ?? 0;
        const val = typeof valRaw === 'number' ? valRaw : (valRaw ? 100 : 0);
        if (val >= 70) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // --- New Last 7 Days Logic for specific habit ---
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
        key: key // Added this to track the live slider
      });
    }

    return { 
      score, 
      currentStreak, 
      bestStreak,
      last7Days,
      level: score >= 90 ? "Grandmaster" : score >= 75 ? "Elite" : score >= 50 ? "Adept" : score >= 25 ? "Apprentice" : "Seed" 
    };
  }, [viewingHabitMap, trackerData, daysInMonth]);

  const heatmapConfig = useMemo(() => {
    const year = currentDate.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1).getDay(); 
    const cells = Array(firstDayOfYear).fill(null); 
    const daysInYear = (((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) ? 366 : 365);
    
    for (let i = 0; i < daysInYear; i++) {
      const d = new Date(year, 0, 1, 12); d.setDate(d.getDate() + i); const key = getSafeKey(d);
      let intensity = 0;

      if (heatmapFilter === 'all') {
        let totalPct = 0; 
        habits.forEach(h => { 
          const r = trackerData[key]?.[h] ?? 0; 
          totalPct += typeof r === 'number' ? r : (r ? 100 : 0); 
        });
        const avg = habits.length > 0 ? totalPct / (habits.length * 100) : 0;
        intensity = avg === 0 ? 0 : avg <= 0.25 ? 1 : avg <= 0.5 ? 2 : avg <= 0.75 ? 3 : 4;
      } else {
        const r = trackerData[key]?.[heatmapFilter] ?? 0;
        const val = typeof r === 'number' ? r : (r ? 100 : 0);
        const ratio = val / 100;
        intensity = ratio === 0 ? 0 : ratio <= 0.25 ? 1 : ratio <= 0.5 ? 2 : ratio <= 0.75 ? 3 : 4;
      }
      cells.push({ date: d, key, intensity });
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
  }, [currentDate, trackerData, habits, heatmapFilter]);

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

  const currentMonthNotes = useMemo(() => {
    return daysInMonth.map(d => ({ date: d, key: getSafeKey(d), note: trackerData[getSafeKey(d)]?.note })).filter(e => e.note && e.note.trim() !== "");
  }, [daysInMonth, trackerData]);

  // Styling Helpers
  const getButtonStyles = (val, dateKey) => {
    const isToday = new Date().toDateString() === new Date(dateKey).toDateString();
    const isPast = new Date(dateKey).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
    
    if (!val) {
      const textCol = isToday ? (theme === 'dark' ? 'text-white' : 'text-slate-400') : (isPast ? 'text-red-500' : (theme === 'dark' ? 'text-slate-700' : 'text-slate-300'));
      return theme === 'dark' ? `bg-slate-800 ${textCol} border-slate-700` : `bg-white ${textCol} border-slate-200 hover:bg-slate-50`;
    }
    if (val < 100) return 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-900/20';
    return 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-900/20';
  };
  const getLevelBadgeStyle = (level) => {
    const schemes = [
      'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      'bg-blue-500/10 text-blue-400 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
      'bg-purple-500/10 text-purple-400 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
      'bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
      'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
      'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
      'bg-indigo-500/10 text-indigo-400 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.3)]',
      'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.3)]',
      'bg-orange-500/10 text-orange-400 border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.3)]',
      'bg-teal-500/10 text-teal-400 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.3)]'
    ];
    return schemes[(level - 1) % schemes.length];
  };
  const getContainerBg = () => theme === 'dark' ? 'bg-black text-white' : 'bg-white text-slate-900';
  const getCardStyle = () => theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-sm' : 'bg-white border-slate-200 shadow-sm';
  const getTextMuted = () => theme === 'dark' ? 'text-slate-500' : 'text-slate-400';
  const getTableHeadStyle = () => theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200';

  const CELL_SIZE = isMobile ? 9 : 11;
  const CELL_GAP = isMobile ? 2 : 3;

 return (
    <div className={`min-h-screen ${getContainerBg()} font-sans pb-6 md:pb-20 select-none overflow-x-hidden`}>
      <Analytics />
      
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto px-2 md:px-4 pt-8 flex flex-col min-h-screen">
        <div className="flex-grow">
          {/* Dashboard Header */}
          <motion.div variants={itemVariants} className={`flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-6 ${getCardStyle()} p-6 rounded-[2.5rem] border transition-colors relative overflow-hidden`}>
            <div className="flex items-center gap-4 z-10">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg animate-glow"><ZapIcon /></motion.div>
              <div>
                <h1 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight leading-none`}>Habit Mastery</h1>
                <div className="flex items-center gap-3 mt-2">
                  <div onClick={toggleTheme} className={`group relative w-12 h-6 flex items-center rounded-full cursor-pointer transition-all duration-500 shadow-inner ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <motion.div 
                      layout 
                      className="absolute w-4 h-4 rounded-full shadow-md z-10 flex items-center justify-center bg-white" 
                      style={{ left: theme === 'dark' ? '28px' : '4px' }} 
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
                    </motion.div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const next = tabLayout === 'square' ? 'circle' : 'square';
                        setTabLayout(next);
                        localStorage.setItem('adib_habit_layout', next);
                      }}
                      className={`p-1.5 rounded-lg transition-all border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-emerald-400' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-emerald-600'}`}
                      title="Switch Habit Tabs Layout"
                    >
                      {tabLayout === 'square' ? <TargetIcon /> : <SquareTargetIcon />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all duration-500 ${getLevelBadgeStyle(xpStats.level)}`}>
  Level {xpStats.level}
</span>
  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]" title="Total Full Wins">
    <TrophyIcon className="w-2.5 h-2.5 text-yellow-500" />
    <span className="text-[9px] font-black text-yellow-500">{analytics.totalDone}</span>
  </div>
</div>
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

            {/* Neon Pomodoro Button in Top Right Spot */}
            <div className="absolute top-6 right-8 z-20 flex flex-col items-center">
              <div className="tooltip-trigger tooltip-left">
                <button 
                  onClick={() => setShowPomo(true)} 
                  className={`p-2.5 rounded-xl transition-all relative border 
                    ${pomoActive 
                      ? 'bg-emerald-500/30 text-emerald-400 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.6)] filter drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                      : (theme === 'dark' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.4)] filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.2)] filter drop-shadow-[0_0_5px_rgba(16,185,129,0.2)]')
                    }`}
                >
                  <TimerIcon />
                  {pomoActive && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                    </span>
                  )}
                </button>
                <span className="tooltip-content">Pomodoro Timer</span>
              </div>
              {pomoActive && !showPomo && (
                <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={`text-[10px] font-black mt-1.5 tabular-nums tracking-tighter drop-shadow-md ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {formatPomoTime(pomoTime)}
                </motion.span>
              )}
            </div>

            {/* Month Ribbon with Far-Right Alignment */}
            <div className={`flex items-center justify-between ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'} rounded-xl p-1 border transition-colors z-10 w-full lg:w-auto`}>
              {/* Quick Weekly Summary Trigger */}
<motion.button 
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => setShowWeeklyModal(true)}
  className={`mr-2 px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-all ${theme === 'dark' ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm'}`}
>
  <div className="flex flex-col items-start leading-none">
    <span className="text-[7px] font-black uppercase tracking-tighter opacity-70">Weekly Avg</span>
    <span className="text-xs font-black">{weeklySummary.avgScore}%</span>
  </div>
  <TrophyIcon className={weeklySummary.avgScore >= 80 ? "animate-bounce" : ""} />
</motion.button>

<div className={`w-px h-6 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
              {/* Left Side: Date Navigation Group */}
              <div className="flex items-center">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-white text-slate-600'} rounded-lg transition-all`}><ChevronLeftIcon /></motion.button>
                <span className={`px-2 md:px-4 font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'} min-w-[110px] md:min-w-[140px] text-center text-xs md:text-sm`}>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-white text-slate-600'} rounded-lg transition-all`}><ChevronRightIcon /></motion.button>
                </div>

              {/* Right Side: Data Safety Group with CSS Tooltips */}
              <div className="flex items-center gap-1 ml-auto">
                
                <div className={`w-px h-6 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
                
                {/* Export Button with Tooltip */}
                <div className="tooltip-trigger">
                  <button onClick={handleExport} className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-700 hover:text-emerald-400' : 'text-slate-500 hover:bg-white hover:text-emerald-600'}`}>
                    <ExportIcon />
                  </button>
                  <span className="tooltip-content">Export JSON</span>
                </div>

                {/* Import Button with Tooltip */}
                <div className="tooltip-trigger">
                  <label className={`p-2 rounded-lg transition-all cursor-pointer ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-700 hover:text-blue-400' : 'text-slate-500 hover:bg-white hover:text-blue-600'}`}>
                    <ImportIcon />
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                  <span className="tooltip-content">Import JSON</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Section */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8 items-stretch">
            <motion.div variants={itemVariants} className={`col-span-2 ${getCardStyle()} p-3 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border overflow-hidden flex flex-col transition-colors h-full min-w-0`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2 md:gap-4">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex items-center gap-2">
  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all duration-500 shrink-0 bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
  Activity Heatmap
</span>
  <select 
    value={heatmapFilter} 
    onChange={(e) => setHeatmapFilter(e.target.value)}
    className={`ml-1 text-[9px] font-black uppercase bg-transparent border-none focus:outline-none cursor-pointer transition-colors ${theme === 'dark' ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}
  >
    <option value="all" className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>Overall</option>
    {habits.map(h => (
      <option key={h} value={h} className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>{h}</option>
    ))}
  </select>
</div>
                  <div className="flex items-center gap-1.5 md:gap-3 overflow-hidden pl-2 md:pl-4">
  <motion.button whileHover={{ y: -2 }} onClick={() => setShowAllNotes(true)} className={`flex items-center gap-1 transition-all p-0.5 rounded-lg ${theme === 'dark' ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-50/50'}`}>
    <NoteIcon />
    <span className={`text-[10px] md:text-xs font-black`}>{analytics.noteCount}</span>
  </motion.button>
</div>
                </div>
              </div>
              
              <div className={`overflow-x-auto custom-scrollbar pb-2 ${isMobile ? 'whitespace-nowrap' : ''}`}>
                <div className="inline-block min-w-full">
                  <div className="relative h-3 mb-1" style={{ marginLeft: `${isMobile ? 16 : 24}px` }}>
  {heatmapConfig.monthLabels.map((m, idx) => (
    <span key={idx} className={`absolute text-[7px] md:text-[8px] font-black ${getTextMuted()} uppercase tracking-tighter text-left`} style={{ left: `${m.weekIndex * (CELL_SIZE + CELL_GAP)}px` }}>
      {m.label}
    </span>
  ))}
</div>
<div className="flex gap-1 md:gap-2">
  <div className="grid grid-rows-7 gap-[2px] md:gap-[3px] text-[6px] md:text-[7px] font-black opacity-60 uppercase tracking-tighter text-slate-500 w-3 md:w-4 shrink-0 text-right pr-1" style={{ height: `${7 * CELL_SIZE + 6 * CELL_GAP}px`, lineHeight: `${CELL_SIZE}px` }}>
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
              <div className="flex items-center mb-2 md:mb-4">
  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20" title="Mastery Score">
    <TargetIcon className="text-emerald-500" />
    <span className={`text-[10px] md:text-xs font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
      {analytics.monthlyPct}%
    </span>
  </div>
  <div className="ml-auto scale-75 md:scale-100 flex items-center justify-center px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20" title="Activity Trend">
    <ActivityIcon className="text-emerald-500" />
  </div>
</div>
              <div className="flex-grow flex items-center h-16 md:h-28 w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="greenTrendShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* The Shadow Fill */}
                  <motion.path 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 2 }} 
                    d={`${solveFluidPath(trendPoints)} L 100,100 L 0,100 Z`} 
                    fill="url(#greenTrendShadow)" 
                  />
                  {/* The Main Line */}
                  <motion.path 
                    initial={{ pathLength: 0 }} 
                    animate={{ pathLength: 1 }} 
                    transition={{ duration: 2 }} 
                    d={solveFluidPath(trendPoints)} 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                  />
                </svg>
              </div>
              <div className={`flex justify-between mt-1 md:mt-2 px-1 text-[6px] md:text-[8px] font-black ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'} uppercase tracking-widest`}>
                <span>START</span><span>END</span>
              </div>
            </motion.div>
          </div>
<div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
  {categories.map(cat => (
    <div key={cat} className="relative group shrink-0">
      <button
        onClick={() => setSelectedCategory(cat)}
        className={`pl-4 ${cat === 'all' ? 'pr-4' : 'pr-8'} py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
          selectedCategory === cat 
            ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
            : (theme === 'dark' ? 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-500' : 'bg-slate-100 text-slate-400 border-slate-200 hover:border-slate-300')
        }`}
      >
        {cat}
      </button>
      {cat !== 'all' && (
        <button 
          onClick={(e) => { e.stopPropagation(); deleteCategory(cat); }}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-all hover:bg-rose-500 hover:text-white ${selectedCategory === cat ? 'text-white/70' : 'text-slate-500'}`}
          title="Delete Category"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      )}
    </div>
  ))}
  <button 
    onClick={addCategory} 
    className={`p-1.5 rounded-full border border-dashed shrink-0 transition-all ${theme === 'dark' ? 'border-slate-700 text-slate-600 hover:text-emerald-500' : 'border-slate-300 text-slate-300 hover:text-emerald-500'}`}
    title="Add New Category"
  >
    <PlusIcon />
  </button>
</div>
          {/* Updated Habit Cards Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3 mb-8">
            <AnimatePresence mode='popLayout'>
{habits.filter(h => selectedCategory === 'all' || habitConfigs[h]?.category === selectedCategory).map((habit, idx) => {
  const isCircle = tabLayout === 'circle';
  const pct = analytics.habitPcts[habit] ?? 0;
  const isEditing = editingHabitName === habit;
  return (
    <motion.div 
      layout 
      variants={itemVariants} 
      whileHover={{ y: -5, scale: isCircle ? 1.05 : 1 }} 
      key={habit} 
      className={`${getCardStyle()} cursor-pointer overflow-hidden group transition-all relative flex flex-col items-center justify-center
        ${isCircle ? 'rounded-full aspect-square border-0' : 'p-2 rounded-2xl border min-h-[100px] hover:shadow-lg'}`} 
      onClick={() => setViewingHabitMap(habit)}
    >
      <svg 
        className={`absolute transition-all duration-500 -rotate-90 ${isCircle ? 'inset-0 w-full h-full p-1' : 'bottom-2 w-20 h-20'}`} 
        viewBox={isCircle ? "0 0 100 100" : "0 0 60 60"}
      >
        <circle cx={isCircle ? "50" : "30"} cy={isCircle ? "50" : "30"} r={isCircle ? "47" : "23"} fill="none" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} strokeWidth={isCircle ? "4" : "4.5"} />
        <motion.circle 
          cx={isCircle ? "50" : "30"} cy={isCircle ? "50" : "30"} r={isCircle ? "47" : "23"} fill="none" stroke="#10b981" strokeWidth={isCircle ? "4" : "4.5"} 
          strokeDasharray={isCircle ? 295.3 : 145} initial={{ strokeDashoffset: isCircle ? 295.3 : 145 }} 
          animate={{ strokeDashoffset: (isCircle ? 295.3 : 145) - ((isCircle ? 295.3 : 145) * pct / 100) }} 
          transition={{ duration: 1, ease: "easeInOut" }} strokeLinecap="round" 
        />
      </svg>
      
      {isCircle ? (
        <div className="z-10 text-center flex flex-col items-center px-2 w-full relative">
          {isEditing ? (
            <input autoFocus className={`text-[8px] font-bold w-full text-center bg-transparent focus:outline-none border-b-2 border-emerald-500 mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`} value={tempHabitName} onChange={(e) => setTempHabitName(e.target.value)} onBlur={() => handleDashboardRename(habit)} onKeyDown={(e) => e.key === 'Enter' && handleDashboardRename(habit)} onClick={(e) => e.stopPropagation()} />
          ) : (
            <div className="relative flex items-center justify-center w-full group/name min-h-[14px]">
              <p className="text-[clamp(7px,2.2vw,14px)] sm:text-[11px] md:text-sm font-black uppercase opacity-80 leading-[1.1] line-clamp-2 text-center w-full px-1 break-words">{habit}</p>
              <button className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-emerald-500 transition-all absolute right-0" onClick={(e) => { e.stopPropagation(); setEditingHabitName(habit); setTempHabitName(habit); }}><EditIcon /></button>
            </div>
          )}
          <span className={`text-[19px] font-black mt-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
            <AnimatedNumber value={pct} />
          </span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1 mb-0.5 w-full justify-center px-1 min-h-[40px] flex-grow">
              {isEditing ? (
                <input autoFocus className={`text-[10px] font-bold w-full text-center bg-transparent focus:outline-none border-b-2 border-emerald-500 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`} value={tempHabitName} onChange={(e) => setTempHabitName(e.target.value)} onBlur={() => handleDashboardRename(habit)} onKeyDown={(e) => e.key === 'Enter' && handleDashboardRename(habit)} onClick={(e) => e.stopPropagation()} />
              ) : (
                <div className="relative flex items-center justify-center w-full">
                  <p className={`text-[clamp(9px,2vw,16px)] sm:text-sm md:text-base font-black ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} uppercase line-clamp-2 break-words text-center leading-[1.1] px-1`}>{habit}</p>
                  <button className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-300 hover:text-emerald-500 transition-all absolute right-0" onClick={(e) => { e.stopPropagation(); setEditingHabitName(habit); setTempHabitName(habit); }}><EditIcon /></button>
                </div>
              )}
          </div>
          <div className="w-20 h-20 flex items-center justify-center mt-auto relative z-10 pt-2">
   <span className={`text-[19px] font-black leading-none ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
     <AnimatedNumber value={pct} />
   </span>
</div>
        </>
      )}
    </motion.div>
  );
})}
</AnimatePresence>
<motion.button layout whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {
    const name = `Habit ${habits.length + 1}`; 
    const categoryToAssign = selectedCategory === 'all' ? 'all' : selectedCategory; 
    const newHabits = [...habits, name]; 
    const newConfigs = {...habitConfigs, [name]: { steps: 1, category: categoryToAssign }};
    setHabits(newHabits); 
    setHabitConfigs(newConfigs); 
    save(trackerData, newHabits, newConfigs); 
    setEditingHabitName(name); 
    setTempHabitName(name);
  }}
  className={`${getCardStyle()} flex items-center justify-center border-2 border-dashed transition-all ${tabLayout === 'circle' ? 'rounded-full aspect-square' : 'p-2 rounded-2xl min-h-[100px]'} ${theme === 'dark' ? 'border-slate-800 text-slate-700 hover:border-emerald-700' : 'border-slate-200 text-slate-300 hover:border-emerald-400'}`}>
  <PlusIcon />
</motion.button>
          </motion.div>
{/* Weekly Summary Popup Modal */}
        {showWeeklyModal && (
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

                <div className="col-span-2 space-y-3">
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
        )}
          {/* Table Log */}
<motion.div variants={itemVariants} className={`${getCardStyle()} rounded-[2.5rem] overflow-hidden mb-8 relative transition-colors`}>
    
    <div 
  ref={scrollContainerRef} 
  className={`overflow-x-auto overflow-y-auto custom-scrollbar ${isMobile ? 'whitespace-nowrap' : ''}`}
  style={{ 
    maxHeight: tableOrientation === 'vertical' ? `${tableHeight}px` : 'none',
    willChange: tableOrientation === 'vertical' ? 'max-height' : 'auto'
  }}
>
        <table className={`w-full border-separate border-spacing-0 min-w-full ${tableOrientation === 'vertical' ? 'table-fixed' : 'table-auto'}`}>
            {tableOrientation === 'vertical' ? (
                /* --- Table 1: Vertical Layout --- */
                <>
                    <thead className={`sticky top-0 z-30 shadow-sm ${getTableHeadStyle()} border-b transition-colors`}>
                        <tr className="h-[72px]">
                            <th className={`p-5 font-black ${getTextMuted()} text-[9px] uppercase tracking-widest sticky top-0 left-0 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border-r w-[120px] min-w-[120px] z-40 text-center`}>
                              
                              
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={toggleTableOrientation} className={`p-1 rounded-md transition-all ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`} title="Switch to Horizontal View">
                                  <TableRotateIcon />
                                </button>
                                <span>DATE Log</span>
                              </div>
                            </th>

                            {habits.map((h, i) => <th key={i} className={`p-2 border-r ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-600'} text-[12px] uppercase text-center font-black transition-colors`}><div className="px-1 leading-tight break-words" title={h}>{h}</div></th>)}
                            <th className={`p-4 font-black text-emerald-600 text-[14px] sticky top-0 right-0 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border-l w-[100px] z-40 text-center`}>Efficiency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daysInMonth.map((day) => {
                            const key = getSafeKey(day); const dayData = trackerData[key] || {};
                            let totalEarnedWeight = 0; let totalPossibleWeight = 0;
                            habits.forEach(h => { 
                                const val = typeof dayData[h] === 'number' ? dayData[h] : (dayData[h] ? 100 : 0);
                                totalEarnedWeight += (val / 100);
                                totalPossibleWeight += 1;
                            });
                            const progress = totalPossibleWeight > 0 ? Math.round((totalEarnedWeight / totalPossibleWeight) * 100) : 0;
                            const isToday = new Date().toDateString() === day.toDateString();
                            const rowBgStyle = isToday 
  ? (theme === 'dark' ? 'bg-emerald-900/40 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-emerald-50 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]') 
  : (theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100');
                            return (
                                <tr key={key} id={`row-${key}`} className="h-[72px]">
                                    <td className={`p-2 sticky left-0 z-10 border-r border-b transition-all duration-500 ${rowBgStyle} ${isToday ? 'border-l-4 border-l-emerald-500' : ''}`}>

                                        <div className="flex items-center justify-center gap-3">
                                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setEditingNoteDate(key)} className={`p-2 rounded-xl transition-all ${dayData.note ? 'bg-blue-600 text-white shadow-md' : (theme === 'dark' ? 'bg-slate-800 text-slate-600 hover:bg-slate-700' : 'bg-slate-100 text-slate-300 hover:bg-slate-200')}`} title="Add reflection note"><NoteIcon /></motion.button>
                                            <div className="flex flex-col text-center"><span className={`text-[8px] uppercase opacity-80 leading-none ${theme === 'dark' ? 'text-slate-500' : ''}`}>{day.toLocaleDateString(undefined, { weekday: 'short' })}</span><span className={`text-sm font-black mt-0.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{day.getDate()}</span></div>
                                        </div>
                                    </td>
                                    {habits.map((h, i) => {
                                        const rawVal = dayData[h] ?? 0; const val = typeof rawVal === 'number' ? rawVal : (rawVal ? 100 : 0);
                                        return (
                                            <td key={i} className={`p-2 border-r border-b transition-all duration-500 text-center ${rowBgStyle} ${isToday ? 'border-y-2 border-emerald-500/20' : ''}`}>

                                                <motion.button whileTap={{ scale: 0.9 }} className={`w-11 h-11 rounded-2xl transition-all flex flex-col items-center justify-center mx-auto border-2 text-xl font-black ${getButtonStyles(val, key)} touch-none select-none ${new Date(key).setHours(0,0,0,0) > new Date().setHours(0,0,0,0) ? 'opacity-20 cursor-not-allowed grayscale' : ''}`} onPointerDown={(e) => handleHabitPressStart(e, key, h, val)} onPointerUp={(e) => handleHabitPressEnd(e, key, h, val)}>
                                                    <span className={`text-[7px] font-black leading-none mb-0.5 pointer-events-none ${val > 0 ? 'text-white/60' : (theme === 'dark' ? 'text-slate-600' : 'text-slate-300')}`}>{day.getDate()}</span>
                                                    <span className="pointer-events-none font-bold">
    {(() => {
        const config = habitConfigs[h];
        const stepVal = config?.steps > 1 ? Math.round((val / 100) * config.steps) : null;
        return stepVal !== null ? stepVal : (val === 100 ? '✔' : (val > 0 ? `${Math.round(val)}%` : '✘'));
    })()}
</span>
                                                </motion.button>
                                            </td>
                                        );
                                    })}
                                    <td className={`p-2 sticky right-0 z-10 border-l border-b transition-all duration-500 text-center font-black text-sm ${rowBgStyle} ${isToday ? 'border-r-4 border-r-emerald-500' : ''}`}>
                                        <span className={progress === 100 ? 'text-emerald-600 font-bold' : progress > 0 ? 'text-blue-600' : theme === 'dark' ? 'text-slate-700' : 'text-slate-300'}>
                                            <AnimatedNumber value={progress} />
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        <tr style={{ height: '216px' }}><td></td></tr> 
                    </tbody>
                </>
            ) : (
                /* --- Table 2: Horizontal Layout (8 Columns visible) --- */
                <>
                    <thead className={`sticky top-0 z-30 shadow-sm ${getTableHeadStyle()} border-b transition-colors`}>
                        <tr className="h-[72px]">
                            <th className={`p-4 font-black ${getTextMuted()} text-[9px] uppercase tracking-widest sticky left-0 z-40 text-center border-r-2 bg-[#1e293b] border-slate-700 shadow-[4px_0_8px_rgba(0,0,0,0.3)] w-[120px] min-w-[120px]`}>
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={toggleTableOrientation} className={`p-1 rounded-md transition-all ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`} title="Switch to Vertical View">
                                  <TableRotateIcon />
                                </button>
                                <span>DATE Log</span>
                              </div>
                            </th>
                            {daysInMonth.map((day) => {
                                const key = getSafeKey(day); const isToday = new Date().toDateString() === day.toDateString();
                                return (
                                    <th key={key} id={`col-${key}`} className={`p-2 border-x-2 border-t-4 transition-all duration-500 w-[calc((100vw-160px)/10)] min-w-[calc((100vw-160px)/10)] bg-[#0f172a] ${isToday ? 'border-emerald-500/50 shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]' : 'border-transparent border-r-slate-700'}`}>
                                    <div className="flex flex-col items-center gap-1">
                                            <motion.button 
  whileTap={{ scale: 0.9 }} 
  onClick={() => setEditingNoteDate(key)} 
  className={`p-2 rounded-xl transition-all ${trackerData[key]?.note ? 'bg-blue-600 text-white shadow-md' : (theme === 'dark' ? 'bg-slate-800 text-slate-600 hover:bg-slate-700' : 'bg-slate-100 text-slate-300 hover:bg-slate-200')}`} 
  title="Add reflection note"
>
  <NoteIcon />
</motion.button>
                                            <span className={`text-[7px] uppercase font-black ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{day.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                                            <span className={`text-xs font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{day.getDate()}</span>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="h-[52px]">
                            <td className={`p-2 font-black text-[12px] uppercase sticky left-0 z-20 border-r-2 border-b text-center transition-colors bg-[#1e293b] border-slate-800 text-emerald-400 shadow-[4px_0_8px_rgba(0,0,0,0.3)]`}>
                                <div className="w-full px-1 font-black leading-tight break-words">Efficiency</div>
                            </td>
                            {daysInMonth.map(day => {
                                const key = getSafeKey(day); const dayData = trackerData[key] || {};
                                let earned = 0; habits.forEach(h => { const v = typeof dayData[h] === 'number' ? dayData[h] : (dayData[h] ? 100 : 0); earned += (v / 100); });
                                const progress = habits.length > 0 ? Math.round((earned / habits.length) * 100) : 0;
                                return (
                                    <td key={key} className={`p-2 border-x-2 border-b text-center text-[10px] font-black transition-all duration-500 w-[calc((100vw-160px)/10)] min-w-[calc((100vw-160px)/10)] ${new Date().toDateString() === day.toDateString() ? (theme === 'dark' ? 'bg-emerald-900/20 border-emerald-500/30 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]' : 'bg-emerald-50/50 border-emerald-400/30 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]') : 'border-transparent border-r-slate-100 dark:border-r-slate-800'}`}>
                                    <span className={progress === 100 ? 'text-emerald-500' : progress > 0 ? 'text-blue-500' : 'text-slate-300'}><AnimatedNumber value={progress} /></span>
                                    </td>
                                );
                            })}
                        </tr>
                        {habits.map((habit, hIdx) => (
                            <tr key={hIdx} className="h-[68px]">
                                <td className={`p-1 font-black text-[clamp(7.5px,1.5vw,11px)] sm:text-[11px] uppercase sticky left-0 z-20 border-r-2 border-b text-center transition-colors bg-[#1e293b] border-slate-800 text-slate-400 shadow-[4px_0_8px_rgba(0,0,0,0.3)]`}> 
    <div className="truncate w-full px-1 font-black leading-tight">{habit}</div>
</td>
                                {daysInMonth.map(day => {
                                    const key = getSafeKey(day); const val = typeof trackerData[key]?.[habit] === 'number' ? trackerData[key][habit] : (trackerData[key]?.[habit] ? 100 : 0);
                                    return (
                                        <td key={key} className={`p-1.5 border-x-2 border-b text-center transition-all duration-500 w-[calc((100vw-160px)/10)] min-w-[calc((100vw-160px)/10)] ${new Date().toDateString() === day.toDateString() ? (theme === 'dark' ? 'bg-emerald-900/20 border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.08)]' : 'bg-emerald-50/50 border-emerald-400/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.08)]') : 'border-transparent border-r-slate-100 dark:border-r-slate-800'}`}>

                                        <motion.button whileTap={{ scale: 0.9 }} onPointerDown={(e) => handleHabitPressStart(e, key, habit, val)} onPointerUp={(e) => handleHabitPressEnd(e, key, habit, val)} className={`w-11 h-11 rounded-2xl mx-auto border-2 flex items-center justify-center font-black transition-all text-xl ${getButtonStyles(val, key)} ${new Date(key).setHours(0,0,0,0) > new Date().setHours(0,0,0,0) ? 'opacity-20 grayscale' : ''}`}>
      <span>
    {(() => {
        const config = habitConfigs[habit];
        const stepVal = config?.steps > 1 ? Math.round((val / 100) * config.steps) : null;
        return stepVal !== null ? stepVal : (val === 100 ? '✔' : (val > 0 ? `${Math.round(val)}%` : '✘'));
    })()}
</span>
</motion.button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </>
            )}
        </table>
    </div>
</motion.div>
        </div>
        

        {/* Footer Credit Section */}
        <footer className={`mt-auto py-6 md:py-10 text-center border-t ${theme === 'dark' ? 'border-slate-900' : 'border-slate-100'}`}>
          <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] ${getTextMuted()}`}>
            Developed by <a 
              href="https://www.facebook.com/hsnshahriaradib" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-500 hover:text-emerald-400 hover:underline decoration-2 underline-offset-4 transition-all cursor-pointer"
            >
              Adib
            </a> | APM | RU
          </p>
        </footer>
      </motion.div>

      {/* --- Modals --- */}
      <AnimatePresence>
        {/* Note Viewer Modal */}
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
                
                {/* LEFT SIDEBAR */}
                <div className={`p-8 md:w-64 flex flex-col items-center border-b md:border-b-0 md:border-r ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                    <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 144 144">
                      <circle cx="72" cy="72" r="64" fill="none" stroke={theme==='dark'?'#334155':'#e2e8f0'} strokeWidth="10" />
                      <motion.circle initial={{ strokeDashoffset: 402 }} animate={{ strokeDashoffset: 402 - (402 * habitInsights.score / 100) }} transition={{ duration: 1.5, ease: "easeOut" }} cx="72" cy="72" r="64" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray={402} strokeLinecap="round" />
                    </svg>
                    <div className="flex flex-col items-center"><span className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}><AnimatedNumber value={habitInsights.score} /></span><span className={`text-[9px] font-black ${getTextMuted()} uppercase tracking-widest`}>Score</span></div>
                  </div>

                  {/* Corrected Single Goal Input */}
                  <div className={`w-full mb-8 p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
                    <label className={`text-[8px] font-black uppercase ${getTextMuted()} block mb-2 text-center`}>Daily Goal Steps</label>
                    <input 
                      type="number" 
                      value={tempGoalVal} 
                      onChange={(e) => setTempGoalVal(e.target.value)} 
                      onBlur={() => {
                        let val = parseInt(tempGoalVal);
                        // Validation: If empty or <= 0, default to 1
                        if (isNaN(val) || val < 1) val = 1;
                        setTempGoalVal(val);
                        const nc = {
                          ...habitConfigs, 
                          [viewingHabitMap]: {
                            ...(habitConfigs[viewingHabitMap] || {priority: 1, steps: 1}), 
                            steps: val
                          }
                        };
                        setHabitConfigs(nc); 
                        save(trackerData, habits, nc);
                      }} 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.currentTarget.blur();
                      }}
                      className={`w-full text-center text-xl font-black p-1 rounded bg-transparent focus:outline-none focus:text-emerald-500 transition-colors`} 
                    />
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-lg' : 'bg-white border-slate-100 shadow-sm'} p-4 rounded-2xl border flex items-center gap-4 transition-colors`}><div className="text-emerald-600"><ActivityIcon /></div><div><span className={`text-[10px] block uppercase font-black ${getTextMuted()}`}>Rank</span><span className={`text-sm font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{habitInsights.level}</span></div></div>
<div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-lg' : 'bg-white border-slate-100 shadow-sm'} p-4 rounded-2xl border flex items-center gap-4 transition-colors`}><div className="text-orange-600"><FlameIcon /></div><div><span className={`text-[10px] block uppercase font-black ${getTextMuted()}`}>Current Streak</span><span className={`text-sm font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{habitInsights.currentStreak} Days</span></div></div>
<div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-lg' : 'bg-white border-slate-100 shadow-sm'} p-4 rounded-2xl border flex items-center gap-4 transition-colors ring-2 ring-emerald-500/10`}><div className="text-yellow-500"><TrophyIcon /></div><div><span className={`text-[10px] block uppercase font-black ${getTextMuted()}`}>Personal Best</span><span className={`text-sm font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{habitInsights.bestStreak} Days</span></div></div>
                    

<div className="mt-6 w-full px-2">
  <p className={`text-[8px] font-black uppercase ${getTextMuted()} mb-3 tracking-widest text-center`}>Milestone Progress</p>
  <div className="grid grid-cols-5 gap-1.5">
    {['Seed', 'Apprentice', 'Adept', 'Elite', 'Grandmaster'].map((rank) => (
      <div key={rank} className={`aspect-square rounded-xl border flex flex-col items-center justify-center transition-all duration-700 ${habitInsights.level === rank ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)] scale-110 z-10' : 'border-transparent opacity-20 grayscale'}`}>
        <TrophyIcon />
        <span className="text-[5px] font-black uppercase mt-1 text-[5px] leading-tight text-center">{rank}</span>
      </div>
    ))}
  </div>
</div>
                  </div>

                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowDeleteConfirm(true)} className="mt-8 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20"><TrashIcon /> Delete Habit</motion.button>
                </div>

                {/* MAIN CALENDAR SECTION */}
                <div className="flex-1 p-8 flex flex-col">
                  <div className="flex items-start justify-between mb-8 gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        {isEditingTabName ? (
                          <input autoFocus className={`text-2xl font-black bg-transparent focus:outline-none border-b-2 border-emerald-500 w-full ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`} value={tempHabitName} onChange={(e) => setTempHabitName(e.target.value)} onBlur={handleTabRename} onKeyDown={(e) => e.key === 'Enter' && handleTabRename()} />
                        ) : (
                          <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} leading-tight break-words pr-2 cursor-pointer hover:text-emerald-500 transition-colors flex items-center gap-3 group`} onClick={() => { setIsEditingTabName(true); setTempHabitName(viewingHabitMap); }}>
                            {viewingHabitMap}
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity"><EditIcon /></span>
                          </h3>
                        )}
                        
                        {/* Category Selector next to habit name */}
                        <select 
                          value={habitConfigs[viewingHabitMap]?.category || 'all'} 
                          onChange={(e) => {
                            const newConfigs = {
                              ...habitConfigs,
                              [viewingHabitMap]: { ...(habitConfigs[viewingHabitMap] || {steps: 1}), category: e.target.value }
                            };
                            setHabitConfigs(newConfigs);
                            save(trackerData, habits, newConfigs);
                          }}
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer focus:outline-none appearance-none
                            ${theme === 'dark' ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-slate-100 text-emerald-600 border-slate-200 hover:border-emerald-400'}`}
                        >
                          <option value="all" className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>Add to category</option>
                          {categories.filter(cat => cat !== 'all').map(cat => (
                            <option key={cat} value={cat} className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className={`flex items-center gap-1 mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1 hover:text-emerald-500 transition-colors"><ChevronLeftIcon /></button>
                        <span className="text-[10px] font-black uppercase tracking-widest min-w-[80px] text-center">{currentDate.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1 hover:text-emerald-500 transition-colors"><ChevronRightIcon /></button>
                        </div>
                    </div>
                    <button onClick={() => { setViewingHabitMap(null); setIsEditingTabName(false); }} className={`p-3 transition-all ${getTextMuted()} hover:text-rose-500 shrink-0`}><XIcon /></button>
                  </div>

                  {/* Last 7 Days Activity Bar */}
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                      <ActivityIcon className="w-4 h-4 text-slate-400" />
                      <p className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-widest`}>Last 7 Days Activity</p>
                    </div>
                    <div className="grid grid-cols-7 gap-3">
                      {habitInsights.last7Days.map((day, i) => {
                        // Check if this specific day is currently being adjusted by the slider
                        const isLiveDragging = activeSlider?.dateKey === day.key && activeSlider?.habit === viewingHabitMap;
                        const displayPct = isLiveDragging ? activeSlider.value : day.pct;

                        return (
                          <div key={i} className="flex flex-col items-center gap-2">
                            <div className={`w-full aspect-square rounded-2xl border-2 overflow-hidden relative ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                              <motion.div 
                                id={`bar-fill-${day.key}`} // This allows direct DOM updates
                                initial={{ height: 0 }}
                                animate={{ height: `${displayPct}%` }}
                                // Snappy spring physics from your video
                                transition={{ 
                                  type: "spring", 
                                  stiffness: 350, 
                                  damping: 25, 
                                  mass: 0.5 
                                }}
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
        )}

        {/* MASTERY SLIDER OVERLAY - Optimized for Zero Lag */}
        {activeSlider && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md touch-none select-none" 
            onPointerUp={() => {
              // ম্যানুয়াল DOM ওভাররাইডগুলো মুছে ফেলা যাতে রিয়্যাক্ট ক্লাসগুলো কাজ করতে পারে
              const barFill = document.getElementById(`bar-fill-${activeSlider.dateKey}`);
              if (barFill) {
                barFill.style.backgroundColor = ''; 
                barFill.style.height = ''; 
              }
              
              updateHabitValue(activeSlider.dateKey, activeSlider.habit, activeSlider.value);
              setActiveSlider(null);
            }}
          >
            <div 
              className="fixed flex flex-col items-center" 
              style={{ 
                left: activeSlider.x, top: activeSlider.y, 
                transform: 'translate(-50%, -50%)', position: 'fixed', willChange: 'transform' 
              }} 
              onPointerMove={(e) => {
                if (e.buttons === 1 || e.pointerType === 'touch') {
                  const track = document.getElementById('mastery-slider-track'); 
                  const fill = document.getElementById('mastery-slider-fill');
                  const label = document.getElementById('mastery-slider-label');
                  if (!track || !fill || !label) return;

                  const rect = track.getBoundingClientRect(); 
                  const percentage = Math.max(0, Math.min(100, Math.round(((rect.bottom - e.clientY) / rect.height) * 100)));
                  const config = habitConfigs[activeSlider.habit];
                  const finalVal = config?.steps > 1 ? (Math.round((percentage / 100) * config.steps) / config.steps) * 100 : percentage;

                  // 1. Update Slider DOM
                  fill.style.height = `${finalVal}%`;
                  const displayVal = config?.steps > 1 ? Math.round((finalVal / 100) * config.steps) : Math.round(finalVal) + '%';
                  label.innerText = displayVal;
                  label.style.color = finalVal >= 47 ? '#0f172a' : '#ffffff';
                  
                  // 2. Update Activity Bar DOM Instantly (Zero Lag)
                  const barFill = document.getElementById(`bar-fill-${activeSlider.dateKey}`);
                  if (barFill) {
                    barFill.style.height = `${finalVal}%`;
                    // #10b981 for full, #2563eb for partial
                    barFill.style.backgroundColor = finalVal >= 100 ? '#10b981' : '#2563eb';
                  }

                  // 3. Store current value in ref so onPointerUp knows the final state
                  activeSlider.value = finalVal;
                }
              }}
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
          

        {/* Confirmation and Editor Modals */}
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border p-8 rounded-[2rem] max-w-sm w-full shadow-2xl text-center`}>
              <div className="bg-rose-500/20 text-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"><TrashIcon /></div>
              <h4 className="text-xl font-black mb-2">Delete Habit?</h4>
              <p className={`text-sm ${getTextMuted()} mb-8 font-medium`}>This will permanently delete data for <span className="text-rose-500 font-bold">"{viewingHabitMap || tempHabitName}"</span>.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteConfirm(false)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>Cancel</button>
                <button onClick={() => deleteHabit(viewingHabitMap || editingHabitName)} className="flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest bg-rose-500 text-white shadow-lg shadow-rose-500/20">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showPomo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4" onClick={() => setShowPomo(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-[3rem] p-10 w-full max-w-sm text-center shadow-2xl relative`} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowPomo(false)} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-rose-500 transition-all"><XIcon /></button>
              
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex gap-2 justify-center items-center">
                  {['work', 'break'].map(m => (
                    <button key={m} onClick={() => { setPomoMode(m); setPomoTime(m === 'work' ? pomoWorkTime*60 : pomoBreakTime*60); setPomoActive(false); setIsEditingPomo(false); }} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${pomoMode === m ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{m}</button>
                  ))}
                  <button onClick={() => setIsEditingPomo(!isEditingPomo)} className={`p-1.5 rounded-lg transition-all ${isEditingPomo ? 'text-emerald-500' : 'text-slate-500 hover:text-emerald-500'}`}><EditIcon /></button>
                </div>

                {isEditingPomo && (
                  <div className={`flex flex-col gap-3 p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} animate-in fade-in zoom-in duration-200`}>
                    <div className="flex gap-4 justify-center">
                      {pomoMode === 'work' ? (
                        <div className="text-center">
                          <label className="text-[8px] font-black uppercase block mb-1 opacity-60">Work Duration (Min)</label>
                          <input type="number" value={pomoWorkTime} 
                            onChange={(e) => setPomoWorkTime(e.target.value === '' ? '' : parseInt(e.target.value))} 
                            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                            onBlur={() => {
                              let v = parseInt(pomoWorkTime);
                              if (!v || v <= 0) v = 25;
                              setPomoWorkTime(v);
                              localStorage.setItem('adib_pomo_work', v);
                              if (pomoMode === 'work') setPomoTime(v * 60);
                            }}
                            className="w-20 bg-transparent text-center font-black focus:outline-none border-b border-emerald-500 text-sm" 
                          />
                        </div>
                      ) : (
                        <div className="text-center">
                          <label className="text-[8px] font-black uppercase block mb-1 opacity-60">Break Duration (Min)</label>
                          <input type="number" value={pomoBreakTime} 
                            onChange={(e) => setPomoBreakTime(e.target.value === '' ? '' : parseInt(e.target.value))} 
                            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                            onBlur={() => {
                              let v = parseInt(pomoBreakTime);
                              if (!v || v <= 0) v = 5;
                              setPomoBreakTime(v);
                              localStorage.setItem('adib_pomo_break', v);
                              if (pomoMode === 'break') setPomoTime(v * 60);
                            }}
                            className="w-20 bg-transparent text-center font-black focus:outline-none border-b border-blue-500 text-sm" 
                          />
                        </div>
                      )}
                    </div>
                    
                  </div>
                )}
              </div>

              <div className={`text-7xl font-black mb-8 tabular-nums tracking-tighter ${pomoActive ? 'text-emerald-500' : (theme === 'dark' ? 'text-white' : 'text-slate-800')}`}>
                {formatPomoTime(pomoTime)}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setPomoActive(!pomoActive)} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${pomoActive ? 'bg-amber-500 shadow-amber-500/20' : 'bg-emerald-500 shadow-emerald-500/20'} text-white shadow-xl`}>
                  {pomoActive ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button onClick={() => { setPomoActive(false); setPomoTime(pomoMode === 'work' ? 25*60 : 5*60); }} className={`w-12 h-12 rounded-full flex items-center justify-center border ${theme === 'dark' ? 'border-slate-700 text-slate-500 hover:text-white' : 'border-slate-200 text-slate-400 hover:text-slate-800'} transition-all`}>
                  <RefreshIcon />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

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
        .rolling-digit-container { perspective: 1000px; transform-style: preserve-3d; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: ${theme === 'dark' ? '#0f172a' : '#f1f5f9'}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${theme === 'dark' ? '#334155' : '#cbd5e1'}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${theme === 'dark' ? '#475569' : '#94a3b8'}; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        tr[id^="row-"] { scroll-margin-top: 150px; scroll-margin-bottom: 150px; }
        .tooltip-trigger { position: relative; display: flex; align-items: center; }
        .tooltip-content {
          position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%);
          padding: 6px 10px; background: #000; color: #fff; font-size: 10px; font-weight: 900;
          border-radius: 8px; white-space: nowrap; pointer-events: none; opacity: 0;
          transition: all 0.2s ease; z-index: 100; text-transform: uppercase; letter-spacing: 0.05em;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        .tooltip-trigger:hover .tooltip-content, .tooltip-trigger:active .tooltip-content {
          opacity: 1; bottom: 140%;
        }
        /* Left positioned tooltip for top-right icons */
        .tooltip-left .tooltip-content {
          bottom: auto; left: auto; right: 125%; top: 50%; transform: translateY(-50%);
        }
        .tooltip-left:hover .tooltip-content, .tooltip-left:active .tooltip-content {
          opacity: 1; right: 145%; bottom: auto;
        }
      `}} />
    </div>
  );
}