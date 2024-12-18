import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { auth, db } from '@/lib/firebase/config';
import { tokenService } from '@/lib/services/tokenService';
import { sessionService } from '@/lib/services/sessionService';
import { setUser, setStatus, setError } from '@/lib/store/slices/authSlice';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ActionStatus } from '@/lib/store/types';
import type { User } from '@/types';

interface AuthContextType {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  isInitialized: false,
  isAuthenticated: false,
  user: null
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize session management
    sessionService.initializeSession();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get fresh token
          await tokenService.refreshToken(firebaseUser);

          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            dispatch(setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: userData.name,
              role: userData.role,
              created_at: userData.created_at,
              updated_at: userData.updated_at
            }));
            dispatch(setStatus(ActionStatus.SUCCEEDED));
          } else {
            console.error('User document not found');
            dispatch(setError('User profile not found'));
            auth.signOut();
          }
        } else {
          tokenService.clearToken();
          dispatch(setStatus(ActionStatus.IDLE));
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        dispatch(setError('Authentication failed'));
      } finally {
        setIsInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [dispatch, auth, db]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isInitialized,
        isAuthenticated: !!auth.currentUser,
        user: auth.currentUser as User | null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);