import { create } from 'zustand';
import { get, set } from 'idb-keyval';
import { auth, db } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
  user: null,
  isAuthenticated: false,
  authInitialized: false,
  lastUpdated: 0,
  
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
  guestName: "",
  manualXPOffset: 0,
  manualStreakOffset: 0,

  // UI State
  isImpersonating: null,
  impersonatedUserName: "",
  adminSavedState: null,
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
            savedLevel: parseInt(localStorage.getItem('adib_habit_saved_level')) || 1,
            lastUpdated: Date.now()
          };
          // Save to IDB for future
          await set('adib_habit_data', data);
        } else {
          // New user defaults
          let dynamicHabits = DEFAULT_HABITS;
          let dynamicConfigs = DEFAULT_CONFIGS;
          let dynamicCategories = ["all", "health", "academic", "dev", "lifestyle"];
          
          try {
            const globalRef = doc(db, 'settings', 'globalDefaults');
            const globalSnap = await getDoc(globalRef);
            if (globalSnap.exists()) {
              const globalData = globalSnap.data();
              if (globalData.habits) dynamicHabits = globalData.habits;
              if (globalData.habitConfigs) dynamicConfigs = globalData.habitConfigs;
              if (globalData.categories) dynamicCategories = globalData.categories;
            }
          } catch (e) {
            console.warn("Failed to fetch global defaults, using hardcoded.", e);
          }

          data = {
            trackerData: {},
            habits: dynamicHabits,
            habitConfigs: dynamicConfigs,
            categories: dynamicCategories,
            archivedHabits: [],
            theme: 'dark',
            tableOrientation: 'horizontal',
            textSizes: { habit: 14, table1: 12, table2: 11, tabSize: 110 },
            isMobileMode: window.innerWidth <= 768,
            savedLevel: 1,
            guestName: "",
            manualXPOffset: 0,
            manualStreakOffset: 0,
            lastUpdated: Date.now()
          };
        }
      }

      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent) || window.innerWidth <= 768;

      if (data) {
        data.currentDate = data.currentDate ? new Date(data.currentDate) : new Date();
        // Clear default 'Guest User' to enforce new name picking
        if (data.guestName === "Guest User") {
          data.guestName = "";
        }
      }

      setStore({
        ...data,
        isMobileMode: isMobileDevice,
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

      // Firebase Sync
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setStore({ user, isAuthenticated: true, authInitialized: true });
          try {
            const userDocRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDocRef);
            const localLastUpdated = getStore().lastUpdated || 0;
            
            if (docSnap.exists()) {
              const remoteData = docSnap.data();
              const remoteLastUpdated = remoteData.lastUpdated || 0;
              
              if (remoteLastUpdated > localLastUpdated) {
                // Remote is newer, update local store and IDB
                const mergedData = { ...getStore(), ...remoteData };
                if (mergedData.currentDate) {
                  mergedData.currentDate = new Date(mergedData.currentDate);
                }
                setStore(mergedData);
                await set('adib_habit_data', mergedData);
              } else if (localLastUpdated > remoteLastUpdated) {
                // Local is newer, push to remote
                await setDoc(userDocRef, { ...getStore(), isHydrating: undefined, user: undefined, isAuthenticated: undefined, lastUpdated: localLastUpdated }, { merge: true });
              }
            } else {
              // No remote data, push local data
              await setDoc(userDocRef, { ...getStore(), isHydrating: undefined, user: undefined, isAuthenticated: undefined, lastUpdated: localLastUpdated }, { merge: true });
            }
          } catch (syncErr) {
            console.error("Firebase sync failed, degrading to local only:", syncErr);
          }
        } else {
          setStore({ user: null, isAuthenticated: false, authInitialized: true });
        }
      });
      
    } catch (e) {
      console.error("Failed to hydrate store:", e);
      setStore({ isHydrating: false });
    }
  },


  syncToCloud: async () => {
    const state = getStore();
    const { user, isAuthenticated, trackerData, habits, habitConfigs, categories, archivedHabits, theme, tableOrientation, textSizes, isMobileMode, savedLevel, lastUpdated, guestName, manualXPOffset, manualStreakOffset, isImpersonating, impersonatedUserName } = state;
    if (!isAuthenticated || !user) return;

    try {
      const targetUid = isImpersonating || user.uid;
      const targetDisplayName = isImpersonating ? impersonatedUserName : (user.displayName || "");
      const userDocRef = doc(db, 'users', targetUid);
      await setDoc(userDocRef, {
        trackerData, habits, habitConfigs, categories, archivedHabits, theme, tableOrientation, textSizes, isMobileMode, savedLevel, lastUpdated, guestName, manualXPOffset, manualStreakOffset, displayName: targetDisplayName
      }, { merge: true });
    } catch (err) {
      console.warn("Background cloud sync deferred:", err);
    }
  },

  importData: async (incomingPayload, strategy) => {
    const state = getStore();
    const timestamp = Date.now();
    let newTrackerData = { ...state.trackerData };
    let newHabits = [...state.habits];
    let newHabitConfigs = { ...state.habitConfigs };

    if (strategy === 'overwrite') {
      newTrackerData = incomingPayload.trackerData || {};
      newHabits = incomingPayload.habits || [];
      newHabitConfigs = incomingPayload.habitConfigs || {};
    } else if (strategy === 'merge') {
      const incomingHabits = incomingPayload.habits || [];
      incomingHabits.forEach(h => {
        if (!newHabits.includes(h)) newHabits.push(h);
      });

      const incomingConfigs = incomingPayload.habitConfigs || {};
      newHabitConfigs = { ...incomingConfigs, ...newHabitConfigs };

      const incomingTracker = incomingPayload.trackerData || {};
      Object.keys(incomingTracker).forEach(dateKey => {
        if (!newTrackerData[dateKey]) {
          newTrackerData[dateKey] = incomingTracker[dateKey];
        } else {
          newTrackerData[dateKey] = { ...incomingTracker[dateKey], ...newTrackerData[dateKey] };
        }
      });
    }

    const updatedPayload = {
      trackerData: newTrackerData,
      habits: newHabits,
      habitConfigs: newHabitConfigs,
      lastUpdated: timestamp,
    };

    await state.saveToIDB(updatedPayload);
  },

  saveToIDB: async (updates) => {
    setStore(updates);
    const state = getStore();
    const now = Date.now();
    setStore({ lastUpdated: now });
    
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
      savedLevel: state.savedLevel,
      guestName: state.guestName,
      manualXPOffset: state.manualXPOffset,
      manualStreakOffset: state.manualStreakOffset,
      lastUpdated: now
    };

    if (state.isImpersonating) {
      if (state.isAuthenticated && state.user) {
        try {
          await setDoc(doc(db, 'users', state.isImpersonating), { ...dataToSave, displayName: state.impersonatedUserName }, { merge: true });
        } catch (err) {
          console.error("Impersonated background sync failed:", err);
        }
      }
      return;
    }

    await set('adib_habit_data', dataToSave);
    
    // Background Firebase Sync
    if (state.isAuthenticated && state.user) {
      try {
        await setDoc(doc(db, 'users', state.user.uid), { ...dataToSave, displayName: state.user.displayName || "" }, { merge: true });
      } catch (err) {
        console.error("Background sync failed:", err);
      }
    }
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
    if (state.isAuthenticated) state.syncToCloud();
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
  
  startImpersonation: (targetUser) => {
    const state = getStore();
    const adminStateBackup = {
      trackerData: state.trackerData,
      habits: state.habits,
      habitConfigs: state.habitConfigs,
      categories: state.categories,
      archivedHabits: state.archivedHabits,
      theme: state.theme,
      tableOrientation: state.tableOrientation,
      textSizes: state.textSizes,
      isMobileMode: state.isMobileMode,
      savedLevel: state.savedLevel,
      guestName: state.guestName,
      manualXPOffset: state.manualXPOffset,
      manualStreakOffset: state.manualStreakOffset,
    };
    
    setStore({
      isImpersonating: targetUser.id,
      impersonatedUserName: targetUser.displayName || targetUser.guestName || "Unknown User",
      adminSavedState: adminStateBackup,
      trackerData: targetUser.trackerData || {},
      habits: targetUser.habits || [],
      habitConfigs: targetUser.habitConfigs || {},
      categories: targetUser.categories || ["all", "health", "academic", "dev", "lifestyle"],
      archivedHabits: targetUser.archivedHabits || [],
      theme: targetUser.theme || 'dark',
      tableOrientation: targetUser.tableOrientation || 'horizontal',
      textSizes: targetUser.textSizes || { habit: 14, table1: 12, table2: 11, tabSize: 110 },
      savedLevel: targetUser.savedLevel || 1,
      guestName: targetUser.guestName || "",
      manualXPOffset: targetUser.manualXPOffset || 0,
      manualStreakOffset: targetUser.manualStreakOffset || 0,
    });
  },

  stopImpersonation: () => {
    const state = getStore();
    if (state.adminSavedState) {
      setStore({
        ...state.adminSavedState,
        isImpersonating: null,
        impersonatedUserName: "",
        adminSavedState: null
      });
    } else {
      setStore({
        isImpersonating: null,
        impersonatedUserName: "",
      });
    }
  },

  // Other setters
  setStorePartial: (partial) => setStore(partial),
  savePartialToIDB: async (partial) => await getStore().saveToIDB(partial)
}));

// Initialize the store and auth listener immediately so it acts globally across all routes
useHabitStore.getState().init();
