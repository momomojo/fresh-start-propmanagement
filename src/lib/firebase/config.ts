import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); 

// Initialize Firebase features with better error handling
const initializeFirebase = async () => {
  try {
    // Enable offline persistence
    await Promise.all([
      setPersistence(auth, browserLocalPersistence),
      enableIndexedDbPersistence(db)
    ]).catch((error) => {
      if (error.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence enabled in first tab only');
      } else if (error.code === 'unimplemented') {
        console.warn('Browser does not support persistence');
      }
    });

    // Connect to emulators in development
    if (import.meta.env.DEV) {
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        connectStorageEmulator(storage, 'localhost', 9199);
      } catch (error) {
        console.warn('Failed to connect to emulators:', error);
      }
    }

    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
};

// Initialize Firebase
initializeFirebase();

export { db, auth, storage };
export default app;