import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useHabitStore } from '../store/useHabitStore';

const BackIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;


const UserIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;


const EditIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>;


const CheckIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;


const XIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;


const EyeIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;


const DownloadIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;


const CodeIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;


const SettingsIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>;


const TrashIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>;


const PlusIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;


export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const startImpersonation = useHabitStore((state) => state.startImpersonation);

  // For Inline Name Editing
  const [editingUserId, setEditingUserId] = useState(null);
  const [tempName, setTempName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // For JSON Editor Modal
  const [editingJsonUser, setEditingJsonUser] = useState(null);
  const [jsonText, setJsonText] = useState("");

  // For Global Settings
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [globalHabits, setGlobalHabits] = useState([]);
  const [globalConfigs, setGlobalConfigs] = useState({});
  const [globalCategories, setGlobalCategories] = useState([]);
  const [newHabitInput, setNewHabitInput] = useState("");
  const [editingGlobalHabitIdx, setEditingGlobalHabitIdx] = useState(null);
  const [editingGlobalHabitName, setEditingGlobalHabitName] = useState("");
  const [editingGlobalHabitSteps, setEditingGlobalHabitSteps] = useState(1);
  const [editingGlobalHabitPriority, setEditingGlobalHabitPriority] = useState(1);

  useEffect(() => {
    const usersCol = collection(db, 'users');
    const unsubscribe = onSnapshot(usersCol, (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by lastUpdated or some other metric
      userList.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));

      setUsers(userList);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching users:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getDisplayName = (u) => {
    let name = u.displayName || u.guestName;
    if (name === "Guest User") name = "";
    return name || "Unknown Guest";
  };

  const handleUpdateName = async (userId) => {
    if (!tempName.trim()) return;
    setIsUpdatingName(true);
    try {
      await updateDoc(doc(db, "users", userId), {
        displayName: tempName.trim(),
        guestName: tempName.trim()
      });
      setEditingUserId(null);
    } catch (err) {
      console.error("Error updating name:", err);
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleOpenJsonEditor = (user) => {
    setEditingJsonUser(user);
    setJsonText(JSON.stringify(user, null, 2));
  };

  const handleSaveJson = async () => {
    try {
      const parsedData = JSON.parse(jsonText);
      await updateDoc(doc(db, "users", editingJsonUser.id), parsedData);
      setEditingJsonUser(null);
    } catch (err) {
      alert("Invalid JSON syntax. Please correct it and try again.\n\nError: " + err.message);
    }
  };

  const handleOpenGlobalSettings = async () => {
    setShowGlobalSettings(true);
    setGlobalHabits([]);
    setGlobalConfigs({});
    try {
      const docRef = doc(db, 'settings', 'globalDefaults');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setGlobalHabits(data.habits || []);
        setGlobalConfigs(data.habitConfigs || {});
        setGlobalCategories(data.categories || ["all", "health", "academic", "dev", "lifestyle"]);
      } else {
        setGlobalHabits(["sleep 7h", "calisthenics", "meditation", "dept study", "coding", "vocab", "audiobook"]);
        setGlobalConfigs({
          "sleep 7h": { steps: 1 },
          "calisthenics": { steps: 1 },
          "meditation": { steps: 1 },
          "dept study": { steps: 1 },
          "coding": { steps: 1 },
          "vocab": { steps: 15 },
          "audiobook": { steps: 1 }
        });
        setGlobalCategories(["all", "health", "academic", "dev", "lifestyle"]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveGlobalSettings = async () => {
    try {
      const payload = {
        habits: globalHabits,
        habitConfigs: globalConfigs,
        categories: globalCategories
      };
      await setDoc(doc(db, "settings", "globalDefaults"), payload);
      alert("Global defaults saved successfully!");
      setShowGlobalSettings(false);
    } catch (err) {
      alert("Failed to save global defaults. Error: " + err.message);
    }
  };

  const handleAddGlobalHabit = (e) => {
    e.preventDefault();
    const habitName = newHabitInput.trim();
    if (!habitName || globalHabits.includes(habitName)) return;

    setGlobalHabits([...globalHabits, habitName]);
    setGlobalConfigs({ ...globalConfigs, [habitName]: { steps: 1 } });
    setNewHabitInput("");
  };

  const handleRemoveGlobalHabit = (habitName) => {
    setGlobalHabits(globalHabits.filter((h) => h !== habitName));
    const newConfigs = { ...globalConfigs };
    delete newConfigs[habitName];
    setGlobalConfigs(newConfigs);
  };

  const handleEditGlobalHabitSave = (oldName, idx) => {
    const newName = editingGlobalHabitName.trim();
    if (!newName) {
      setEditingGlobalHabitIdx(null);
      return;
    }
    if (newName !== oldName && globalHabits.includes(newName)) {
      alert("A habit with this name already exists in the global defaults.");
      return;
    }

    const newHabits = [...globalHabits];
    newHabits[idx] = newName;
    setGlobalHabits(newHabits);

    const newConfigs = { ...globalConfigs };
    const oldConfig = newConfigs[oldName] || {};

    if (newName !== oldName) {
      delete newConfigs[oldName];
    }

    newConfigs[newName] = {
      ...oldConfig,
      steps: parseInt(editingGlobalHabitSteps, 10) || 1,
      priority: parseInt(editingGlobalHabitPriority, 10) || 1
    };

    setGlobalConfigs(newConfigs);
    setEditingGlobalHabitIdx(null);
  };

  const handleDownloadFromModal = () => {
    if (!editingJsonUser) return;
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    let currentName = editingJsonUser.displayName || editingJsonUser.guestName || "user";
    if (currentName === "Guest User") currentName = "user";
    a.download = `${currentName}_habit_data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-500 font-black text-xl">
        Loading Admin Dashboard...
      </div>);

  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="bg-emerald-500 text-white p-2 rounded-xl">
                <UserIcon />
              </span>
              Admin Control Panel
            </h1>
            <p className="text-slate-500 font-medium mt-1">Manage all user data and habits globally.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenGlobalSettings}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 font-bold rounded-xl transition-colors" title="Edit Global Defaults">
              
              <SettingsIcon />
              Edit Global Defaults
            </button>
            <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors">
              <BackIcon />
              Back to App
            </Link>
          </div>
        </div>

        {error &&
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 font-bold">
            Failed to load users: {error}
          </div>
        }

        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
            <h2 className="font-black text-lg text-white">Registered Users ({users.length})</h2>
          </div>
          
          <div className="p-4 space-y-3">
            {users.map((user) => {
              const isEditing = editingUserId === user.id;

              // Calculate total XP visually
              let xp = 0;
              if (user.trackerData) {
                Object.values(user.trackerData).forEach((day) => {
                  Object.values(day).forEach((val) => {
                    if (val > 0) xp += val;
                  });
                });
              }

              return (
                <div
                  key={user.id}
                  className="w-full text-left p-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-slate-600 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                  
                  <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <div className="flex items-center gap-3">
                      {isEditing ?
                      <div className="flex items-center gap-1 bg-slate-900 rounded-lg border border-emerald-500/30 overflow-hidden pr-1">
                          <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="bg-transparent text-white font-black text-sm px-3 py-1.5 focus:outline-none w-full sm:w-48"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateName(user.id);
                            if (e.key === 'Escape') setEditingUserId(null);
                          }} />
                        
                          <button
                          onClick={() => handleUpdateName(user.id)}
                          disabled={isUpdatingName}
                          className={`p-1.5 rounded-md text-emerald-400 hover:bg-emerald-500/20 ${isUpdatingName ? 'opacity-50' : ''}`}
                          title="Save">
                          
                            <CheckIcon />
                          </button>
                          <button
                          onClick={() => setEditingUserId(null)}
                          disabled={isUpdatingName}
                          className={`p-1.5 rounded-md text-slate-400 hover:bg-slate-800 ${isUpdatingName ? 'opacity-50' : ''}`}
                          title="Cancel">
                          
                            <XIcon />
                          </button>
                        </div> :

                      <span className="font-black text-lg text-slate-200">
                          {getDisplayName(user)}
                        </span>
                      }
                      
                      {!isEditing &&
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {xp} XP
                        </span>
                      }
                    </div>
                    <span className="text-xs font-medium text-slate-500 truncate block font-mono">
                      {user.id}
                    </span>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                    <button
                      onClick={() => {
                        const currentName = user.displayName || user.guestName || "";
                        setTempName(currentName === "Guest User" ? "" : currentName);
                        setEditingUserId(user.id);
                      }}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-bold text-sm flex-1 sm:flex-none border border-transparent hover:border-slate-600"
                      title="Edit Name">
                      
                      <EditIcon />
                      <span className="hidden md:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        startImpersonation(user);
                        navigate('/');
                      }}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors font-bold text-sm flex-1 sm:flex-none border border-transparent hover:border-blue-500/30"
                      title="Impersonate User">
                      
                      <EyeIcon />
                      <span className="hidden md:inline">View</span>
                    </button>
                    <button
                      onClick={() => handleOpenJsonEditor(user)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded-lg transition-colors font-bold text-sm flex-1 sm:flex-none border border-transparent hover:border-purple-500/30"
                      title="Edit JSON">
                      
                      <CodeIcon />
                      <span className="hidden md:inline">Edit JSON</span>
                    </button>
                  </div>
                </div>);

            })}
            {users.length === 0 && !loading &&
            <div className="text-center p-8 text-slate-500 font-bold">
                No users found.
              </div>
            }
          </div>
        </div>
      </div>

      {/* JSON Editor Modal */}
      {typeof document !== 'undefined' && editingJsonUser && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setEditingJsonUser(null)}>
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div>
                <h3 className="font-black text-xl text-white flex items-center gap-2">
                  <CodeIcon /> Advanced JSON Editor
                </h3>
                <p className="text-sm text-slate-400 font-medium mt-1">Editing: {getDisplayName(editingJsonUser)} (ID: <span className="font-mono text-xs">{editingJsonUser.id}</span>)</p>
              </div>
              <button
                onClick={() => setEditingJsonUser(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors" title="Toggle">
                
                <XIcon />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden p-0 bg-slate-950 flex">
              <textarea
                className="w-full h-full p-4 bg-transparent text-emerald-400 font-mono text-xs md:text-sm leading-relaxed focus:outline-none resize-none"
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                spellCheck={false} />
              
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex flex-wrap justify-end gap-3">
              <button
                onClick={handleDownloadFromModal}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl font-bold transition-colors" title="Download JSON">
                
                <DownloadIcon />
                Download JSON
              </button>
              <button
                onClick={handleSaveJson}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold transition-colors" title="Save Changes">
                
                <CheckIcon />
                Save Changes
              </button>
              <button
                onClick={() => setEditingJsonUser(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors" title="Cancel">
                
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Global Settings Modal */}
      {typeof document !== 'undefined' && showGlobalSettings && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowGlobalSettings(false)}>
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h3 className="font-black text-xl text-white flex items-center gap-2">
                  <SettingsIcon /> Global Default Habits
                </h3>
                <p className="text-sm text-slate-400 font-medium mt-1">Configure the default habit list for brand new users.</p>
              </div>
              <button
                onClick={() => setShowGlobalSettings(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors" title="Close">
                
                <XIcon />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
              <div className="mb-6">
                <form onSubmit={handleAddGlobalHabit} className="flex gap-3">
                  <input
                    type="text"
                    value={newHabitInput}
                    onChange={(e) => setNewHabitInput(e.target.value)}
                    placeholder="Enter a new habit name..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
                  
                  <button
                    type="submit"
                    disabled={!newHabitInput.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors" title="Add">
                    
                    <PlusIcon /> Add
                  </button>
                </form>
              </div>

              <div className="space-y-2">
                {globalHabits.length === 0 ?
                <div className="text-center p-8 text-slate-500 font-medium border border-dashed border-slate-700 rounded-xl">
                    No default habits configured.
                  </div> :

                globalHabits.map((habitName, idx) =>
                <div key={idx} className="flex flex-col p-4 bg-slate-800 border border-slate-700 rounded-xl hover:border-slate-600 transition-colors">
                      {editingGlobalHabitIdx === idx ?
                  <div className="flex flex-col gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">Habit Name</label>
                            <input
                        type="text"
                        value={editingGlobalHabitName}
                        onChange={(e) => setEditingGlobalHabitName(e.target.value)}
                        className="w-full bg-slate-900 border border-emerald-500/50 rounded-lg px-3 py-2 text-white focus:outline-none"
                        autoFocus />
                      
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">Goal Steps</label>
                            <input
                        type="number"
                        min="1"
                        value={editingGlobalHabitSteps}
                        onChange={(e) => setEditingGlobalHabitSteps(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500/50" />
                      
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-slate-400">Priority Level</label>
                              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                {editingGlobalHabitPriority}
                              </span>
                            </div>
                            <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={editingGlobalHabitPriority}
                        onChange={(e) => setEditingGlobalHabitPriority(e.target.value)}
                        className="w-full accent-emerald-500 cursor-pointer" />
                      
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-bold">
                              <span>1 (Low)</span>
                              <span>5 (High)</span>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                        onClick={() => setEditingGlobalHabitIdx(null)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors text-sm" title="Cancel">
                        
                              Cancel
                            </button>
                            <button
                        onClick={() => handleEditGlobalHabitSave(habitName, idx)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-colors text-sm" title="Save">
                        
                              Save
                            </button>
                          </div>
                        </div> :

                  <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">
                            {habitName} 
                            <span className="text-xs font-normal text-slate-500 ml-2">
                              ({globalConfigs[habitName]?.steps || 1} steps, P{globalConfigs[habitName]?.priority || 1})
                            </span>
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                        onClick={() => {
                          setEditingGlobalHabitIdx(idx);
                          setEditingGlobalHabitName(habitName);
                          setEditingGlobalHabitSteps(globalConfigs[habitName]?.steps || 1);
                          setEditingGlobalHabitPriority(globalConfigs[habitName]?.priority || 1);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit Habit">
                        
                              <EditIcon />
                            </button>
                            <button
                        onClick={() => handleRemoveGlobalHabit(habitName)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove Habit">
                        
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                  }
                    </div>
                )
                }
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
              <button
                onClick={handleSaveGlobalSettings}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold transition-colors" title="Save Global Defaults">
                
                <CheckIcon />
                Save Global Defaults
              </button>
              <button
                onClick={() => setShowGlobalSettings(false)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors" title="Cancel">
                
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>);

}