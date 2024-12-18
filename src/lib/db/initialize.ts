import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { store } from '../store';
import { setUser, setStatus, setError, logout } from '../store/slices/authSlice';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS } from '../firebase/collections';
import type { User } from '../../types';
import { ActionStatus } from '../store/types';

export async function initializeDatabase() {
  try {
    store.dispatch(setStatus(ActionStatus.LOADING));
    
    // Set up auth state listener
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
        if (userDoc.exists()) { 
          const userData = userDoc.data() as Omit<User, 'id'>;
          store.dispatch(setUser({
            id: user.uid,
            password_hash: '',
            ...userData
          }));
        } else {
          console.error('User document not found in Firestore');
          auth.signOut();
          store.dispatch(logout());
        }
      } else {
        store.dispatch(setStatus(ActionStatus.IDLE));
        store.dispatch(logout());
      }
    });

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    store.dispatch(setError('Failed to initialize database'));
    store.dispatch(setStatus(ActionStatus.FAILED));
    throw error;
  }
}