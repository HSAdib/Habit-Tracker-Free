/* Credit: Adib | APM | RU | Bangladesh | email: hasanshahriaradib@gmail.com | updated:22-01-2026 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { motion, AnimatePresence, animate } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
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
const TextSizeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>
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
  "sleep 7h": { steps: 1 },
  "calisthenics": { steps: 1 },
  "meditation": { steps: 1 },
  "dept study": { steps: 1 },
  "coding": { steps: 1},
  "vocab": { steps: 15 },
  "audiobook": { steps: 1 }
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
  const [tabLayout, setTabLayout] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('adib_habit_layout') || 'circle' : 'circle'));
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [habitConfigs, setHabitConfigs] = useState(DEFAULT_CONFIGS);
  const [editingHabitName, setEditingHabitName] = useState(null);
  const [tempHabitName, setTempHabitName] = useState("");
  const [viewingHabitMap, setViewingHabitMap] = useState(null);
  const [editingNoteDate, setEditingNoteDate] = useState(null);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('adib_habit_theme') || 'dark' : 'dark'));
  const [tableOrientation, setTableOrientation] = useState(() => 
  (typeof window !== 'undefined' ? localStorage.getItem('adib_table_orientation') || 'horizontal' : 'horizontal')
);
const [showWeeklyModal, setShowWeeklyModal] = useState(false);
const [heatmapFilter, setHeatmapFilter] = useState('all');
const [weeklyGraphFilter, setWeeklyGraphFilter] = useState('all');
const [dashboardGraphFilter, setDashboardGraphFilter] = useState('all');
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
  const [showTextSizeModal, setShowTextSizeModal] = useState(false);
  const [textSizes, setTextSizes] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adib_text_sizes');
      const parsed = saved ? JSON.parse(saved) : {};
      return { habit: 14, table1: 12, table2: 11, tabSize: 110, ...parsed };
    }
    return { habit: 14, table1: 12, table2: 11, tabSize: 110 };
  });

  const updateTextSize = (key, value) => {
    const newSizes = { ...textSizes, [key]: parseInt(value) };
    setTextSizes(newSizes);
    localStorage.setItem('adib_text_sizes', JSON.stringify(newSizes));
  };
// --- LEVEL UP STATE ---
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const prevLevelRef = useRef(null);
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
  const [archivedHabits, setArchivedHabits] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adib_habit_archived');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showArchiveModal, setShowArchiveModal] = useState(false);
// --- CATEGORY MANAGER STATE ---
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");
  const [editingCat, setEditingCat] = useState(null); // { name: 'health', temp: 'Health' }

  // Rename Category Logic
  const handleCategoryRename = (oldName, newName) => {
    const formattedName = newName.toLowerCase().trim();
    if (!formattedName || formattedName === oldName || categories.includes(formattedName)) return;

    // 1. Update Categories List
    const newCats = categories.map(c => c === oldName ? formattedName : c);
    setCategories(newCats);
    localStorage.setItem('adib_habit_categories', JSON.stringify(newCats));

    // 2. Update Habit Configs
    const newConfigs = { ...habitConfigs };
    Object.keys(newConfigs).forEach(h => {
      if (newConfigs[h].category === oldName) {
        newConfigs[h].category = formattedName;
      }
    });
    setHabitConfigs(newConfigs);

    // 3. Update Selected Category if active
    if (selectedCategory === oldName) setSelectedCategory(formattedName);

    // 4. Save Data
    save(trackerData, habits, newConfigs);
    setEditingCat(null);
  };

  const handleManualAddCategory = () => {
    const name = newCatInput.toLowerCase().trim();
    if (name && !categories.includes(name)) {
      const newCats = [...categories, name];
      setCategories(newCats);
      localStorage.setItem('adib_habit_categories', JSON.stringify(newCats));
      setNewCatInput("");
    }
  };
  // --- Push Notification Logic ---
  const requestNotificationPermission = () => {
    if (typeof window !== 'undefined' && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const triggerNotification = (title, body) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([500, 200, 500]);
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
      oscillator.start(); oscillator.stop(audioCtx.currentTime + 1);
    } catch (e) {}
    if (typeof window !== 'undefined' && "Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: 'https://cdn-icons-png.flaticon.com/512/2550/2550324.png' });
    }
  };

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
          clearInterval(interval); 
          setPomoActive(false);
          localStorage.setItem('adib_pomo_active', 'false');
          localStorage.setItem('adib_pomo_time_left', '0');
          
          setTimeout(() => {
            const title = pomoMode === 'work' ? "Session Complete!" : "Break Over!";
            const msg = pomoMode === 'work' ? "Work session done! Take a break." : "Back to work now!";
            triggerNotification(title, msg);
            alert(msg);
          }, 100);
        }
      }, 1000);
    } else {
      if (pomoActive && pomoTime === 0) {
        setPomoActive(false);
        localStorage.setItem('adib_pomo_active', 'false');
        const title = pomoMode === 'work' ? "Session Complete!" : "Break Over!";
        const msg = pomoMode === 'work' ? "Work session done! Take a break." : "Back to work now!";
        triggerNotification(title, msg);
        alert(msg);
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
        // to stop scrolling when the 31st row (the end of dataContentHeight)
        // is at the bottom of a 3-row view (header + 3 rows).
        const minHeightLimit = (3 * rowHeight) + headerHeight; // 268px
        const stopScrollAt = dataContentHeight - minHeightLimit;

        if (scrollTop > stopScrollAt) {
          container.scrollTop = stopScrollAt;
          setTableHeight(minHeightLimit);
          setTableVisibleRows(3);
          return;
        }
        

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
    const newArchived = archivedHabits.filter(h => h !== name);
    setHabits(newHabits);
    setHabitConfigs(newConfigs);
    setTrackerData(newData);
    setArchivedHabits(newArchived);
    localStorage.setItem('adib_habit_archived', JSON.stringify(newArchived));
    save(newData, newHabits, newConfigs);
    setViewingHabitMap(null);
    setEditingHabitName(null);
    setShowDeleteConfirm(false);
  };

  const toggleArchiveHabit = (name) => {
    let newArchived;
    if (archivedHabits.includes(name)) {
      newArchived = archivedHabits.filter(h => h !== name);
    } else {
      newArchived = [...archivedHabits, name];
      setViewingHabitMap(null);
    }
    setArchivedHabits(newArchived);
    localStorage.setItem('adib_habit_archived', JSON.stringify(newArchived));
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
        const priority = habitConfigs[habit]?.priority || 1; 
        // Now accurately scales from 1x to 10x XP
        totalXP += (val / 100) * 10 * priority;
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

  // --- LEVEL UP EFFECT ---
  useEffect(() => {
    // ১. লোকাল স্টোরেজ থেকে লাস্ট সেভ করা লেভেল চেক করো
    const storedLevel = parseInt(localStorage.getItem('adib_habit_saved_level'));

    // ২. পেজ লোড হওয়ার সময় Ref সেট করো (যাতে রিলোড দিলে পপ-আপ না আসে)
    if (prevLevelRef.current === null) {
      // যদি আগে সেভ করা থাকে সেটা নাও, না থাকলে বর্তমান লেভেলই সেট করো
      prevLevelRef.current = !isNaN(storedLevel) ? storedLevel : xpStats.level;
      return;
    }

    // ৩. এখন মেইন লজিক: বর্তমান লেভেল কি আগের চেয়ে বেশি?
    if (xpStats.level > prevLevelRef.current) {
      setShowLevelUpModal(true);
      
      // Sound Effect
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const playNote = (freq, time, duration) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + time);
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime + time);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + time + duration);
          osc.start(audioCtx.currentTime + time);
          osc.stop(audioCtx.currentTime + time + duration);
        };
        playNote(523.25, 0, 0.2);
        playNote(659.25, 0.1, 0.2);
        playNote(783.99, 0.2, 0.2);
        playNote(1046.50, 0.4, 0.8);
      } catch (e) { console.error("Audio play failed", e); }

      // Confetti Effect
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      s.onload = () => {
        const duration = 3000;
        const end = Date.now() + duration;
        (function frame() {
          if (typeof window.confetti === 'function') {
            window.confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#10b981', '#3b82f6', '#f59e0b'] });
            window.confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#10b981', '#3b82f6', '#f59e0b'] });
          }
          if (Date.now() < end) requestAnimationFrame(frame);
        }());
      };
      document.head.appendChild(s);
    }

    // ৪. আপডেট লজিক: লেভেল বাড়ুক বা কমুক, বর্তমান অবস্থা সেভ করে রাখো।
    // এটাই তোমার ট্রিক: লেভেল কমলে সিস্টেম 'নিচের লেভেল' সেভ করবে। 
    // ফলে পরে আবার বাড়লে (current > prev) কন্ডিশন সত্য হবে এবং আবার ধামাকা হবে!
    if (xpStats.level !== prevLevelRef.current) {
      prevLevelRef.current = xpStats.level;
      localStorage.setItem('adib_habit_saved_level', xpStats.level);
    }

  }, [xpStats.level]);

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
  // --- CATEGORY PROGRESS CALCULATION ---
  const categoryProgress = useMemo(() => {
    const stats = {};
    categories.forEach(cat => {
      if (cat === 'all') {
        stats[cat] = analytics.monthlyPct;
      } else {
        const catHabits = habits.filter(h => habitConfigs[h]?.category === cat && !archivedHabits.includes(h));
        if (catHabits.length === 0) {
          stats[cat] = 0;
        } else {
          const totalPct = catHabits.reduce((acc, h) => acc + (analytics.habitPcts[h] || 0), 0);
          stats[cat] = Math.round(totalPct / catHabits.length);
        }
      }
    });
    return stats;
  }, [categories, analytics, habits, habitConfigs, archivedHabits]);
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

    // Added weeklyStats to return object
    return { topHabits, avgScore, weeklyStats }; 
  }, [trackerData, habits]);
  const weeklyGraphData = useMemo(() => {
    if (weeklyGraphFilter === 'all') return weeklySummary.weeklyStats;
    
    // Generate last 7 days data for the selected habit
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
  const habitStreaks = useMemo(() => {
    const streaks = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    habits.forEach(habit => {
      let count = 0;
      let checkDate = new Date(today);
      
      const todayKey = getSafeKey(checkDate);
      const todayVal = trackerData[todayKey]?.[habit] ?? 0;
      const isTodayDone = (typeof todayVal === 'number' ? todayVal : (todayVal ? 100 : 0)) >= 100;

      if (!isTodayDone) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (true) {
        const key = getSafeKey(checkDate);
        const valRaw = trackerData[key]?.[habit] ?? 0;
        const val = typeof valRaw === 'number' ? valRaw : (valRaw ? 100 : 0);

        if (val >= 100) {
          count++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      streaks[habit] = count;
    });
    return streaks;
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

    // --- সংশোধিত স্ট্রিক ক্যালকুলেশন ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    // ১. কারেন্ট স্ট্রিক বের করা (আজ বা গতকাল থেকে পেছনে গণনা)
    let checkDate = new Date(today);
    const todayKey = getSafeKey(checkDate);
    const todayValRaw = trackerData[todayKey]?.[viewingHabitMap] ?? 0;
    const todayVal = typeof todayValRaw === 'number' ? todayValRaw : (todayValRaw ? 100 : 0);

    // যদি আজ এখনও শেষ না হয়, তবে গতকাল থেকে স্ট্রিক চেক করা শুরু করবে
    if (todayVal < 100) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const key = getSafeKey(checkDate);
      const valRaw = trackerData[key]?.[viewingHabitMap] ?? 0;
      const val = typeof valRaw === 'number' ? valRaw : (valRaw ? 100 : 0);

      if (val >= 100) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // ২. অল-টাইম বেস্ট স্ট্রিক বের করা
    const allDates = Object.keys(trackerData).sort();
    if (allDates.length > 0) {
      let d = new Date(allDates[0]);
      while (d <= today) {
        const key = getSafeKey(d);
        const valRaw = trackerData[key]?.[viewingHabitMap] ?? 0;
        const val = typeof valRaw === 'number' ? valRaw : (valRaw ? 100 : 0);

        if (val >= 100) {
          tempStreak++;
          if (tempStreak > bestStreak) bestStreak = tempStreak;
        } else {
          tempStreak = 0;
        }
        d.setDate(d.getDate() + 1);
      }
    }

    // গ্যারান্টি: বেস্ট স্ট্রিক কখনোই কারেন্ট স্ট্রিকের চেয়ে কম হবে না
    if (currentStreak > bestStreak) bestStreak = currentStreak;

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
      const key = getSafeKey(day); 
      let pct = 0;

      if (dashboardGraphFilter === 'all') {
         let totalPct = 0;
         habits.forEach(h => { const r = trackerData[key]?.[h] ?? 0; totalPct += (typeof r === 'number' ? r : (r ? 100 : 0)); });
         pct = habits.length > 0 ? totalPct / habits.length : 0;
      } else {
         const r = trackerData[key]?.[dashboardGraphFilter] ?? 0;
         pct = typeof r === 'number' ? r : (r ? 100 : 0);
      }
      
      return { x: (idx / (daysInMonth.length - 1)) * 100, y: 100 - pct };
    }).filter(p => !isNaN(p.x));
  }, [daysInMonth, trackerData, habits, dashboardGraphFilter]);

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
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }} 
                whileTap={{ scale: 0.9 }}
                onClick={() => window.location.reload()}
                className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg animate-glow cursor-pointer"
              >
                <ZapIcon />
              </motion.div>
              
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
                      className={`p-1.5 rounded-lg transition-all border active:scale-90
                        ${theme === 'dark' 
                          ? 'bg-slate-800 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)] hover:border-emerald-500/50' 
                          : 'bg-white border-emerald-200 text-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.15)] hover:border-emerald-400'
                        }`}
                      title="Switch Habit Tabs Layout"
                    >
                      {tabLayout === 'square' ? <TargetIcon /> : <SquareTargetIcon />}
                    </button>

                    <button 
                      onClick={() => setShowTextSizeModal(true)}
                      className={`p-1.5 rounded-lg transition-all border active:scale-90
                        ${theme === 'dark' 
                          ? 'bg-slate-800 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)] hover:border-emerald-500/50' 
                          : 'bg-white border-emerald-200 text-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.15)] hover:border-emerald-400'
                        }`}
                      title="Adjust Display Sizes"
                    >
                      <TextSizeIcon />
                    </button>
                  </div>

                  {/* Status Zone - Separated from Buttons */}
                  <div className={`flex items-center gap-3 ml-4 md:ml-8 pl-4 md:pl-6 border-l ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all duration-500 cursor-default ${getLevelBadgeStyle(xpStats.level)}`}>
                      Level {xpStats.level}
                    </span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)] cursor-default" title="Total Full Wins">
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
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className={`p-1 md:p-2 ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-white text-slate-600'} rounded-lg transition-all`}><ChevronLeftIcon /></motion.button>
                <span className={`px-1 md:px-4 font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'} min-w-[85px] md:min-w-[140px] text-center text-[10px] md:text-sm`}>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className={`p-1 md:p-2 ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-white text-slate-600'} rounded-lg transition-all`}><ChevronRightIcon /></motion.button>
                </div>

              {/* Right Side: Data Safety Group with CSS Tooltips */}
              <div className="flex items-center gap-1 ml-auto">
                
                <div className={`w-px h-6 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
                
                {/* Archive List Button */}
                <div className="tooltip-trigger">
                  <button onClick={() => setShowArchiveModal(true)} className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-700 hover:text-amber-400' : 'text-slate-500 hover:bg-white hover:text-amber-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>
                  </button>
                  <span className="tooltip-content">Archive List</span>
                </div>

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
  <div className="flex items-center gap-2 md:gap-3">
  <span className={`hidden md:block text-[8px] md:text-[9px] font-black uppercase tracking-widest shrink-0 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
    Activity Heatmap
  </span>
  {/* Mobile Label (Icon only to save space) */}
  <span className={`md:hidden text-emerald-500`}><ActivityIcon /></span>
  
  <select 
    value={heatmapFilter} 
    onChange={(e) => setHeatmapFilter(e.target.value)}
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
</div> </div>
                  <div className="flex items-center gap-1.5 md:gap-3 pl-2 md:pl-4">
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => setShowAllNotes(true)} 
    className={`flex items-center gap-1.5 transition-all px-2.5 py-1.5 rounded-xl border relative
      ${analytics.noteCount > 0 ? 'animate-glow-blue' : ''} 
      ${theme === 'dark' 
        ? 'bg-blue-900/20 text-blue-400 border-blue-500/30' 
        : 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'}`}
  >
    <NoteIcon />
    <span className={`text-[10px] md:text-xs font-black`}>{analytics.noteCount}</span>
    
    {analytics.noteCount > 0 && (
      <span className="absolute -top-1 -right-1 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      </span>
    )}
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
              <div className="flex items-start mb-2 md:mb-4 justify-between">
                
                {/* Left Side: Vertical Stack */}
                <div className="flex flex-col gap-0.5 min-w-0 flex-1 mr-2 relative z-20">
                  {/* Row 1: Slim Dropdown Only */}
                  <div className="flex items-center gap-2">
                    <select 
                      value={dashboardGraphFilter}
                      onChange={(e) => setDashboardGraphFilter(e.target.value)}
                      className={`text-[8px] md:text-[11px] font-black uppercase px-2 py-0.5 md:px-3 md:py-1 rounded-md border transition-all cursor-pointer focus:outline-none max-w-[80px] md:max-w-[160px] truncate
                        ${theme === 'dark' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-300 shadow-sm'}`}
                    >
                      <option value="all" className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>Overall</option>
                      {habits.map(h => (
                        <option key={h} value={h} className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>{h}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Row 2: Big Percentage */}
                  <span className={`text-lg md:text-xl font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} leading-none mt-1`}>
                    {dashboardGraphFilter === 'all' ? analytics.monthlyPct : (analytics.habitPcts[dashboardGraphFilter] || 0)}%
                  </span>
                </div>

                {/* Right Side: Pomo Button (Unchanged) */}
                <div className="flex items-center gap-2 shrink-0">
  <div className="tooltip-trigger">
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => { requestNotificationPermission(); setShowPomo(true); }} 
      className={`px-2 py-2 rounded-2xl border flex flex-col items-center gap-1 transition-all relative
        ${pomoActive 
          ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
          : (theme === 'dark' ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm')
        }`}
    >
      <TimerIcon />
      <span className="text-[9px] font-black leading-none">
        {pomoActive ? formatPomoTime(pomoTime) : (pomoMode === 'work' ? pomoWorkTime : pomoBreakTime) + 'm'}
      </span>

      {pomoActive && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      )}
    </motion.button>
  </div>
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
  {/* NEW: EDIT TAB (Manager Trigger) */}
  <button 
    onClick={() => setShowCategoryManager(true)}
    className={`shrink-0 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
  >
    <EditIcon /> <span>Edit</span>
  </button>

  <div className={`w-px h-4 mx-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

  {/* EXISTING CATEGORIES (Clean Look) */}
  {categories.map(cat => (
    <div key={cat} className="relative group shrink-0">
      <button
        onClick={() => setSelectedCategory(cat)}
        className={`relative overflow-hidden px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
          selectedCategory === cat 
            ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white' 
            : (theme === 'dark' ? 'border-slate-700 hover:border-slate-500 text-slate-500' : 'border-slate-200 hover:border-slate-300 text-slate-400')
        }`}
      >
        {/* Background Track */}
        <div className={`absolute inset-0 z-0 transition-colors duration-500 ${
          selectedCategory === cat 
            ? 'bg-emerald-700' 
            : (theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100')
        }`} />
        
        {/* Progress Fill */}
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${categoryProgress[cat] || 0}%` }} 
          transition={{ duration: 1, ease: "easeOut" }}
          className={`absolute inset-y-0 left-0 z-0 h-full ${
            selectedCategory === cat 
              ? 'bg-emerald-500' 
              : 'bg-emerald-500/15'
          }`}
        />

        {/* Text Label */}
        <span className="relative z-10">{cat}</span>
      </button>
    </div>
  ))}
</div>
          {/* Updated Habit Cards Grid */}
          <motion.div variants={containerVariants} className="grid gap-3 mb-8" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${textSizes.tabSize || 110}px, 1fr))` }}>
            <AnimatePresence mode='popLayout'>
{habits.filter(h => !archivedHabits.includes(h) && (selectedCategory === 'all' || habitConfigs[h]?.category === selectedCategory)).map((habit, idx) => {
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
        ${isCircle ? 'rounded-full aspect-square border-0' : 'p-2 rounded-2xl border aspect-square hover:shadow-lg'}`}
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
              <p style={{ fontSize: `${textSizes.habit}px` }} className="font-black uppercase opacity-80 leading-[1.1] line-clamp-2 text-center w-full px-1 break-words">{habit}</p>
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
                  <p style={{ fontSize: `${textSizes.habit}px` }} className={`font-black ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} uppercase line-clamp-2 break-words text-center leading-[1.1] px-1`}>{habit}</p>
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
  className={`${getCardStyle()} flex items-center justify-center border-2 border-dashed transition-all ${tabLayout === 'circle' ? 'rounded-full aspect-square' : 'p-2 rounded-2xl aspect-square'} ${theme === 'dark' ? 'border-slate-800 text-slate-700 hover:border-emerald-700' : 'border-slate-200 text-slate-300 hover:border-emerald-400'}`}>
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
                
              {/* --- NEW VISUALISATION SECTION --- */}
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
                    className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border transition-all cursor-pointer focus:outline-none
                      ${theme === 'dark' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-300'}`}
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
              {/* --- END NEW VISUALISATION SECTION --- */}
              {/* --- END NEW VISUALISATION SECTION --- */}
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
        )}

        {/* --- JOURNAL HISTORY MODAL --- */}
        {showAllNotes && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[180] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowAllNotes(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl relative flex flex-col max-h-[85vh]`} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowAllNotes(false)} className={`absolute top-6 right-6 p-2 ${getTextMuted()} hover:text-rose-500 transition-all`}><XIcon /></button>
              
              <div className="mb-6 shrink-0">
                <p className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-[0.2em] mb-1`}>Reflection Log</p>
                <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Journal History</h3>
              </div>

              <div className="overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {Object.keys(trackerData).filter(k => trackerData[k]?.note).length > 0 ? (
                  Object.entries(trackerData)
                    .filter(([k, v]) => v.note && v.note.trim())
                    .sort((a, b) => new Date(b[0]) - new Date(a[0])) // Sort by newest first
                    .map(([dateKey, data]) => (
                      <div key={dateKey} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[9px] font-black uppercase tracking-wider ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20`}>
                            {new Date(dateKey).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <button onClick={() => { setEditingNoteDate(dateKey); setShowAllNotes(false); }} className={`text-[9px] font-black uppercase hover:text-emerald-500 transition-colors ${getTextMuted()}`}>Edit</button>
                        </div>
                        <p className={`text-sm font-medium whitespace-pre-wrap leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          {data.note}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-20 opacity-30 flex flex-col items-center">
                    <NoteIcon />
                    <p className="font-black uppercase text-xs mt-4">No entries yet</p>
                  </div>
                )}
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
                                <button 
                                  onClick={toggleTableOrientation} 
                                  className={`p-1.5 rounded-lg border transition-all active:scale-90 shadow-sm
                                    ${theme === 'dark' 
                                      ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600' 
                                      : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`} 
                                  title="Switch to Horizontal View"
                                >
                                  <TableRotateIcon />
                                </button>
                                <span>DATE Log</span>
                              </div>
                            </th>

                            {/* FILTERED HABITS HEADER */}
                            {habits.filter(h => !archivedHabits.includes(h)).map((h, i) => <th key={i} className={`p-2 border-r ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-600'} uppercase text-center font-black transition-colors`} style={{ fontSize: `${textSizes.table1}px` }}><div className="px-1 leading-tight break-words" title={h}>{h}</div></th>)}
                            <th className={`p-4 font-black text-emerald-600 text-[14px] sticky top-0 right-0 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border-l w-[100px] z-40 text-center`}>Efficiency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daysInMonth.map((day) => {
                            const key = getSafeKey(day); const dayData = trackerData[key] || {};
                            let totalEarnedWeight = 0; let totalPossibleWeight = 0;
                            
                            // EFFICIENCY CALCULATION (Ignoring Archived)
                            const activeHabits = habits.filter(h => !archivedHabits.includes(h));
                            activeHabits.forEach(h => { 
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
                                    
                                    {/* FILTERED HABITS CELLS */}
                                    {activeHabits.map((h, i) => {
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
                            <th className={`p-4 font-black ${getTextMuted()} text-[9px] uppercase tracking-widest sticky left-0 z-40 text-center border-r border-b ${getTableHeadStyle()} shadow-[4px_0_8px_rgba(0,0,0,0.3)] w-[120px] min-w-[120px]`}>
                              <div className="flex items-center justify-center gap-2">
                                <button 
  onClick={toggleTableOrientation} 
  className={`p-1.5 rounded-lg border transition-all active:scale-90 shadow-sm
    ${theme === 'dark' 
      ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600' 
      : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`} 
  title="Switch to Vertical View"
>
  <TableRotateIcon />
</button>
                                <span>DATE Log</span>
                              </div>
                            </th>
                            {daysInMonth.map((day) => {
                                const key = getSafeKey(day); 
                                const isToday = new Date().toDateString() === day.toDateString();
                                const cellBgStyle = isToday 
                                  ? (theme === 'dark' ? 'bg-emerald-900/40 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-emerald-50 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]') 
                                  : (theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100');
                                return (
                                    <th key={key} id={`col-${key}`} className={`p-2 border-r border-b transition-all duration-500 w-[calc((100vw-160px)/10)] min-w-[calc((100vw-160px)/10)] ${cellBgStyle} ${isToday ? 'border-emerald-500/50 shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-100 dark:border-slate-800'}`}>
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
                            <td className={`p-2 font-black text-[12px] uppercase sticky left-0 z-20 border-r border-b text-center transition-colors ${getTableHeadStyle()} text-emerald-400 shadow-[4px_0_8px_rgba(0,0,0,0.3)]`}>
                                <div className="w-full px-1 font-black leading-tight break-words">Efficiency</div>
                            </td>
                            {daysInMonth.map(day => {
                                const key = getSafeKey(day); const dayData = trackerData[key] || {};
                                let earned = 0; 
                                
                                // EFFICIENCY CALCULATION (Ignoring Archived)
                                const activeHabits = habits.filter(h => !archivedHabits.includes(h));
                                activeHabits.forEach(h => { const v = typeof dayData[h] === 'number' ? dayData[h] : (dayData[h] ? 100 : 0); earned += (v / 100); });
                                const progress = activeHabits.length > 0 ? Math.round((earned / activeHabits.length) * 100) : 0;
                                
                                return (
                                    <td key={key} className={`p-2 border-x border-b text-center text-[10px] font-black transition-all duration-500 w-[calc((100vw-160px)/10)] min-w-[calc((100vw-160px)/10)] ${new Date().toDateString() === day.toDateString() ? (theme === 'dark' ? 'bg-emerald-900/20 border-emerald-500/30 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]' : 'bg-emerald-50/50 border-emerald-400/30 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]') : 'border-slate-100 dark:border-slate-800'}`}>
                                    <span className={progress === 100 ? 'text-emerald-500' : progress > 0 ? 'text-blue-500' : 'text-slate-300'}><AnimatedNumber value={progress} /></span>
                                    </td>
                                );
                            })}
                        </tr>
                        {/* FILTERED HABITS ROWS */}
                        {habits.filter(h => !archivedHabits.includes(h)).map((habit, hIdx) => (
                            <tr key={hIdx} className="h-[68px]">
                                <td className={`p-1 font-black uppercase sticky left-0 z-20 border-r border-b text-center transition-colors ${getTableHeadStyle()} text-slate-400 shadow-[4px_0_8px_rgba(0,0,0,0.3)]`} style={{ fontSize: `${textSizes.table2}px` }}>
                                    <div className="truncate w-full px-1 font-black leading-tight">{habit}</div>
                                </td>
                                {daysInMonth.map(day => {
                                    const key = getSafeKey(day); const val = typeof trackerData[key]?.[habit] === 'number' ? trackerData[key][habit] : (trackerData[key]?.[habit] ? 100 : 0);
                                    return (
                                        <td key={key} className={`p-1.5 border-x border-b text-center transition-all duration-500 w-[calc((100vw-160px)/10)] min-w-[calc((100vw-160px)/10)] ${new Date().toDateString() === day.toDateString() ? (theme === 'dark' ? 'bg-emerald-900/20 border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.08)]' : 'bg-emerald-50/50 border-emerald-400/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.08)]') : 'border-slate-100 dark:border-slate-800'}`}>
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
          <p className={`text-[15px] md:text-[16px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] ${getTextMuted()}`}>
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
        {/* Habit Detail Modal Clean Version Below */}
        {viewingHabitMap && habitInsights && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => { setViewingHabitMap(null); setIsEditingTabName(false); }}>
              {/* Forced Horizontal Layout for all modes */}
{/* Compact Locked Layout: 20% Smaller & No Sidebar Scroll */}
<motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className={`rounded-[1.2rem] md:rounded-[2rem] w-[98vw] md:w-full max-w-[720px] h-fit max-h-[85vh] overflow-hidden shadow-2xl flex flex-row transition-colors ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
                
                {/* Slim Sidebar - Forced Fit */}
                <div className={`p-2 md:p-5 w-[105px] md:w-60 flex flex-col items-center border-r shrink-0 overflow-hidden ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="relative w-14 h-14 md:w-28 md:h-28 flex items-center justify-center mb-2 md:mb-5 shrink-0">
                    <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 144 144">
                      <circle cx="72" cy="72" r="64" fill="none" stroke={theme==='dark'?'#334155':'#e2e8f0'} strokeWidth="10" />
                      <motion.circle initial={{ strokeDashoffset: 402 }} animate={{ strokeDashoffset: 402 - (402 * habitInsights.score / 100) }} transition={{ duration: 1.5, ease: "easeOut" }} cx="72" cy="72" r="64" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray={402} strokeLinecap="round" />
                    </svg>
                    <div className="flex flex-col items-center"><span className={`text-sm md:text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}><AnimatedNumber value={habitInsights.score} /></span><span className={`text-[5px] md:text-[8px] font-black ${getTextMuted()} uppercase tracking-widest`}>Score</span></div>
                  </div>

                  {/* Super Compact Goal Input */}
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
                        setHabitConfigs(nc); 
                        save(trackerData, habits, nc);
                      }} 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.currentTarget.blur();
                      }}
                      className={`w-full text-center text-xl font-black p-1 rounded bg-transparent focus:outline-none focus:text-emerald-500 transition-colors`} 
                    />
                  </div>

                  {/* Priority slider removed from here to reduce clutter */}
                  
                  <div className="w-full space-y-1.5 md:space-y-4">
                    {/* Unified Rank Card with Trophy Icon */}
                    <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-sm' : 'bg-white border-slate-100 shadow-sm'} py-2 px-2 md:p-4 rounded-xl border flex flex-col items-center text-center transition-all relative overflow-hidden group/rank w-full`}>
                      <div className={`mb-1 transition-all duration-500 ${
                        habitInsights.level === "Grandmaster" ? "text-emerald-500 scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" : 
                        habitInsights.level === "Elite" ? "text-blue-500" : 
                        habitInsights.level === "Adept" ? "text-purple-500" : 
                        habitInsights.level === "Apprentice" ? "text-amber-500" : "text-slate-400 opacity-50"
                      }`}>
                        <TrophyIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className={`text-[6px] md:text-[9px] block uppercase font-black ${getTextMuted()} leading-none mb-0.5`}>Rank</span>
                        <span className={`text-[10px] md:text-xs font-black transition-colors ${
                          habitInsights.level === "Grandmaster" ? "text-emerald-500" : (theme === 'dark' ? 'text-slate-200' : 'text-slate-800')
                        }`}>{habitInsights.level}</span>
                      </div>
                      
                      {/* Sub-indicator for Milestone Progress inside the card */}
                      <div className="flex gap-0.5 mt-2 opacity-30 group-hover/rank:opacity-100 transition-opacity">
                        {['Seed', 'Apprentice', 'Adept', 'Elite', 'Grandmaster'].map((r) => (
                          <div key={r} className={`w-1 h-1 rounded-full ${habitInsights.level === r ? 'bg-emerald-500 scale-125' : 'bg-slate-600'}`} />
                        ))}
                      </div>
                    </div>

                    <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-sm' : 'bg-white border-slate-100 shadow-sm'} py-2 px-2 md:p-3 rounded-xl border flex flex-col items-center text-center transition-colors w-full`}><div className="text-orange-600 scale-75 md:scale-90 mb-1"><FlameIcon /></div><div><span className={`text-[6px] md:text-[9px] block uppercase font-black ${getTextMuted()} leading-none`}>Streak</span><span className={`text-[10px] md:text-xs font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{habitInsights.currentStreak}d</span></div></div>
                    <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-sm' : 'bg-white border-slate-100 shadow-sm'} py-2 px-2 md:p-3 rounded-xl border flex flex-col items-center text-center transition-colors ring-2 ring-emerald-500/10 w-full`}><div className="text-yellow-500 scale-75 md:scale-90 mb-1"><TrophyIcon /></div><div><span className={`text-[6px] md:text-[9px] block uppercase font-black ${getTextMuted()} leading-none`}>Best</span><span className={`text-[10px] md:text-xs font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{habitInsights.bestStreak}d</span></div></div>
                    {/* Redundant Milestone grid removed */}
                  </div>

                  {/* Buttons Fix - Reduced Padding & Margin */}
                  <div className="flex flex-col gap-1.5 w-full mt-4 md:mt-8">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleArchiveHabit(viewingHabitMap)} className={`w-full md:flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 px-2 md:px-4 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white border border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-500 hover:text-white'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7"/><path d="M9 13v-3"/><path d="M15 13v-3"/></svg>
                      Archive
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowDeleteConfirm(true)} className="w-full md:flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 px-2 md:px-4 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20"><TrashIcon /> Delete</motion.button>
                  </div>
                </div>

                {/* MAIN CALENDAR SECTION - 20% Smaller Padding */}
                <div className="flex-1 p-2 md:p-5 flex flex-col overflow-y-auto custom-scrollbar">
                  <div className="flex items-start justify-between mb-6 gap-3">
                    <div className="flex-1 flex flex-col items-center text-center">
                      <div className="flex flex-col items-center gap-1.5 w-full">
                        {isEditingTabName ? (
                          <input autoFocus className={`text-xl font-black bg-transparent focus:outline-none border-b-2 border-emerald-500 text-center w-full max-w-[200px] ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`} value={tempHabitName} onChange={(e) => setTempHabitName(e.target.value)} onBlur={handleTabRename} onKeyDown={(e) => e.key === 'Enter' && handleTabRename()} />
                        ) : (
                          <h3 className={`text-lg md:text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} leading-tight cursor-pointer hover:text-emerald-500 transition-colors flex items-center justify-center gap-2 group w-full`} onClick={() => { setIsEditingTabName(true); setTempHabitName(viewingHabitMap); }}>
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
                            setHabitConfigs(newConfigs);
                            save(trackerData, habits, newConfigs);
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
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1 hover:text-emerald-500 transition-colors"><ChevronLeftIcon /></button>
                        <span className="text-[10px] font-black uppercase tracking-widest min-w-[80px] text-center">{currentDate.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1 hover:text-emerald-500 transition-colors"><ChevronRightIcon /></button>
                        </div>
                    </div>
                    <button onClick={() => { setViewingHabitMap(null); setIsEditingTabName(false); }} className={`p-3 transition-all ${getTextMuted()} hover:text-rose-500 shrink-0`}><XIcon /></button>
                  </div>

                  {/* Relocated Super Compact Priority Slider */}
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
                        setHabitConfigs(nc);
                        save(trackerData, habits, nc);
                      }}
                      className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-all"
                    />
                  </div>

                  {/* Last 7 Days Activity Bar */}
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
                                id={`bar-fill-${day.key}`} // This allows direct DOM updates
                                initial={{ height: 0 }}
                                animate={{ height: `${displayPct}%` }}
                                // Snappy spring physics
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

{/* --- ARCHIVE MODAL --- */}
        {showArchiveModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[350] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowArchiveModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative flex flex-col max-h-[85vh]`} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowArchiveModal(false)} className={`absolute top-6 right-6 p-2 ${getTextMuted()} hover:text-rose-500 transition-all`}><XIcon /></button>
              
              <div className="mb-6 shrink-0">
                <p className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-[0.2em] mb-1`}>Hidden Habits</p>
                <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Archived List</h3>
              </div>

              <div className="overflow-y-auto custom-scrollbar pr-2 space-y-3">
                {archivedHabits.length > 0 ? (
                  archivedHabits.map(habit => (
                    <div key={habit} className={`p-4 rounded-2xl border flex items-center justify-between ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                      <span className={`text-sm font-black uppercase ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{habit}</span>
                      <button 
                        onClick={() => toggleArchiveHabit(habit)}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200'}`}
                      >
                        Restore
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 opacity-30 flex flex-col items-center">
                    <div className="scale-150 mb-4 grayscale opacity-50"><TrophyIcon /></div>
                    <p className="font-black uppercase text-xs">No archived habits</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
{/* --- CATEGORY MANAGER MODAL --- */}
        {showCategoryManager && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setShowCategoryManager(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-[2rem] w-full max-w-sm p-6 shadow-2xl overflow-hidden`} onClick={e => e.stopPropagation()}>
              
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Manage Categories</h3>
                <button onClick={() => setShowCategoryManager(false)} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}><XIcon /></button>
              </div>

              {/* Add New Category Input */}
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  placeholder="New category..." 
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualAddCategory()}
                  className={`flex-1 px-4 py-3 rounded-xl text-xs font-bold focus:outline-none border-2 transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 focus:border-emerald-500 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 focus:border-emerald-500 text-slate-800'}`}
                />
                <button 
                  onClick={handleManualAddCategory}
                  disabled={!newCatInput.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-all"
                >
                  <PlusIcon />
                </button>
              </div>

              {/* Category List */}
              <div className="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
                {categories.map(cat => (
                  <div key={cat} className={`flex items-center justify-between p-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    
                    {editingCat?.name === cat ? (
                      <input 
                        autoFocus
                        type="text" 
                        value={editingCat.temp}
                        onChange={(e) => setEditingCat({ ...editingCat, temp: e.target.value })}
                        onBlur={() => handleCategoryRename(cat, editingCat.temp)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCategoryRename(cat, editingCat.temp)}
                        className={`w-full bg-transparent font-black uppercase text-[10px] focus:outline-none border-b border-emerald-500 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}
                      />
                    ) : (
                      <span className={`text-[10px] font-black uppercase ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{cat}</span>
                    )}

                    <div className="flex items-center gap-1">
                      {cat !== 'all' && (
                        <>
                          <button 
                            onClick={() => setEditingCat({ name: cat, temp: cat })}
                            className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                          >
                            <EditIcon />
                          </button>
                          <button 
                            onClick={() => deleteCategory(cat)}
                            className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`}
                          >
                            <TrashIcon />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          </motion.div>
        )}

        {/* --- LEVEL UP MODAL --- */}
        {showLevelUpModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[400] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4" onClick={() => setShowLevelUpModal(false)}>
            <motion.div 
              initial={{ scale: 0.5, y: 100 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="relative w-full max-w-sm bg-slate-900 border-2 border-emerald-500/50 rounded-[3rem] p-10 text-center overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.4)]"
              onClick={e => e.stopPropagation()}
            >
              {/* Radial Burst Background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-slate-900/50 to-slate-900 z-0 animate-pulse"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
                  {/* Big Custom Trophy Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                </div>
                
                <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2 drop-shadow-md">
                  LEVEL UP!
                </h2>
                
                <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-600 mb-4 filter drop-shadow-[0_4px_0_rgba(6,78,59,0.5)]">
                  {xpStats.level}
                </div>
                
                <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-xs mb-8">
                  Keep Crushing It
                </p>
                
                <button 
                  onClick={() => setShowLevelUpModal(false)}
                  className="w-full py-4 rounded-2xl bg-white text-emerald-600 font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  Continue
                </button>
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
                <button onClick={() => { requestNotificationPermission(); setPomoActive(!pomoActive); }} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${pomoActive ? 'bg-amber-500 shadow-amber-500/20' : 'bg-emerald-500 shadow-emerald-500/20'} text-white shadow-xl`}>
                  {pomoActive ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button onClick={() => { setPomoActive(false); setPomoTime(pomoMode === 'work' ? 25*60 : 5*60); }} className={`w-12 h-12 rounded-full flex items-center justify-center border ${theme === 'dark' ? 'border-slate-700 text-slate-500 hover:text-white' : 'border-slate-200 text-slate-400 hover:text-slate-800'} transition-all`}>
                  <RefreshIcon />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* --- TEXT SIZE MODAL --- */}
        {showTextSizeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setShowTextSizeModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-[2rem] w-full max-w-sm p-6 shadow-2xl overflow-hidden`} onClick={e => e.stopPropagation()}>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}><TextSizeIcon /></div>
                  <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Display Settings</h3>
                </div>
                <button onClick={() => setShowTextSizeModal(false)} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}><XIcon /></button>
              </div>

              <div className="space-y-6">
                {/* Habit Card Size */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Habit Card Size</label>
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">{textSizes.tabSize || 110}px</span>
                  </div>
                  <input type="range" min="60" max="200" step="5" value={textSizes.tabSize || 110} onChange={(e) => updateTextSize('tabSize', e.target.value)} className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </div>

                {/* Habit Tab Size */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Habit Text</label>
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">{textSizes.habit}px</span>
                  </div>
                  <input type="range" min="5" max="24" step="1" value={textSizes.habit} onChange={(e) => updateTextSize('habit', e.target.value)} className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </div>

                {/* Table 1 (Vertical) Size */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Table 1 Text (Vertical)</label>
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">{textSizes.table1}px</span>
                  </div>
                  <input type="range" min="8" max="24" step="1" value={textSizes.table1} onChange={(e) => updateTextSize('table1', e.target.value)} className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </div>

                {/* Table 2 (Horizontal) Size */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Table 2 Text (Horizontal)</label>
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">{textSizes.table2}px</span>
                  </div>
                  <input type="range" min="6" max="20" step="1" value={textSizes.table2} onChange={(e) => updateTextSize('table2', e.target.value)} className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </div>
              </div>

              {/* Restore Defaults Button */}
              <div className={`mt-8 pt-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                <button 
                  onClick={() => {
                    const defaults = { habit: 14, table1: 12, table2: 11, tabSize: 110 };
                    setTextSizes(defaults);
                    localStorage.setItem('adib_text_sizes', JSON.stringify(defaults));
                  }} 
                  className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
                >
                  <RefreshIcon /> Restore Defaults
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
        @keyframes glow-blue { 0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.4); } 50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); } 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.4); } }
        .animate-glow-blue { animation: glow-blue 2s infinite ease-in-out; filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.6)); }
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