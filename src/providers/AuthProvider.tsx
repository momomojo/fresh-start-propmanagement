import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { auth, db } from '@/lib/firebase/config';
import { tokenService } from '@/lib/services/tokenService';
import { sessionService } from '@/lib/services/sessionService';
import { syncService } from '@/lib/services/syncService';
import { setUser, setStatus, setError } from '@/lib/store/slices/authSlice';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ActionStatus } from '@/lib/store/types';
import { RootState, persistor } from '@/lib/store';
import type { User, AuthContextType } from '@/types';
import { handleFirebaseError } from '@/lib/services/errorHandling';
import { retryOperation } from '@/lib/services/networkUtils';

export const AuthContext = createContext<AuthContextType>({
  isInitialized: false,
  isAuthenticated: false,
  user: null
});

function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Initialize session management
    sessionService.initializeSession();
    
    // Restore auth state from localStorage if available
    const savedAuth = localStorage.getItem('auth_state');
    if (savedAuth) {
      try {
        const { user, token } = JSON.parse(savedAuth);
        dispatch(setUser(user));
        dispatch(setStatus(ActionStatus.SUCCEEDED));
      } catch (error) {
        console.warn('Failed to restore auth state:', error);
        localStorage.removeItem('auth_state');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await retryOperation(() => tokenService.refreshToken(firebaseUser));
          syncService.startSync(firebaseUser.uid);

          const userDoc = await retryOperation(() => getDoc(doc(db, 'users', firebaseUser.uid)));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const user = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: userData.name,
              role: userData.role,
              emailVerified: firebaseUser.emailVerified,
              created_at: userData.created_at,
              updated_at: userData.updated_at
            };
            
            // Update email verification status if changed
            if (userData.emailVerified !== firebaseUser.emailVerified) {
              await retryOperation(() =>
                updateDoc(doc(db, 'users', firebaseUser.uid), {
                  emailVerified: firebaseUser.emailVerified,
                  updated_at: new Date().toISOString()
                })
              );
            }
            
            dispatch(setUser(user));
            localStorage.setItem('auth_state', JSON.stringify({ user, token }));
            dispatch(setStatus(ActionStatus.SUCCEEDED));
          } else {
            console.error('User document not found');
            dispatch(setError('User profile not found'));
            auth.signOut();
            await auth.signOut();
          }
        } else {
          tokenService.clearToken();
          syncService.stopSync();
          localStorage.removeItem('auth_state');
          dispatch(setStatus(ActionStatus.IDLE));
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        const appError = handleFirebaseError(error);
        dispatch(setError(appError.message));
      } finally {
        setIsInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
      <AuthContext.Provider
        value={{
          isInitialized,
          isAuthenticated: !!user,
          user
        }}
      >
        {children}
      </AuthContext.Provider>
    </PersistGate>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };