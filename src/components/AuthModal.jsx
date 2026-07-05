import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase.config';
import { useHabitStore } from '../store/useHabitStore';

const XIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;


const EyeIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;


const EyeOffIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>;


const GoogleIcon = () =>
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>;


export default function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useHabitStore((state) => state.theme);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError(null);
      setIsSignUp(false);
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') setError('Email already in use.');else
      if (err.code === 'auth/wrong-password') setError('Wrong password.');else
      if (err.code === 'auth/user-not-found') setError('User not found.');else
      if (err.code === 'auth/invalid-credential') setError('Invalid credentials.');else
      if (err.code === 'auth/weak-password') setError('Password should be at least 6 characters.');else
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Google Sign-In failed.');
    }
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}>
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-sm rounded-2xl p-6 shadow-2xl border ${
          theme === 'dark' ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-200'}`
          }>
          
          <button
            onClick={onClose}
            title="Close"
            className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
            theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`
            }>
            
            <XIcon />
          </button>

          <div className={`flex p-1 rounded-xl mb-6 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
            <button
              onClick={() => {setIsSignUp(false);setError(null);}}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              !isSignUp ?
              theme === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm' :
              theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`
              } title="Log In">
              
              Log In
            </button>
            <button
              onClick={() => {setIsSignUp(true);setError(null);}}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              isSignUp ?
              theme === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm' :
              theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`
              } title="Sign Up">
              
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                theme === 'dark' ?
                'bg-slate-800 border-slate-700 text-white placeholder-slate-500' :
                'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`
                }
                placeholder="you@example.com" />
              
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-4 pr-12 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  theme === 'dark' ?
                  'bg-slate-800 border-slate-700 text-white placeholder-slate-500' :
                  'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`
                  }
                  placeholder="••••••••" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${
                  theme === 'dark' ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'}`
                  }>
                  
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {isSignUp &&
            <div>
                <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-4 pr-12 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  theme === 'dark' ?
                  'bg-slate-800 border-slate-700 text-white placeholder-slate-500' :
                  'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`
                  }
                  placeholder="••••••••" />
                
                  <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${
                  theme === 'dark' ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'}`
                  }>
                  
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            }

            {error &&
            <div className="text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                {error}
              </div>
            }

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-2 rounded-xl font-black text-sm text-white transition-transform active:scale-95 shadow-lg ${
              loading ? 'bg-emerald-500/50 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'}`
              } title="Action">
              
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className={`px-2 font-medium tracking-wide ${theme === 'dark' ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-500'}`}>
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              title="Sign in with Google"
              className={`mt-4 w-full flex items-center justify-center gap-3 py-3 rounded-xl font-bold text-sm border transition-colors active:scale-95 ${
              theme === 'dark' ?
              'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' :
              'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`
              }>
              
              <GoogleIcon />
              Google
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}