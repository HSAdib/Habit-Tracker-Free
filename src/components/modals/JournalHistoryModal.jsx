import React from 'react';
import { motion } from 'framer-motion';
import { parseLocalDate } from '../../utils';
import { useHabitStore } from '../../store/useHabitStore';

const XIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;

const NoteIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;


export default function JournalHistoryModal({ setShowAllNotes, setEditingNoteDate }) {
  const theme = useHabitStore((state) => state.theme);
  const trackerData = useHabitStore((state) => state.trackerData);
  const getTextMuted = () => theme === 'dark' ? 'text-slate-500' : 'text-slate-400';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[180] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowAllNotes(false)}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl relative flex flex-col max-h-[85vh]`} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShowAllNotes(false)} className={`absolute top-6 right-6 p-2 ${getTextMuted()} hover:text-rose-500 transition-all`} title="Close"><XIcon /></button>
        
        <div className="mb-6 shrink-0">
          <p className={`text-[10px] font-black ${getTextMuted()} uppercase tracking-[0.2em] mb-1`}>Reflection Log</p>
          <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Journal History</h3>
        </div>

        <div className="overflow-y-auto custom-scrollbar pr-2 space-y-4">
          {Object.keys(trackerData).filter((k) => trackerData[k]?.note).length > 0 ?
          Object.entries(trackerData).
          filter(([k, v]) => v.note && v.note.trim()).
          sort((a, b) => new Date(b[0]) - new Date(a[0])) // Sort by newest first
          .map(([dateKey, data]) =>
          <div key={dateKey} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[9px] font-black uppercase tracking-wider ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20`}>
                      {parseLocalDate(dateKey).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <button onClick={() => {setEditingNoteDate(dateKey);setShowAllNotes(false);}} className={`text-[9px] font-black uppercase hover:text-emerald-500 transition-colors ${getTextMuted()}`} title="Edit">Edit</button>
                  </div>
                  <p className={`text-sm font-medium whitespace-pre-wrap leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {data.note}
                  </p>
                </div>
          ) :

          <div className="text-center py-20 opacity-30 flex flex-col items-center">
              <NoteIcon />
              <p className="font-black uppercase text-xs mt-4">No entries yet</p>
            </div>
          }
        </div>
      </motion.div>
    </motion.div>);

}