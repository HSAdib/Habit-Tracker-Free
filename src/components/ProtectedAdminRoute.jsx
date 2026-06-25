import React from 'react';
import { Navigate } from 'react-router-dom';
import { useHabitStore } from '../store/useHabitStore';

export default function ProtectedAdminRoute({ children }) {
  const user = useHabitStore(state => state.user);
  const isAuthenticated = useHabitStore(state => state.isAuthenticated);
  const isHydrating = useHabitStore(state => state.isHydrating);

  // While checking auth state from IndexedDB/Firebase, show nothing or a spinner
  if (isHydrating) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-black text-xl">Loading...</div>;
  }

  // Check if authenticated and is the admin
  const isAdmin = isAuthenticated && user?.email === 'hasanshahriaradib@gmail.com';

  if (!isAdmin) {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  return children;
}
