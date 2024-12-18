// src/lib/services/authService.ts
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { setPersistence, browserLocalPersistence, browserSessionPersistence, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserRole } from '@/types';

const AUTH_ERRORS = {
  'auth/invalid-credential': 'Invalid email or password',
  'auth/user-disabled': 'This account has been disabled',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Invalid email or password',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later',
} as const;

function handleAuthError(error: unknown) {
  if (error instanceof Error && 'code' in error) {
    const code = error.code as keyof typeof AUTH_ERRORS;
    return new Error(AUTH_ERRORS[code] || 'An unexpected error occurred');
  }
  return new Error('An unexpected error occurred');
}

export const authService = {
  async login(email: string, password: string, rememberMe: boolean = false) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Set persistence based on remember me option
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      const token = await userCredential.user.getIdToken();
      
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        const timestamp = new Date().toISOString();
        const userData = {
          email: userCredential.user.email,
          name: userCredential.user.displayName || email.split('@')[0],
          role: 'tenant',
          created_at: timestamp,
          updated_at: timestamp
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
        return {
          token,
          user: {
            id: userCredential.user.uid,
            ...userData
          }
        };
      } else {
        const userData = userDoc.data();
        return {
          token,
          user: {
            id: userCredential.user.uid,
            ...userData
          }
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw handleAuthError(error);
    }
  },

  async signup(data: { email: string; password: string; name: string; role: UserRole }) {
    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const timestamp = new Date().toISOString();
      
      // Prepare user data for Firestore
      const userData = {
        email: data.email,
        name: data.name,
        password_hash: '',
        role: data.role,
        created_at: timestamp,
        updated_at: timestamp
      };
      
      // Create user document first
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      // Get fresh token
      const token = await userCredential.user.getIdToken();
      
      return {
        token,
        user: {
          password_hash: '',
          id: userCredential.user.uid,
          ...userData,
          created_at: timestamp,
          updated_at: timestamp
        }
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw handleAuthError(error);
    }
  },

  async logout() {
    try {
      await signOut(auth);
      return true;
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw handleAuthError(error);
    }
  },

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true
      });
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      throw handleAuthError(error);
    }
  },

  async verifyEmail() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');
      await sendEmailVerification(user, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true
      });
      return true;
    } catch (error) {
      console.error('Email verification error:', error);
      throw handleAuthError(error);
    }
  }
};