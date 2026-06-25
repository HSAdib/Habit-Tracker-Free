import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Credentials are loaded from .env (VITE_ prefix is required by Vite)
// Copy .env.example → .env and paste your Firebase project values there.
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Warn in dev if any key is missing (helps catch misconfigured .env early)
if (import.meta.env.DEV) {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v || v.startsWith('YOUR_'))
    .map(([k]) => k);
  if (missing.length > 0) {
    console.warn(
      `[Firebase] Missing env vars: ${missing.join(', ')}.\n` +
      'Copy .env.example → .env and fill in your Firebase project credentials.'
    );
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db   = getFirestore(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();

// Always show Google's account picker (useful if the user has multiple accounts)
googleProvider.setCustomParameters({ prompt: 'select_account' });
