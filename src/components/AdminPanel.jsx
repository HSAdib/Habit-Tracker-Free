import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Link } from 'react-router-dom';

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedData, setEditedData] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCol = collection(db, 'users');
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by lastUpdated or some other metric
      userList.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
      
      setUsers(userList);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    // Remove functions or weird objects before stringifying, but usually firestore data is pure JSON
    setEditedData(JSON.stringify(user, null, 2));
    setSaveStatus('');
  };

  const handleSave = async () => {
    try {
      setSaveStatus('Saving...');
      const parsedData = JSON.parse(editedData);
      
      // We shouldn't change the ID
      const userId = selectedUser.id;
      delete parsedData.id;

      await setDoc(doc(db, 'users', userId), parsedData);
      
      setSaveStatus('Saved successfully!');
      
      // Update local state to reflect changes
      setUsers(prev => prev.map(u => u.id === userId ? { id: userId, ...parsedData } : u));
      
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error("Error saving user data:", err);
      setSaveStatus('Error: Invalid JSON or save failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-500 font-black text-xl">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="bg-emerald-500 text-white p-2 rounded-xl">
                <UserIcon />
              </span>
              Admin Control Panel
            </h1>
            <p className="text-slate-500 font-medium mt-1">Manage all user data and habits globally.</p>
          </div>
          <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors">
            <BackIcon />
            Back to App
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 font-bold">
            Failed to load users: {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* User List Sidebar */}
          <div className="lg:col-span-1 bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
            <div className="p-4 border-b border-slate-700 bg-slate-800/50">
              <h2 className="font-black text-lg text-white">Registered Users ({users.length})</h2>
            </div>
            
            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {users.map(user => {
                const isSelected = selectedUser?.id === user.id;
                
                // Calculate total XP visually for the list
                let xp = 0;
                if (user.trackerData) {
                  Object.values(user.trackerData).forEach(day => {
                    Object.values(day).forEach(val => {
                      if (val > 0) xp += val;
                    });
                  });
                }
                
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`w-full text-left p-3 rounded-xl transition-colors flex flex-col gap-1 ${
                      isSelected 
                        ? 'bg-emerald-500/10 border border-emerald-500/30' 
                        : 'hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`font-black truncate ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {user.guestName || "User"}
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full">
                        {xp} XP
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 truncate block">
                      ID: {user.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Editor Panel */}
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                  <div>
                    <h2 className="font-black text-lg text-white">Editing: {selectedUser.guestName || "User"}</h2>
                    <p className="text-xs text-slate-500 font-medium">ID: {selectedUser.id}</p>
                  </div>
                  
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <SaveIcon />
                    Save Changes
                  </button>
                </div>
                
                {saveStatus && (
                  <div className={`px-4 py-2 text-sm font-bold border-b ${saveStatus.includes('Error') ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {saveStatus}
                  </div>
                )}
                
                <div className="flex-1 p-4 flex flex-col">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Raw JSON Data</label>
                  <textarea
                    value={editedData}
                    onChange={(e) => setEditedData(e.target.value)}
                    className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none leading-relaxed"
                    spellCheck="false"
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <UserIcon />
                </div>
                <h3 className="text-xl font-black text-slate-300 mb-2">No User Selected</h3>
                <p className="text-sm font-medium">Select a user from the list on the left to view and edit their data.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
