// FIX: Use Firebase compat library for app initialization to resolve module export errors.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// IMPORTANT: Firebase config is now loaded from environment variables.
// This is a critical security measure to avoid exposing keys in the source code.
// These variables must be set in your deployment environment.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "dummy-key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "dummy.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "dummy-project-id",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "dummy.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "dummy-sender-id",
  appId: process.env.FIREBASE_APP_ID || "dummy-app-id"
};

// Initialize Firebase using the standard v9 modular syntax.
// FIX: Use compat library for initialization to solve module export errors.
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export Auth providers
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');