import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { store } from '../store';
import { setUser, setToken } from '../store/slices/authSlice';

export async function initializeDatabase() {
  try {
    // Set up auth state listener
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        store.dispatch(setToken(token));
        store.dispatch(setUser({
          id: user.uid,
          email: user.email!,
          name: user.displayName || 'User',
          role: 'tenant', // Default role, should be fetched from Firestore
          created_at: user.metadata.creationTime || new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
      } else {
        store.dispatch(setToken(null));
        store.dispatch(setUser(null));
      }
    });

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}