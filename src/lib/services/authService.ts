// src/lib/services/authService.ts
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
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
  async login(email: string, password: string) {
    try {
      console.log('Attempting login with email:', email);
      if (!auth.currentUser) {
        console.log('No current user, proceeding with login');
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        console.error('User document not found in Firestore');
        await signOut(auth);
        throw new Error('User account not properly set up. Please contact support.');
      }
      
      const userData = userDoc.data();
      console.log('Login successful');
      return {
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          name: userData.name,
          role: userData.role,
          created_at: userData.created_at,
          updated_at: userData.updated_at
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw handleAuthError(error);
    }
  },

  async signup(data: { email: string; password: string; name: string; role: UserRole }) {
    try {
      console.log('Attempting signup with email:', data.email);
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const timestamp = new Date().toISOString();
      const userData = {
        email: data.email,
        name: data.name,
        role: data.role,
        created_at: timestamp,
        updated_at: timestamp
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      // After creating the user, sign them in
      await signInWithEmailAndPassword(auth, data.email, data.password);
      
      return {
        user: {
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
      console.log('Attempting logout');
      await signOut(auth);
      console.log('Logout successful');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw handleAuthError(error);
    }
  },
};