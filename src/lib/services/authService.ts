// src/lib/services/authService.ts
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { setPersistence, browserLocalPersistence, browserSessionPersistence, sendPasswordResetEmail, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { securityService } from './securityService';
import { retryOperation, getClientIp } from './networkUtils';
import type { UserRole } from '@/types';

import { handleFirebaseError } from './errorHandling';

export const authService = {
  async login(email: string, password: string, rememberMe: boolean = false) {
    try {
      // Get IP address for security tracking
      const ipAddress = await getClientIp();
      
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      } catch (error) {
        console.warn('Persistence setting failed:', error);
      }
      
      // Track login attempt before authentication
      const preAuthTime = new Date().toISOString();
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const token = await userCredential.user.getIdToken();
      
      const userDoc = await retryOperation(() => 
        getDoc(doc(db, 'users', userCredential.user.uid))
      );
      
      if (!userDoc.exists()) {
        const timestamp = new Date().toISOString();
        const userData = {
          email: userCredential.user.email,
          name: userCredential.user.displayName || email.split('@')[0],
          role: 'tenant',
          emailVerified: userCredential.user.emailVerified,
          created_at: timestamp,
          updated_at: timestamp
        };
        await retryOperation(() =>
          setDoc(doc(db, 'users', userCredential.user.uid), userData)
        );
        
        // Track login attempt
        await securityService.trackLoginAttempt(true, ipAddress, {
          timestamp: preAuthTime,
          deviceInfo: {
            browser: navigator.userAgent,
            os: navigator.platform
          }
        });
        
        return {
          token,
          user: {
            id: userCredential.user.uid,
            ...userData
          }
        };
      } else {
        const userData = userDoc.data();
        // Update email verification status if changed
        if (userData.emailVerified !== userCredential.user.emailVerified) {
          await updateDoc(doc(db, 'users', userCredential.user.uid), {
            emailVerified: userCredential.user.emailVerified,
            updated_at: new Date().toISOString()
          });
        }
        
        // Track successful login
        await securityService.trackLoginAttempt(true, ipAddress, {
          timestamp: preAuthTime,
          deviceInfo: {
            browser: navigator.userAgent,
            os: navigator.platform
          }
        });
        
        return {
          token,
          user: {
            id: userCredential.user.uid,
            emailVerified: userCredential.user.emailVerified,
            ...userData
          }
        };
      }
    } catch (error) {
      // Track failed login attempt
      const ipAddress = await getClientIp();
      await securityService.trackLoginAttempt(false, ipAddress, {
        timestamp: new Date().toISOString(),
        deviceInfo: {
          browser: navigator.userAgent,
          os: navigator.platform
        }
      });
      
      console.error('Login error:', error);
      throw handleFirebaseError(error);
    }
  },

  async signup(data: { email: string; password: string; name: string; role: UserRole }) {
    try {
      // Set persistence to local by default for new signups
      await setPersistence(auth, browserLocalPersistence);
      
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: data.name
      });
      
      const timestamp = new Date().toISOString();
      
      const userData = {
        email: data.email,
        name: data.name,
        password_hash: '',
        role: data.role,
        emailVerified: false,
        created_at: timestamp,
        updated_at: timestamp
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      const token = await userCredential.user.getIdToken();
      
      // Send email verification
      await sendEmailVerification(userCredential.user, {
        url: `${window.location.origin}/verify-email`
      });
      
      return {
        token,
        user: {
          password_hash: '',
          id: userCredential.user.uid,
          emailVerified: false,
          ...userData,
          created_at: timestamp,
          updated_at: timestamp
        }
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw handleFirebaseError(error);
    }
  },

  async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('auth_state');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw handleFirebaseError(error);
    }
  },

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login?reset=success`
      });
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      throw handleFirebaseError(error);
    }
  },

  async verifyEmail() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');
      
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email`
      });
      return true;
    } catch (error) {
      console.error('Email verification error:', error);
      throw handleFirebaseError(error);
    }
  }
};