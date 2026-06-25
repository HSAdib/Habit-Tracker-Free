import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabitStore } from '../store/useHabitStore';

const SyncIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
);

const ExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

const ImportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

const UserAvatarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default function HeaderProfile({ totalXP, bestStreak, handleLogin, handleLogout, handleExport }) {
  const [isOpen, setIsOpen] = useState(false);
  const [importPayload, setImportPayload] = useState(null);
  const dropdownRef = useRef(null);
  
  const user = useHabitStore(state => state.user);
  const isAuthenticated = useHabitStore(state => state.isAuthenticated);
  const theme = useHabitStore(state => state.theme);
  const syncToCloud = useHabitStore(state => state.syncToCloud);
  const importData = useHabitStore(state => state.importData);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.trackerData && Array.isArray(parsed.habits)) {
          setImportPayload(parsed);
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Invalid backup file.");
      }
      e.target.value = null;
    };
    reader.readAsText(file);
  };

  const handleSyncClick = async () => {
    if (!isAuthenticated) {
      handleLogin();
    } else {
      if (syncToCloud) {
        await syncToCloud();
      }
    }
    setIsOpen(false);
  };

  const displayName = user?.displayName || "Guest User";
  const email = user?.email || "Not signed in";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Avatar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-transform active:scale-95 ${theme === 'dark' ? 'bg-slate-800 border-2 border-slate-700' : 'bg-slate-200 border-2 border-slate-300'}`}
      >
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className={`font-black text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{initial}</span>
        )}
        
        {/* Status Dot */}
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${theme === 'dark' ? 'border-slate-900' : 'border-white'} ${isAuthenticated ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 top-16 w-72 z-50 border shadow-2xl rounded-2xl ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}
          >
            {/* User Info */}
            <div className="flex flex-col items-center mb-5">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-inner ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover shadow-md" />
                ) : (
                  <UserAvatarIcon />
                )}
              </div>
              <h3 className={`font-black text-lg leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{displayName}</h3>
              <p className={`text-xs font-semibold mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{email}</p>
            </div>

            {/* Stats Row */}
            <div className={`flex justify-between items-center py-3 mb-5 border-y ${theme === 'dark' ? 'border-slate-800/50' : 'border-slate-100'}`}>
              <div className="flex flex-col items-center flex-1">
                <span className={`text-xl font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{totalXP}</span>
                <span className={`text-[9px] uppercase tracking-widest font-black ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Total XP</span>
              </div>
              <div className={`w-px h-8 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
              <div className="flex flex-col items-center flex-1">
                <span className={`text-xl font-black ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`}>{bestStreak}</span>
                <span className={`text-[9px] uppercase tracking-widest font-black ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Best Streak</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleSyncClick}
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-black text-xs transition-transform active:scale-95 ${isAuthenticated ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'}`}
              >
                <SyncIcon />
                {isAuthenticated ? "Sync to Cloud" : "Sign in to Sync"}
              </button>
              
              <button 
                onClick={() => { handleExport(); setIsOpen(false); }}
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-black text-xs border transition-colors active:scale-95 ${theme === 'dark' ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <ExportIcon />
                Save to Device
              </button>

              <label 
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-black text-xs border transition-colors cursor-pointer active:scale-95 ${theme === 'dark' ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <ImportIcon />
                Load from Device
                <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
              </label>

              {isAuthenticated && (
                <button 
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-black text-xs border transition-colors active:scale-95 mt-2 ${theme === 'dark' ? 'border-red-900/30 text-red-400 hover:bg-red-900/20' : 'border-red-100 text-red-600 hover:bg-red-50'}`}
                >
                  <LogoutIcon />
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restore Backup Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
        {importPayload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 z-[101] border border-slate-700/50 shadow-2xl rounded-2xl w-full max-w-md p-6 relative"
            >
              <h2 className={`text-xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Restore Backup</h2>
              <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>How would you like to load this data?</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { importData(importPayload, 'merge'); setImportPayload(null); setIsOpen(false); }}
                  className="w-full py-3 px-4 rounded-xl text-left bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
                >
                  <div className="font-black text-emerald-500 text-sm">Merge Safely</div>
                  <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Fills in missing days. Current progress is kept intact.</div>
                </button>

                <button 
                  onClick={() => { importData(importPayload, 'overwrite'); setImportPayload(null); setIsOpen(false); }}
                  className="w-full py-3 px-4 rounded-xl text-left bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                >
                  <div className="font-black text-red-500 text-sm">Overwrite All</div>
                  <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Completely replaces your current data with the backup.</div>
                </button>

                <button 
                  onClick={() => { setImportPayload(null); setIsOpen(false); }}
                  className={`w-full py-3 px-4 rounded-xl font-black text-sm border transition-colors ${theme === 'dark' ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
