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

export const authService = {
  // Sign up a new user
  async register(data: { email: string; password: string; name: string; role: User['role'] }) {
    try {
      // First create the user document in Firestore
      const userDoc = {
        email: data.email,
        name: data.name,
        role: data.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Then create the authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Combine the auth user ID with the user document
      const user = {
        id: userCredential.user.uid,
        ...userDoc
      };

      // Store additional user data in Firestore
      await setDoc(doc(db, COLLECTIONS.USERS, user.id), userDoc);

      return { user, token: await userCredential.user.getIdToken() };
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password sign-up is not enabled. Please contact support.');
      }
      throw error;
    }
  },

  // Sign in existing user
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get the user document from Firestore
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid));
      
      if (!userDoc.exists()) {
        // Create a default user document if it doesn't exist
        const userData = {
          email: userCredential.user.email!,
          name: userCredential.user.displayName || 'User',
          role: 'tenant',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        await setDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid), userData);
        return {
          user: { id: userCredential.user.uid, ...userData },
          token: await userCredential.user.getIdToken()
        };
      }

      const user = { id: userDoc.id, ...userDoc.data() } as User;
      const token = await userCredential.user.getIdToken();

      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(
        (error as { code?: string }).code === 'auth/user-not-found'
          ? 'Invalid email or password'
          : 'Failed to login. Please try again.'
      );
    }
  },

  // Sign out user
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Reset password
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
};