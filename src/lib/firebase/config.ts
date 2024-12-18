import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
] as const;

function validateEnvVars() {
  const missing = requiredEnvVars.filter(
    (key) => !import.meta.env[key]
  );
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

validateEnvVars();

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: window.location.hostname, // Use the app's domain as authDomain
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  // Add OAuth config
  clientId: import.meta.env.VITE_FIREBASE_OAUTH_CLIENT_ID,
  clientSecret: import.meta.env.VITE_FIREBASE_OAUTH_CLIENT_SECRET
};

// Fallback to default auth domain in development
if (import.meta.env.DEV) {
  firebaseConfig.authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.error('Failed to connect to emulators:', error);
  }
}

export { auth, db, storage };

// Enable persistence for Firestore
import { enableIndexedDbPersistence } from 'firebase/firestore';

export async function enablePersistence() {
  if (typeof window !== 'undefined') {
    try {
      await enableIndexedDbPersistence(db);
    } catch (err: any) {
      if (err.code === 'failed-precondition') {
        console.warn('Persistence failed: multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('Persistence not available in this browser');
      }
    }
  }
}