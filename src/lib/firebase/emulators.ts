import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { auth, db } from './config';

const EMULATOR_HOST = import.meta.env.VITE_FIREBASE_EMULATOR_HOST || 'localhost';

export function connectEmulators() {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
    try {
      connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`);
      connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
      console.log('Connected to Firebase emulators');
    } catch (error) {
      console.error('Failed to connect to emulators:', error);
    }
  }
}