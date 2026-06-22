import { create } from 'zustand';
import { get, set } from 'idb-keyval';

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

export const useHabitStore = create((setStore, getStore) => ({
  isHydrating: true,
  
  // Data State
  trackerData: {},
  habits: DEFAULT_HABITS,
  habitConfigs: DEFAULT_CONFIGS,
  categories: ["all", "health", "academic", "dev", "lifestyle"],
  archivedHabits: [],
  
  // App Settings
  theme: 'dark',
  tableOrientation: 'horizontal',
  textSizes: { habit: 14, table1: 12, table2: 11, tabSize: 110 },
  isMobileMode: false,
  savedLevel: 1,

  // UI State
  currentDate: new Date(),
  viewingHabitMap: null,
  heatmapFilter: 'all',
  weeklyGraphFilter: 'all',
  dashboardGraphFilter: 'all',
  selectedCategory: 'all',
  editingHabitName: null,
  editingManageListHabitName: null,

  // Actions
  init: async () => {
    try {
      // 1. Try to load from IndexedDB
      let data = await get('adib_habit_data');
      
      // 2. Fallback to localStorage if IDB is empty (migration)
      if (!data) {
        const localData = localStorage.getItem('habit_tracker_master_v9_data');
        if (localData) {
          data = {
            trackerData: JSON.parse(localData || '{}'),
            habits: JSON.parse(localStorage.getItem('habit_tracker_master_v9_names') || 'null') || DEFAULT_HABITS,
            habitConfigs: JSON.parse(localStorage.getItem('habit_tracker_master_v9_configs') || 'null') || DEFAULT_CONFIGS,
            categories: JSON.parse(localStorage.getItem('adib_habit_categories') || 'null') || ["all", "health", "academic", "dev", "lifestyle"],
            archivedHabits: JSON.parse(localStorage.getItem('adib_habit_archived') || 'null') || [],
            theme: localStorage.getItem('adib_habit_theme') || 'dark',
            tableOrientation: localStorage.getItem('adib_table_orientation') || 'horizontal',
            textSizes: JSON.parse(localStorage.getItem('adib_text_sizes') || 'null') || { habit: 14, table1: 12, table2: 11, tabSize: 110 },
            isMobileMode: JSON.parse(localStorage.getItem('adib_mobile_mode') || 'null') || (window.innerWidth <= 768),
            savedLevel: parseInt(localStorage.getItem('adib_habit_saved_level')) || 1
          };
          // Save to IDB for future
          await set('adib_habit_data', data);
        } else {
          // New user defaults
          data = {
            trackerData: {},
            habits: DEFAULT_HABITS,
            habitConfigs: DEFAULT_CONFIGS,
            categories: ["all", "health", "academic", "dev", "lifestyle"],
            archivedHabits: [],
            theme: 'dark',
            tableOrientation: 'horizontal',
            textSizes: { habit: 14, table1: 12, table2: 11, tabSize: 110 },
            isMobileMode: window.innerWidth <= 768,
            savedLevel: 1
          };
        }
      }

      if (data) {
        data.currentDate = data.currentDate ? new Date(data.currentDate) : new Date();
      }

      setStore({
        ...data,
        isHydrating: false
      });
      
      // Apply theme
      const root = window.document.documentElement;
      root.style.colorScheme = data.theme;
      if (data.theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } catch (e) {
      console.error("Failed to hydrate store:", e);
      setStore({ isHydrating: false });
    }
  },

  saveToIDB: async (updates) => {
    setStore(updates);
    const state = getStore();
    const dataToSave = {
      trackerData: state.trackerData,
      habits: state.habits,
      habitConfigs: state.habitConfigs,
      categories: state.categories,
      archivedHabits: state.archivedHabits,
      theme: state.theme,
      tableOrientation: state.tableOrientation,
      textSizes: state.textSizes,
      isMobileMode: state.isMobileMode,
      savedLevel: state.savedLevel
    };
    await set('adib_habit_data', dataToSave);
  },

  updateHabitValue: async (dateKey, habit, val) => {
    const state = getStore();
    const updatedDay = { ...(state.trackerData[dateKey] || {}), [habit]: val };
    const newTrackerData = { ...state.trackerData, [dateKey]: updatedDay };
    
    // Check for confetti
    let earned = 0;
    const activeHabits = state.habits.filter(h => !state.archivedHabits.includes(h));
    activeHabits.forEach(h => {
      const v = typeof updatedDay[h] === 'number' ? updatedDay[h] : (updatedDay[h] ? 100 : 0);
      earned += (v / 100);
    });
    
    if (activeHabits.length > 0 && Math.round((earned / activeHabits.length) * 100) === 100) {
      if (window.confetti) {
        window.confetti({ 
          particleCount: 150, 
          spread: 80, 
          origin: { y: 0.6 }, 
          colors: ['#10b981', '#3b82f6', '#10b981', '#ffffff'] 
        });
      }
    }

    await state.saveToIDB({ trackerData: newTrackerData });
  },

  setTheme: async (theme) => {
    await getStore().saveToIDB({ theme });
    const root = window.document.documentElement;
    root.style.colorScheme = theme;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  },

  setCurrentDate: (date) => setStore({ currentDate: date }),
  setViewingHabitMap: (habit) => setStore({ viewingHabitMap: habit }),
  setHeatmapFilter: (filter) => setStore({ heatmapFilter: filter }),
  setDashboardGraphFilter: (filter) => setStore({ dashboardGraphFilter: filter }),
  setWeeklyGraphFilter: (filter) => setStore({ weeklyGraphFilter: filter }),
  setSelectedCategory: (cat) => setStore({ selectedCategory: cat }),
  
  // Other setters
  setStorePartial: (partial) => setStore(partial),
  savePartialToIDB: async (partial) => await getStore().saveToIDB(partial)
}));
