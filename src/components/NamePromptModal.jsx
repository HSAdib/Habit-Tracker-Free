import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabitStore } from '../store/useHabitStore';

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

export default function NamePromptModal() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const theme = useHabitStore(state => state.theme);
  const savePartialToIDB = useHabitStore(state => state.savePartialToIDB);
  const setStorePartial = useHabitStore(state => state.setStorePartial);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }
    if (trimmed.toLowerCase() === 'guest user' || trimmed.toLowerCase() === 'unknown guest') {
      setError('Please choose a different name.');
      return;
    }
    
    // Save locally to IndexedDB and update store
    savePartialToIDB({ guestName: trimmed });
    setStorePartial({ guestName: trimmed });
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className={`bg-slate-900 border ${theme === 'dark' ? 'border-emerald-500/30' : 'border-emerald-200'} shadow-2xl rounded-2xl w-full max-w-md p-8 relative overflow-hidden`}
        >
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-8 relative z-10">
            <h2 className="text-3xl font-black text-white mb-3">Welcome!</h2>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Before you start tracking your habits, please let us know what to call you.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="Enter your name"
                className={`w-full bg-slate-800/50 border ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-700 focus:ring-emerald-500/50 focus:border-emerald-500/50'} text-white px-5 py-4 rounded-xl font-bold placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all`}
                autoFocus
                maxLength={30}
              />
              {error && (
                <p className="text-red-400 text-xs font-bold mt-2 ml-1">{error}</p>
              )}
            </div>

            <button 
              type="submit"
              disabled={!name.trim()}
              className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-black text-white transition-all active:scale-95 shadow-lg ${!name.trim() ? 'bg-emerald-500/50 opacity-50 cursor-not-allowed shadow-none' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'}`}
            >
              Continue
              <ArrowRightIcon />
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
