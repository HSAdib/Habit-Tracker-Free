/* Credit: Adib | APM | RU | Bangladesh | email: hasanshahriaradib@gmail.com | updated:22-01-2026 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase.config';
import { useHabitStore } from './store/useHabitStore';
import { getSafeKey, parseLocalDate, loadConfettiScript, solveFluidPath } from './utils';
import HeaderProfile from './components/HeaderProfile';
import AuthModal from './components/AuthModal';
import {
  ResponsiveContainer, AreaChart, BarChart, CartesianGrid,
  XAxis, YAxis, Area, Bar, Tooltip as RechartsTooltip, Cell
} from 'recharts';
// --- Icons ---
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
const MaximizeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
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
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);
const ImportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);
const OrderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
);
const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
);
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
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
  const isHydrating = useHabitStore(state => state.isHydrating);
  const trackerData = useHabitStore(state => state.trackerData);
  const habits = useHabitStore(state => state.habits);
  const habitConfigs = useHabitStore(state => state.habitConfigs);
  const categories = useHabitStore(state => state.categories);
  const archivedHabits = useHabitStore(state => state.archivedHabits);
  const theme = useHabitStore(state => state.theme);
  const tableOrientation = useHabitStore(state => state.tableOrientation);
  const textSizes = useHabitStore(state => state.textSizes);
  const isMobileMode = useHabitStore(state => state.isMobileMode);
  
  const currentDate = useHabitStore(state => state.currentDate);
  const setCurrentDate = useHabitStore(state => state.setCurrentDate);
  const viewingHabitMap = useHabitStore(state => state.viewingHabitMap);
  const setViewingHabitMap = useHabitStore(state => state.setViewingHabitMap);
  const heatmapFilter = useHabitStore(state => state.heatmapFilter);
  const setHeatmapFilter = useHabitStore(state => state.setHeatmapFilter);
  const weeklyGraphFilter = useHabitStore(state => state.weeklyGraphFilter);
  const setWeeklyGraphFilter = useHabitStore(state => state.setWeeklyGraphFilter);
  const dashboardGraphFilter = useHabitStore(state => state.dashboardGraphFilter);
  const setDashboardGraphFilter = useHabitStore(state => state.setDashboardGraphFilter);
  const selectedCategory = useHabitStore(state => state.selectedCategory);
  const setSelectedCategory = useHabitStore(state => state.setSelectedCategory);
  const savedLevel = useHabitStore(state => state.savedLevel);
  
  const updateHabitValueStore = useHabitStore(state => state.updateHabitValue);
  const setTheme = useHabitStore(state => state.setTheme);
  const setStorePartial = useHabitStore(state => state.setStorePartial);
  const savePartialToIDB = useHabitStore(state => state.savePartialToIDB);
  const initStore = useHabitStore(state => state.init);
  const user = useHabitStore(state => state.user);
  const isAuthenticated = useHabitStore(state => state.isAuthenticated);

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Failed', error);
    }
  };

  const [editingHabitName, setEditingHabitName] = useState(null);
  const [editingManageListHabitName, setEditingManageListHabitName] = useState(null);
  const [tempHabitName, setTempHabitName] = useState("");
  const [editingNoteDate, setEditingNoteDate] = useState(null);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const [showMonthlyGraphModal, setShowMonthlyGraphModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showTextSizeModal, setShowTextSizeModal] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showLevelDetailsModal, setShowLevelDetailsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTrophyDetailsModal, setShowTrophyDetailsModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [newCatInput, setNewCatInput] = useState("");
  const [activeSlider, setActiveSlider] = useState(null); 
  const [isEditingTabName, setIsEditingTabName] = useState(false);
  const [tableHeight, setTableHeight] = useState(484);
  const [tempGoalVal, setTempGoalVal] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const prevLevelRef = useRef(savedLevel);
  const longPressTimer = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    initStore();
  }, [initStore]);

  const save = (newTrackerData, newHabits, newConfigs) => {
    savePartialToIDB({
      trackerData: newTrackerData,
      habits: newHabits,
      habitConfigs: newConfigs
    });
  };

  const updateHabitValue = (dateKey, habit, val) => {
    updateHabitValueStore(dateKey, habit, val);
  };
  
  const setHabits = (newHabits) => setStorePartial({ habits: newHabits });
  const setHabitConfigs = (newConfigs) => setStorePartial({ habitConfigs: newConfigs });
  const setTrackerData = (newData) => setStorePartial({ trackerData: newData });
  const setCategories = (newCategories) => {
    setStorePartial({ categories: newCategories });
    savePartialToIDB({ categories: newCategories });
  };
  const setArchivedHabits = (newArchived) => {
    setStorePartial({ archivedHabits: newArchived });
    savePartialToIDB({ archivedHabits: newArchived });
  };
  const setTextSizes = (newSizes) => {
    setStorePartial({ textSizes: newSizes });
    savePartialToIDB({ textSizes: newSizes });
  };
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };
  
  const toggleTableOrientation = () => {
    const newOrientation = tableOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    setStorePartial({ tableOrientation: newOrientation });
    savePartialToIDB({ tableOrientation: newOrientation });
  };

  const toggleMobileMode = () => {
    const newMode = !isMobileMode;
    setStorePartial({ isMobileMode: newMode });
    savePartialToIDB({ isMobileMode: newMode });
    if (newMode) {
      setTextSizes({ ...textSizes, habit: 10, table1: 9, table2: 9, tabSize: 75 });
    } else {
      setTextSizes({ ...textSizes, habit: 14, table1: 12, table2: 11, tabSize: 110 });
    }
  };

  const updateTextSize = (key, value) => {
    const newSizes = { ...textSizes, [key]: parseInt(value) };
    setTextSizes(newSizes);
  };

  const deleteCategory = (catToDelete) => {
    if (catToDelete === 'all') return;
    setCategoryToDelete(catToDelete);
  };

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    const newCats = categories.filter(c => c !== categoryToDelete);
    setCategories(newCats);
    const newConfigs = { ...habitConfigs };
    Object.keys(newConfigs).forEach(h => {
      if (newConfigs[h].category === categoryToDelete) {
        newConfigs[h].category = 'all';
      }
    });
    setHabitConfigs(newConfigs);
    if (selectedCategory === categoryToDelete) setSelectedCategory('all');
    save(trackerData, habits, newConfigs);
    setCategoryToDelete(null);
  };

  const handleCategoryRename = (oldName, newName) => {
    const formattedName = newName.toLowerCase().trim();
    if (!formattedName || formattedName === oldName || categories.includes(formattedName)) return;

    const newCats = categories.map(c => c === oldName ? formattedName : c);
    setCategories(newCats);

    const newConfigs = { ...habitConfigs };
    Object.keys(newConfigs).forEach(h => {
      if (newConfigs[h].category === oldName) {
        newConfigs[h].category = formattedName;
      }
    });
    setHabitConfigs(newConfigs);

    if (selectedCategory === oldName) setSelectedCategory(formattedName);

    save(trackerData, habits, newConfigs);
    setEditingCat(null);
  };

  const handleManualAddCategory = () => {
    const name = newCatInput.toLowerCase().trim();
    if (name && !categories.includes(name)) {
      const newCats = [...categories, name];
      setCategories(newCats);
      setNewCatInput("");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const saved = localStorage.getItem('adib_mobile_mode');
      if (!saved) {
        setStorePartial({ isMobileMode: window.innerWidth <= 768 });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setStorePartial]);

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

    const timer = setTimeout(scrollToToday, 500);

    const handleTableScroll = () => {
      if (!isMobileMode) {
        let minHeightLimit = 350;
        let diffOffset = window.innerHeight - 350;
        let targetHeight = diffOffset - 120;
        if (targetHeight < minHeightLimit) targetHeight = minHeightLimit;

        setTableHeight(targetHeight);
      }
    };
    const container = scrollContainerRef.current;
    if (container) container.addEventListener('scroll', handleTableScroll);
    return () => {
      clearTimeout(timer);
      if (container) container.removeEventListener('scroll', handleTableScroll);
    };
  }, [currentDate, habits, tableOrientation, isMobileMode]);

  // Global ESC key handler — closes any open modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (viewingHabitMap) { setViewingHabitMap(null); setIsEditingTabName(false); return; }
      if (editingNoteDate) { setEditingNoteDate(null); return; }
      if (showDeleteConfirm) { setShowDeleteConfirm(false); return; }
      if (showWeeklyModal) { setShowWeeklyModal(false); return; }
      if (showMonthlyGraphModal) { setShowMonthlyGraphModal(false); return; }
      if (showAllNotes) { setShowAllNotes(false); return; }
      if (showOrderModal) { setShowOrderModal(false); return; }
      if (showCategoryManager) { setShowCategoryManager(false); return; }
      if (showTextSizeModal) { setShowTextSizeModal(false); return; }
      if (showArchiveModal) { setShowArchiveModal(false); return; }
      if (showLevelDetailsModal) { setShowLevelDetailsModal(false); return; }
      if (showTrophyDetailsModal) { setShowTrophyDetailsModal(false); return; }
      if (showLevelUpModal) { setShowLevelUpModal(false); return; }
      if (categoryToDelete) { setCategoryToDelete(null); return; }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingHabitMap, editingNoteDate, showDeleteConfirm, showWeeklyModal, showMonthlyGraphModal, showAllNotes, showOrderModal, showCategoryManager, showTextSizeModal, showArchiveModal, showLevelDetailsModal, showTrophyDetailsModal, showLevelUpModal, categoryToDelete]);

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
        if (imported && typeof imported === 'object' && imported.trackerData && typeof imported.trackerData === 'object' && Array.isArray(imported.habits)) {
          setTrackerData(imported.trackerData);
          setHabits(imported.habits);
          setHabitConfigs(imported.habitConfigs && typeof imported.habitConfigs === 'object' ? imported.habitConfigs : {});
          save(imported.trackerData, imported.habits, imported.habitConfigs && typeof imported.habitConfigs === 'object' ? imported.habitConfigs : {});
          alert("Data imported successfully!");
        } else {
          alert("Invalid backup file format.");
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
  }, [trackerData, habits, habitConfigs]);

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

      // Confetti Effect — using the utility to avoid raw <script> injection
      loadConfettiScript(() => {
        const duration = 3000;
        const end = Date.now() + duration;
        (function frame() {
          if (typeof window.confetti === 'function') {
            window.confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#10b981', '#3b82f6', '#f59e0b'] });
            window.confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#10b981', '#3b82f6', '#f59e0b'] });
          }
          if (Date.now() < end) requestAnimationFrame(frame);
        }());
      });
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

  // Per-habit current streak — powers the streak badge on habit cards
  const allHabitStreaks = useMemo(() => {
    const streaks = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    habits.forEach(habit => {
      let streak = 0;
      let checkDate = new Date(today);
      const todayKey = getSafeKey(checkDate);
      const todayValRaw = trackerData[todayKey]?.[habit] ?? 0;
      const todayVal = typeof todayValRaw === 'number' ? todayValRaw : (todayValRaw ? 100 : 0);
      if (Math.round(todayVal) < 100) checkDate.setDate(checkDate.getDate() - 1);
      while (true) {
        const key = getSafeKey(checkDate);
        const valRaw = trackerData[key]?.[habit] ?? 0;
        const val = typeof valRaw === 'number' ? valRaw : (valRaw ? 100 : 0);
        if (Math.round(val) >= 100) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
        else break;
      }
      streaks[habit] = streak;
    });
    return streaks;
  }, [habits, trackerData]);

  // True if ANY habit has been logged at any point — used for empty state
  const hasAnyData = useMemo(() =>
    Object.values(trackerData).some(day =>
      habits.some(h => { const v = day[h]; return typeof v === 'number' ? v > 0 : !!v; })
    ), [trackerData, habits]);

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
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak (counting backwards from today/yesterday)
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

    // Calculate all-time best streak
    const allDates = Object.keys(trackerData).sort();
    if (allDates.length > 0) {
      // Parse date locally to prevent UTC timezone offset bugs
      const [y, m, d_str] = allDates[0].split('-');
      let d = new Date(parseInt(y), parseInt(m) - 1, parseInt(d_str), 0, 0, 0, 0);
      
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

  const monthlyGraphData = useMemo(() => {
    return daysInMonth.map((day) => {
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
      
      return { 
        date: day.getDate(), 
        fullDate: day.toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' }),
        score: Math.round(pct)
      };
    });
  }, [daysInMonth, trackerData, habits, dashboardGraphFilter]);

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

  // (solveFluidPath is imported from ./utils — local duplicate removed)

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

  const CELL_SIZE = isMobileMode ? 9 : 11;
  const CELL_GAP = isMobileMode ? 2 : 3;

  const outerPadding = isMobileMode ? 'px-1 pt-4' : 'px-2 md:px-4 pt-8';
  const cardPadding = isMobileMode ? 'p-3 rounded-2xl' : 'p-6 rounded-[2.5rem]';
  const headerPadding = isMobileMode ? 'p-4 rounded-2xl mb-4 gap-4' : 'p-6 rounded-[2.5rem] mb-6 gap-6';
  const sectionGap = isMobileMode ? 'gap-3 mb-4' : 'gap-6 mb-8';
  const horizontalColWidth = isMobileMode ? '70px' : 'calc((100vw - 160px) / 10)';

 return (
    <div className={`min-h-screen ${getContainerBg()} font-sans pb-6 md:pb-20 select-none overflow-x-hidden`}>
      <Analytics />
      
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className={`max-w-7xl mx-auto ${outerPadding} flex flex-col min-h-screen`}>
        <div className="flex-grow">
          {/* Dashboard Header */}
          <motion.div variants={itemVariants} className={`flex flex-col lg:flex-row lg:items-center justify-between ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'} ${getCardStyle()} ${headerPadding} border transition-colors relative overflow-visible z-[100]`}>
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

                    {/* Mobile View Toggle */}
                    <button 
                      onClick={toggleMobileMode}
                      className={`p-1.5 rounded-lg transition-all border active:scale-90 flex items-center gap-1.5
                        ${isMobileMode 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                          : (theme === 'dark' 
                            ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          )}`}
                      title="Toggle Mobile Compatibility Mode"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                        <line x1="12" y1="18" x2="12.01" y2="18"/>
                      </svg>
                      <span className="text-[9px] font-black uppercase tracking-wider hidden sm:inline">
                        {isMobileMode ? 'Mobile View On' : 'Mobile View Off'}
                      </span>
                    </button>
                  </div>

                  {/* Status Zone - Separated from Buttons */}
                  <div className={`flex items-center gap-3 ml-4 md:ml-8 pl-4 md:pl-6 border-l ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                    <button 
                      onClick={() => setShowLevelDetailsModal(true)}
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all duration-500 cursor-pointer hover:scale-105 active:scale-95 ${getLevelBadgeStyle(xpStats.level)}`}
                      title="View Level Details"
                    >
                      Level {xpStats.level}
                    </button>
                    <button 
                      onClick={() => setShowTrophyDetailsModal(true)}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)] cursor-pointer hover:scale-105 active:scale-95 transition-all" 
                      title="View Win Milestones"
                    >
                      <TrophyIcon className="w-2.5 h-2.5 text-yellow-500" />
                      <span className="text-[9px] font-black text-yellow-500">{analytics.totalDone}</span>
                    </button>
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
                {/* Today quick-jump — only visible when not on the current month */}
                {(currentDate.getMonth() !== new Date().getMonth() || currentDate.getFullYear() !== new Date().getFullYear()) && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentDate(new Date())}
                    className={`ml-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${
                      theme === 'dark'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-emerald-100 border-emerald-300 text-emerald-600 hover:bg-emerald-200'
                    }`}
                    title="Jump to current month"
                  >
                    Today
                  </motion.button>
                )}
                </div>

                            {/* Right Side: Profile & Sync UI */}
              <div className="flex items-center gap-3 ml-auto">
                
                <div className={`w-px h-6 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
                
                {/* Header Profile Dropdown */}
                <HeaderProfile 
                  totalXP={xpStats.totalXP} 
                  bestStreak={analytics.totalDone} // Using total done as a fallback proxy for streak for the global profile, or we can use analytics
                  handleLogin={handleLogin} 
                  handleLogout={handleLogout} 
                  handleExport={handleExport} 
                  handleImport={handleImport} 
                />
              </div>
            </div>
          </motion.div>

          {/* Activity Section */}
          <div className={`${isMobileMode ? 'flex flex-col' : 'grid grid-cols-3'} ${sectionGap} items-stretch`}>
            <motion.div variants={itemVariants} className={`${isMobileMode ? '' : 'col-span-2'} ${getCardStyle()} ${cardPadding} border overflow-hidden flex flex-col transition-colors h-full min-w-0`}>
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
              
              <div className={`overflow-x-auto custom-scrollbar pb-2 ${isMobileMode ? 'whitespace-nowrap' : ''}`}>
                <div className="inline-block min-w-full">
                  <div className="relative h-3 mb-1" style={{ marginLeft: `${isMobileMode ? 16 : 24}px` }}>
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
            
            <motion.div variants={itemVariants} className={`${isMobileMode ? '' : 'col-span-1'} ${getCardStyle()} ${cardPadding} border relative overflow-hidden flex flex-col justify-between transition-colors h-full min-w-0`}>
              <div className="flex items-start mb-2 md:mb-4 justify-between">
                
                {/* Left Side: Vertical Stack */}
                <div className="flex flex-col gap-0.5 min-w-0 flex-1 mr-2 relative z-20">
                  {/* Row 1: Slim Dropdown Only */}
                  <div className="flex items-center gap-2">
                    <select 
                      value={dashboardGraphFilter}
                      onChange={(e) => setDashboardGraphFilter(e.target.value)}
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
                  
                  {/* Row 2: Big Percentage */}
                  <span className={`text-lg md:text-xl font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} leading-none mt-1`}>
                    {dashboardGraphFilter === 'all' ? analytics.monthlyPct : (analytics.habitPcts[dashboardGraphFilter] || 0)}%
                  </span>
                </div>

                {/* Right Side: Expand Graph Button */}
                <div className="flex items-center gap-2 shrink-0 z-20">
                  <button 
                    onClick={() => setShowMonthlyGraphModal(true)}
                    className={`p-2 rounded-xl transition-all border
                      ${theme === 'dark' 
                        ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-emerald-400 hover:bg-slate-800' 
                        : 'bg-white border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 shadow-sm'}`}
                    title="Detailed Monthly Graph"
                  >
                    <MaximizeIcon />
                  </button>
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
            : (theme === 'dark' ? 'border-emerald-800/60 hover:border-emerald-600 text-emerald-200/70' : 'border-emerald-300 hover:border-emerald-400 text-emerald-700/80')
        }`}
      >
        {/* Background Track - Given a distinct green hue so it looks like an empty bar */}
        <div className={`absolute inset-0 z-0 transition-colors duration-500 ${
          selectedCategory === cat 
            ? 'bg-emerald-900/80' 
            : (theme === 'dark' ? 'bg-emerald-950/60' : 'bg-emerald-50')
        }`} />
        
        {/* Progress Fill - Made much more vibrant so the loading state is obvious */}
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${categoryProgress[cat] || 0}%` }} 
          transition={{ duration: 1, ease: "easeOut" }}
          className={`absolute inset-y-0 left-0 z-0 h-full ${
            selectedCategory === cat 
              ? 'bg-emerald-500' 
              : 'bg-emerald-500/60'
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
  const pct = analytics.habitPcts[habit] ?? 0;
  
  // THE FIX: Prevent background cards from stealing focus when the modal is open!
  const isEditing = editingHabitName === habit && !showOrderModal; 
  
  return (
    <motion.div 
      layout 
      variants={itemVariants} 
      whileHover={{ y: -5, scale: 1.05 }} 
      key={habit} 
      className={`${getCardStyle()} cursor-pointer overflow-hidden group transition-all relative flex flex-col items-center justify-center rounded-full aspect-square border-0`}
      onClick={() => setViewingHabitMap(habit)}
      title={`${pct}% this month${allHabitStreaks[habit] > 0 ? ` · 🔥 ${allHabitStreaks[habit]} day streak` : ''}`}
    >
      
      <svg 
        className={`absolute transition-all duration-500 -rotate-90 inset-0 w-full h-full p-1`} 
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="47" fill="none" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} strokeWidth="4" />
        <motion.circle 
          cx="50" cy="50" r="47" fill="none" stroke="#10b981" strokeWidth="4" 
          strokeDasharray={295.3} initial={{ strokeDashoffset: 295.3 }} 
          animate={{ strokeDashoffset: 295.3 - (295.3 * pct / 100) }} 
          transition={{ duration: 1, ease: "easeInOut" }} strokeLinecap="round" 
        />
      </svg>
      
      <div className="z-10 text-center flex flex-col items-center px-2 w-full relative">
        {isEditing ? (
          <input 
            autoFocus 
            style={{ fontSize: `${textSizes.habit}px` }}
            className={`font-black uppercase w-full text-center bg-transparent focus:outline-none border-b-2 border-emerald-500 mb-1 leading-[1.1] ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`} 
            value={tempHabitName} 
            onChange={(e) => setTempHabitName(e.target.value)} 
            onBlur={() => handleDashboardRename(habit)} 
            onKeyDown={(e) => e.key === 'Enter' && handleDashboardRename(habit)} 
            onClick={(e) => e.stopPropagation()} 
          />
        ) : (
          <div className="relative flex items-center justify-center w-full group/name min-h-[14px]">
            <p style={{ fontSize: `${textSizes.habit}px` }} className="font-black uppercase opacity-80 leading-[1.1] line-clamp-2 text-center w-full px-1 break-words">{habit}</p>
            <button className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-emerald-500 transition-all absolute right-0" onClick={(e) => { e.stopPropagation(); setEditingHabitName(habit); setTempHabitName(habit); }}><EditIcon /></button>
          </div>
        )}
        <span className={`text-[19px] font-black mt-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
          <AnimatedNumber value={pct} />
        </span>
        {/* Streak badge */}
        {allHabitStreaks[habit] > 0 && (
          <div className="flex items-center gap-0.5 mt-0.5">
            <span className="text-[11px] leading-none">🔥</span>
            <span className={`text-[8px] font-black leading-none ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`}>{allHabitStreaks[habit]}d</span>
          </div>
        )}
      </div>
      
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
  className={`${getCardStyle()} flex items-center justify-center border-2 border-dashed transition-all rounded-full aspect-square ${theme === 'dark' ? 'border-slate-800 text-slate-700 hover:border-emerald-700' : 'border-slate-200 text-slate-300 hover:border-emerald-400'}`}
  title="Add New Habit"
>
  <PlusIcon />
</motion.button>

{selectedCategory === 'all' && (
  <motion.button layout whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowOrderModal(true)}
    className={`${getCardStyle()} flex items-center justify-center border-2 transition-all rounded-full aspect-square ${theme === 'dark' ? 'border-slate-800 text-slate-500 hover:text-emerald-400 hover:border-emerald-700' : 'border-slate-200 text-slate-400 hover:text-emerald-500 hover:border-emerald-400'}`}
    title="MANAGE LIST"
  >
    <OrderIcon />
  </motion.button>
)}
          </motion.div>
{/* Monthly Graph Detailed Modal */}
        {showMonthlyGraphModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowMonthlyGraphModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-[1.2rem] md:rounded-[2rem] w-full max-w-4xl p-6 md:p-8 shadow-2xl relative flex flex-col`} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowMonthlyGraphModal(false)} className={`absolute top-6 right-6 flex flex-col items-center gap-0.5 p-2 ${getTextMuted()} hover:text-rose-500 transition-all`} title="Close (ESC)"><XIcon /><span className="text-[6px] font-mono opacity-50">ESC</span></button>
              
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
                  {habits.map(h => (
                    <option key={h} value={h} className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>{h}</option>
                  ))}
                </select>
              </div>

              <div className={`w-full h-[60vh] rounded-3xl border p-4 md:p-6 ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
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
        )}

{/* Weekly Summary Popup Modal */}
        {showWeeklyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowWeeklyModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl relative`} onClick={e => e.stopPropagation()}>
              
              <button onClick={() => setShowWeeklyModal(false)} className={`absolute top-6 right-6 flex flex-col items-center gap-0.5 p-2 ${getTextMuted()} hover:text-rose-500 transition-all`} title="Close (ESC)"><XIcon /><span className="text-[6px] font-mono opacity-50">ESC</span></button>
              
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
              <button onClick={() => setShowAllNotes(false)} className={`absolute top-6 right-6 flex flex-col items-center gap-0.5 p-2 ${getTextMuted()} hover:text-rose-500 transition-all`} title="Close (ESC)"><XIcon /><span className="text-[6px] font-mono opacity-50">ESC</span></button>
              
              <div className="mb-6 shrink-0">
                <p className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-[0.2em] mb-1`}>Reflection Log</p>
                <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Journal History</h3>
              </div>

              <div className="overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {Object.keys(trackerData).filter(k => trackerData[k]?.note).length > 0 ? (
                  Object.entries(trackerData)
                    .filter(([k, v]) => v.note && v.note.trim())
                    .sort((a, b) => parseLocalDate(b[0]) - parseLocalDate(a[0])) // Sort by newest first (parseLocalDate avoids UTC timezone offset bugs)
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
          {/* Empty State Onboarding — only shown when no habit data exists */}
          {!hasAnyData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${getCardStyle()} border rounded-[2.5rem] mb-8 relative overflow-hidden transition-colors`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
              <div className="relative z-10 py-12 px-8 text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 ${
                  theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <span className="text-3xl">🌱</span>
                </div>
                <h3 className={`text-2xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  Welcome to Habit Mastery!
                </h3>
                <p className={`text-sm font-medium mb-8 max-w-sm mx-auto leading-relaxed ${getTextMuted()}`}>
                  Start tracking your habits by clicking the cells in the table below.
                  Long-press for partial completion, tap for full completion.
                </p>
                <div className={`flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest ${getTextMuted()}`}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-base shadow-lg shadow-emerald-500/30">✔</div>
                    <span>Complete</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-blue-500/30">50%</div>
                    <span>Partial</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center text-red-500 ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                    }`}>✘</div>
                    <span>Missed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* Table Log */}
<motion.div variants={itemVariants} className={`${getCardStyle()} ${isMobileMode ? 'rounded-2xl' : 'rounded-[2.5rem]'} overflow-hidden mb-8 relative transition-colors`}>
    
    <div 
  ref={scrollContainerRef} 
  className={`overflow-x-auto overflow-y-auto custom-scrollbar ${isMobileMode ? 'whitespace-nowrap' : ''}`}
  style={{ 
    maxHeight: tableOrientation === 'vertical' ? `${tableHeight}px` : 'none',
    willChange: tableOrientation === 'vertical' ? 'max-height' : 'auto'
  }}
>
        <table 
          className={`border-separate border-spacing-0 ${
            isMobileMode 
              ? (tableOrientation === 'vertical' ? 'min-w-[850px] table-fixed' : 'min-w-[1200px] table-auto') 
              : 'w-full min-w-full ' + (tableOrientation === 'vertical' ? 'table-fixed' : 'table-auto')
          }`}
        >
            {tableOrientation === 'vertical' ? (
                /* --- Table 1: Vertical Layout --- */
                <>
                    <thead className={`sticky top-0 z-30 shadow-sm ${getTableHeadStyle()} border-b transition-colors`}>
                        <tr className="h-[72px]">
                            <th className={`p-5 font-black ${getTextMuted()} text-[9px] uppercase tracking-widest sticky top-0 left-0 border-r border-b ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} w-[120px] min-w-[120px] z-40 text-center`}>
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
                            {habits.filter(h => !archivedHabits.includes(h)).map((h, i) => <th key={i} className={`p-2 border-r border-b uppercase text-center font-black transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`} style={{ fontSize: `${textSizes.table1}px`, minWidth: isMobileMode ? '90px' : 'auto' }}><div className="px-1 leading-tight break-words" title={h}>{h}</div></th>)}
                            <th className={`p-4 font-black text-emerald-600 text-[14px] sticky top-0 right-0 border-l border-b ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} w-[100px] z-40 text-center`}>Efficiency</th>
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
                                    <td className={`p-2 sticky left-0 z-10 border-r border-b transition-all duration-500 ${rowBgStyle} ${isToday ? 'border-l-4 border-l-emerald-500' : ''} ${theme === 'dark' ? 'border-r-slate-700' : 'border-r-slate-200'}`}>
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="tooltip-trigger">
                                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setEditingNoteDate(key)} className={`p-2 rounded-xl transition-all ${dayData.note ? 'bg-blue-600 text-white shadow-md' : (theme === 'dark' ? 'bg-slate-800 text-slate-600 hover:bg-slate-700' : 'bg-slate-100 text-slate-300 hover:bg-slate-200')}`}><NoteIcon /></motion.button>
                                              <span className="tooltip-content" style={{ whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {dayData.note ? `“${dayData.note.split('\n')[0].substring(0, 45)}${dayData.note.split('\n')[0].length > 45 ? '…' : ''}”` : 'Add reflection'}
                                              </span>
                                            </div>
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
                                    <td className={`p-2 sticky right-0 z-10 border-l border-b transition-all duration-500 text-center font-black text-sm ${rowBgStyle} ${isToday ? 'border-r-4 border-r-emerald-500' : ''} ${theme === 'dark' ? 'border-l-slate-700' : 'border-l-slate-200'}`}>
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
                            <th className={`p-4 font-black ${getTextMuted()} text-[9px] uppercase tracking-widest sticky left-0 z-40 text-center border-r border-b ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} shadow-[4px_0_8px_rgba(0,0,0,0.3)] w-[120px] min-w-[120px]`}>
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
                                    <th key={key} id={`col-${key}`} className={`p-2 border-r border-b transition-all duration-500 ${cellBgStyle} ${isToday ? (theme === 'dark' ? 'border-emerald-500/50 shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]' : 'border-emerald-400 shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]') : (theme === 'dark' ? 'border-r-slate-800 border-b-slate-700' : 'border-r-slate-100 border-b-slate-200')}`} style={{ width: horizontalColWidth, minWidth: horizontalColWidth }}>
                                    <div className="flex flex-col items-center gap-1">
                                            <div className="tooltip-trigger flex items-center justify-center">
                                              <motion.button 
  whileTap={{ scale: 0.9 }} 
  onClick={() => setEditingNoteDate(key)} 
  className={`p-2 rounded-xl transition-all ${trackerData[key]?.note ? 'bg-blue-600 text-white shadow-md' : (theme === 'dark' ? 'bg-slate-800 text-slate-600 hover:bg-slate-700' : 'bg-slate-100 text-slate-300 hover:bg-slate-200')}`}
>
  <NoteIcon />
</motion.button>
                                              <span className="tooltip-content" style={{ whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {trackerData[key]?.note ? `“${trackerData[key].note.split('\n')[0].substring(0, 45)}${trackerData[key].note.split('\n')[0].length > 45 ? '…' : ''}”` : 'Add reflection'}
                                              </span>
                                            </div>
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
                            <td className={`p-2 font-black text-[12px] uppercase sticky left-0 z-20 border-r border-b text-center transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} text-emerald-400 shadow-[4px_0_8px_rgba(0,0,0,0.3)]`}>
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
                                    <td key={key} className={`p-2 border-r border-b text-center text-[10px] font-black transition-all duration-500 ${new Date().toDateString() === day.toDateString() ? (theme === 'dark' ? 'bg-emerald-900/20 border-emerald-500/30 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]' : 'bg-emerald-50/50 border-emerald-400/30 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]') : (theme === 'dark' ? 'border-r-slate-800 border-b-slate-800' : 'border-r-slate-100 border-b-slate-100')}`} style={{ width: horizontalColWidth, minWidth: horizontalColWidth }}>
                                    <span className={progress === 100 ? 'text-emerald-500' : progress > 0 ? 'text-blue-500' : 'text-slate-300'}><AnimatedNumber value={progress} /></span>
                                    </td>
                                );
                            })}
                        </tr>
                        {/* FILTERED HABITS ROWS */}
                        {habits.filter(h => !archivedHabits.includes(h)).map((habit, hIdx) => (
                            <tr key={hIdx} className="h-[68px]">
                                <td className={`p-1 font-black uppercase sticky left-0 z-20 border-r border-b text-center transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} text-slate-400 shadow-[4px_0_8px_rgba(0,0,0,0.3)]`} style={{ fontSize: `${textSizes.table2}px` }}>
                                    <div className="truncate w-full px-1 font-black leading-tight">{habit}</div>
                                </td>
                                {daysInMonth.map(day => {
                                    const key = getSafeKey(day); const val = typeof trackerData[key]?.[habit] === 'number' ? trackerData[key][habit] : (trackerData[key]?.[habit] ? 100 : 0);
                                    return (
                                        <td key={key} className={`p-1.5 border-r border-b text-center transition-all duration-500 ${new Date().toDateString() === day.toDateString() ? (theme === 'dark' ? 'bg-emerald-900/20 border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.08)]' : 'bg-emerald-50/50 border-emerald-400/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.08)]') : (theme === 'dark' ? 'border-r-slate-800 border-b-slate-800' : 'border-r-slate-100 border-b-slate-100')}`} style={{ width: horizontalColWidth, minWidth: horizontalColWidth }}>
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
                    <button onClick={() => { setViewingHabitMap(null); setIsEditingTabName(false); }} className={`flex flex-col items-center gap-0.5 p-3 transition-all ${getTextMuted()} hover:text-rose-500 shrink-0`} title="Close (ESC)"><XIcon /><span className="text-[6px] font-mono opacity-50">ESC</span></button>
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
                                // Matches the duration-700 ease style from v12.6
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border p-8 rounded-[2rem] max-w-sm w-full shadow-2xl text-center`}>
              <div className="bg-rose-500/20 text-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"><TrashIcon /></div>
              <h4 className="text-xl font-black mb-2">Delete Habit?</h4>
              <p className={`text-sm ${getTextMuted()} mb-8 font-medium`}>This will permanently delete data for <span className="text-rose-500 font-bold">"{viewingHabitMap || editingHabitName || tempHabitName}"</span>.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteConfirm(false)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>Cancel</button>
                <button onClick={() => deleteHabit(viewingHabitMap || editingHabitName || tempHabitName)} className="flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest bg-rose-500 text-white shadow-lg shadow-rose-500/20">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}

{/* --- EDIT HABITS MODAL --- */}
        {showOrderModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[350] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowOrderModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative flex flex-col max-h-[85vh]`} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowOrderModal(false)} className={`absolute top-6 right-6 p-2 ${getTextMuted()} hover:text-emerald-500 transition-all`}><XIcon /></button>
              
              <div className="mb-6 shrink-0">
                <p className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-[0.2em] mb-1`}>Manage List</p>
                <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Edit Habits</h3>
              </div>

              <div className="overflow-y-auto custom-scrollbar pr-2 space-y-2">
                {habits.map((habit, index) => (
                  <div key={habit} className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                      <span className={`text-xs font-black w-5 text-center shrink-0 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{index + 1}</span>
                      
                      {/* INLINE EDITING LOGIC - Removed onBlur entirely to fix focus loops */}
                      {editingHabitName === habit ? (
                        <input 
                          autoFocus 
                          className={`text-sm font-black uppercase w-full bg-transparent focus:outline-none border-b border-emerald-500 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`} 
                          value={tempHabitName} 
                          onChange={(e) => setTempHabitName(e.target.value)} 
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); 
                                handleDashboardRename(habit);
                            }
                          }} 
                        />
                      ) : (
                        <span className={`text-sm font-black uppercase truncate ${archivedHabits.includes(habit) ? 'opacity-40 line-through' : ''} ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          {habit}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0">
                      {/* EDIT / SAVE BUTTON - Back to reliable onClick */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault(); 
                          if (editingHabitName === habit) {
                            handleDashboardRename(habit);
                          } else {
                            setEditingHabitName(habit); 
                            setTempHabitName(habit);
                          }
                        }}
                        className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-slate-700 hover:text-blue-400 text-slate-400' : 'hover:bg-slate-200 hover:text-blue-600 text-slate-500'}`}
                        title={editingHabitName === habit ? "Save Habit Name" : "Edit Habit Name"}
                      >
                        {editingHabitName === habit ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                          <EditIcon />
                        )}
                      </button>

                      {/* DELETE BUTTON */}
                      <button 
                        onClick={() => { setTempHabitName(habit); setShowDeleteConfirm(true); }}
                        className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-slate-700 hover:text-rose-400 text-slate-400' : 'hover:bg-slate-200 hover:text-rose-600 text-slate-500'}`}
                        title="Delete Habit"
                      >
                        <TrashIcon />
                      </button>

                      <div className={`w-px h-4 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`} />

                      {/* UP BUTTON */}
                      <button 
                        onClick={() => {
                          if (index === 0) return;
                          const newHabits = [...habits];
                          [newHabits[index - 1], newHabits[index]] = [newHabits[index], newHabits[index - 1]];
                          setHabits(newHabits);
                          save(trackerData, newHabits, habitConfigs);
                        }}
                        disabled={index === 0}
                        className={`p-1.5 rounded-lg transition-all ${index === 0 ? 'opacity-30 cursor-not-allowed' : (theme === 'dark' ? 'hover:bg-slate-700 hover:text-emerald-400' : 'hover:bg-slate-200 hover:text-emerald-600')} ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}
                      >
                        <ChevronUpIcon />
                      </button>

                      {/* DOWN BUTTON */}
                      <button 
                        onClick={() => {
                          if (index === habits.length - 1) return;
                          const newHabits = [...habits];
                          [newHabits[index + 1], newHabits[index]] = [newHabits[index], newHabits[index + 1]];
                          setHabits(newHabits);
                          save(trackerData, newHabits, habitConfigs);
                        }}
                        disabled={index === habits.length - 1}
                        className={`p-1.5 rounded-lg transition-all ${index === habits.length - 1 ? 'opacity-30 cursor-not-allowed' : (theme === 'dark' ? 'hover:bg-slate-700 hover:text-emerald-400' : 'hover:bg-slate-200 hover:text-emerald-600')} ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}
                      >
                        <ChevronDownIcon />
                      </button>
                    </div>
                  </div>
                ))}
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

        {/* --- LEVEL DETAILS MODAL --- */}
        {showLevelDetailsModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setShowLevelDetailsModal(false)}>
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} 
              className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-[2rem] w-full max-w-sm p-8 shadow-2xl relative overflow-hidden`} 
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowLevelDetailsModal(false)} className={`absolute top-6 right-6 p-2 ${getTextMuted()} hover:text-rose-500 transition-all`}><XIcon /></button>
              
              <div className="mb-8 shrink-0">
                <p className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-[0.2em] mb-1`}>Mastery Engine</p>
                <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Level Details</h3>
              </div>

              <div className="flex flex-col items-center mb-8">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 border-4 shadow-xl ${getLevelBadgeStyle(xpStats.level)}`}>
                  <span className="text-4xl font-black">{xpStats.level}</span>
                </div>
                <p className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Total XP: <span className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}>{xpStats.totalXP}</span>
                </p>
              </div>

              <div className="space-y-3 p-5 rounded-2xl border bg-slate-50/5 dark:bg-slate-800/30 dark:border-slate-700/50 border-slate-200/50">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className={getTextMuted()}>Current Progress</span>
                  <span className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}>{xpStats.progressXP} / {xpStats.requiredXP} XP</span>
                </div>
                <div className={`h-4 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-300'}`}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${xpStats.progressPct}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-emerald-600 to-blue-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
                <p className={`text-[9px] text-center font-bold ${getTextMuted()} pt-1`}>
                  Earn {xpStats.requiredXP - xpStats.progressXP} more XP to reach Level {xpStats.level + 1}
                </p>
              </div>

              {/* Timeline Roadmap */}
              <div className="mt-8 flex flex-col gap-5 relative px-2">
                {/* The vertical line */}
                <div className="absolute left-[17px] top-2 bottom-2 w-[2px] bg-slate-200 dark:bg-slate-700/50" />
                
                {[Math.max(1, xpStats.level - 1), Math.max(1, xpStats.level - 1) + 1, Math.max(1, xpStats.level - 1) + 2, Math.max(1, xpStats.level - 1) + 3].map((l) => {
                  const isPast = l < xpStats.level;
                  const isCurrent = l === xpStats.level;
                  const targetXP = Math.pow(l - 1, 2) * 100;
                  
                  return (
                    <div key={l} className={`relative flex items-center gap-5 ${isPast ? 'opacity-50' : ''}`}>
                      <div className={`w-5 h-5 rounded-full border-2 z-10 shrink-0 ${
                        isPast ? 'bg-emerald-500 border-emerald-500' : 
                        isCurrent ? 'bg-white dark:bg-slate-900 border-emerald-500 ring-4 ring-emerald-500/20' : 
                        'bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600'
                      } flex items-center justify-center transition-all`}>
                        {isPast && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        {isCurrent && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                      </div>
                      
                      <div className="flex-1 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className={`text-[11px] font-black uppercase tracking-widest ${isCurrent ? (theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600') : (theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}`}>
                            Level {l}
                          </span>
                          {isCurrent && <span className={`text-[8px] font-bold ${getTextMuted()} uppercase tracking-widest mt-0.5`}>Current Rank</span>}
                        </div>
                        <span className={`text-[10px] font-black ${isCurrent ? (theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600') : (theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}`}>
                          {targetXP} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* --- TROPHY DETAILS MODAL --- */}
        {showTrophyDetailsModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setShowTrophyDetailsModal(false)}>
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} 
              className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-[2rem] w-full max-w-sm p-8 shadow-2xl relative overflow-hidden`} 
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowTrophyDetailsModal(false)} className={`absolute top-6 right-6 p-2 ${getTextMuted()} hover:text-rose-500 transition-all`}><XIcon /></button>
              
              <div className="mb-8 shrink-0">
                <p className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-[0.2em] mb-1`}>Monthly Activity</p>
                <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Win Milestones</h3>
              </div>

              <div className="flex flex-col items-center mb-8">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 border-4 shadow-xl bg-yellow-500/10 border-yellow-500/40 text-yellow-500`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                </div>
                <p className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Completed: <span className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}>{analytics.totalDone}</span>
                </p>
              </div>

              {(() => {
                const milestones = [5, 10, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000];
                let nextIdx = milestones.findIndex(m => analytics.totalDone < m);
                if (nextIdx === -1) nextIdx = milestones.length - 1;
                
                const nextTarget = milestones[nextIdx];
                const prevTarget = nextIdx > 0 ? milestones[nextIdx - 1] : 0;
                
                const progressXP = analytics.totalDone - prevTarget;
                const requiredXP = nextTarget - prevTarget;
                const progressPct = requiredXP > 0 ? Math.min(100, Math.max(0, Math.round((progressXP / requiredXP) * 100))) : 100;

                const displayNodes = [];
                if (nextIdx > 0) displayNodes.push({ label: `Milestone ${nextIdx}`, value: milestones[nextIdx - 1], state: 'past' });
                displayNodes.push({ label: `Milestone ${nextIdx + 1}`, value: milestones[nextIdx], state: 'current' });
                if (nextIdx + 1 < milestones.length) displayNodes.push({ label: `Milestone ${nextIdx + 2}`, value: milestones[nextIdx + 1], state: 'future' });
                if (nextIdx + 2 < milestones.length) displayNodes.push({ label: `Milestone ${nextIdx + 3}`, value: milestones[nextIdx + 2], state: 'future' });

                return (
                  <>
                    <div className="space-y-3 p-5 rounded-2xl border bg-slate-50/5 dark:bg-slate-800/30 dark:border-slate-700/50 border-slate-200/50">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className={getTextMuted()}>Current Target</span>
                        <span className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}>{analytics.totalDone} / {nextTarget}</span>
                      </div>
                      <div className={`h-4 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-300'}`}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                      </div>
                      <p className={`text-[9px] text-center font-bold ${getTextMuted()} pt-1`}>
                        Log {nextTarget - analytics.totalDone} more habits to hit Milestone {nextIdx + 1}
                      </p>
                    </div>

                    {/* Timeline Roadmap */}
                    <div className="mt-8 flex flex-col gap-5 relative px-2">
                      <div className="absolute left-[17px] top-2 bottom-2 w-[2px] bg-slate-200 dark:bg-slate-700/50" />
                      
                      {displayNodes.map((node, i) => (
                        <div key={i} className={`relative flex items-center gap-5 ${node.state === 'past' ? 'opacity-50' : ''}`}>
                          <div className={`w-5 h-5 rounded-full border-2 z-10 shrink-0 ${
                            node.state === 'past' ? 'bg-yellow-500 border-yellow-500' : 
                            node.state === 'current' ? 'bg-white dark:bg-slate-900 border-yellow-500 ring-4 ring-yellow-500/20' : 
                            'bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600'
                          } flex items-center justify-center transition-all`}>
                            {node.state === 'past' && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                            {node.state === 'current' && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />}
                          </div>
                          
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className={`text-[11px] font-black uppercase tracking-widest ${node.state === 'current' ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600') : (theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}`}>
                                {node.label}
                              </span>
                              {node.state === 'current' && <span className={`text-[8px] font-bold ${getTextMuted()} uppercase tracking-widest mt-0.5`}>Current Goal</span>}
                            </div>
                            <span className={`text-[10px] font-black ${node.state === 'current' ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600') : (theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}`}>
                              {node.value} WINS
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
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
        {/* Category Delete Confirmation Modal */}
        {categoryToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
            onClick={() => setCategoryToDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border p-8 rounded-[2rem] max-w-sm w-full shadow-2xl text-center`}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🗑️</span>
              </div>
              <h4 className={`text-xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Delete Category?</h4>
              <p className={`text-sm mb-8 font-medium leading-relaxed ${getTextMuted()}`}>
                All habits in <span className="text-rose-400 font-black">"{categoryToDelete}"</span> will be moved to <span className="font-black">All</span>. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCategoryToDelete(null)}
                  className={`flex-1 py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all border ${
                    theme === 'dark' ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteCategory}
                  className="flex-1 py-3 rounded-2xl text-sm font-black uppercase tracking-wider bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30"
                >
                  Delete
                </button>
              </div>
              <p className={`text-[8px] font-mono mt-4 opacity-30 ${getTextMuted()}`}>Press ESC to cancel</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

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