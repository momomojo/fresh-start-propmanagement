import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config';
import { COLLECTIONS } from '../collections';
import type { User } from '../../../types';

const handleAuthError = (error: any) => {
  if (error.code === 'auth/network-request-failed') {
    throw new Error('Network error. Please check your connection and try again.');
  }
  if (error.code === 'auth/too-many-requests') {
    throw new Error('Too many attempts. Please try again later.');
  }
  throw error;
};

export const authService = {
  // Sign up a new user
  async register(data: { email: string; password: string; name: string; role: User['role'] }) {
    try {
      // Then create the authentication user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

      // Create the user document in Firestore
      const userDoc = {
        email: data.email,
        name: data.name,
        role: data.role,
        password_hash: '', // We don't store passwords
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Store additional user data in Firestore
      await setDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid), userDoc);

      const user = {
        id: userCredential.user.uid,
        ...userDoc
      };

      return { user, token: await userCredential.user.getIdToken() };
    } catch (error) {
      console.error('Error registering user:', error);
      handleAuthError(error);
    }
  },

  // Sign in existing user
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const user = { id: userDoc.id, ...userDoc.data() } as User;
      const token = await userCredential.user.getIdToken();

      return { user, token };
    } catch (error) {
      console.error('Error logging in:', error);
      handleAuthError(error);
    }
  },

  // Sign out user
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      handleAuthError(error);
    }
  },

  // Reset password
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error resetting password:', error);
      handleAuthError(error);
    }
  }
};