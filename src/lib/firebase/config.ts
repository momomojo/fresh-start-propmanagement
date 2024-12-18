import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Ensure required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app;
let firestoreDb;
let firebaseAuth;
let firebaseStorage;

try {
// Initialize Firebase
  app = initializeApp(firebaseConfig);
  firestoreDb = getFirestore(app);
  firebaseAuth = getAuth(app);
  firebaseStorage = getStorage(app);

  // Enable offline persistence
  Promise.all([
    setPersistence(firebaseAuth, browserLocalPersistence),
    enableIndexedDbPersistence(firestoreDb)
  ]).catch((error) => {
    console.warn('Error enabling persistence:', error);
  });

} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export const db = firestoreDb;
export const auth = firebaseAuth;
export const storage = firebaseStorage;
export default app;
