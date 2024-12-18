import { 
  GoogleAuthProvider, 
  signInWithPopup,
  linkWithPopup,
  getAdditionalUserInfo
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { handleFirebaseError } from './errorHandling';
import { retryOperation } from './networkUtils';
import { securityService } from './securityService';
import { getClientIp } from './networkUtils';
import type { User } from '@/types';

export const socialAuthService = {
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      // Add scopes for additional Google account info
      provider.addScope('profile');
      provider.addScope('email');
      
      // Force account selection even if already logged in
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      // Force token refresh to ensure maximum validity period
      const token = await result.user.getIdToken(true);
      const additionalInfo = getAdditionalUserInfo(result);
      const isNewUser = additionalInfo?.isNewUser;
      
      const userDoc = await retryOperation(() => 
        getDoc(doc(db, 'users', result.user.uid))
      );
      
      const ipAddress = await getClientIp();
      const timestamp = new Date().toISOString();
      const deviceInfo = {
        browser: navigator.userAgent,
        os: navigator.platform
      };
      
      if (!userDoc.exists() || isNewUser) {
        const userData = {
          email: result.user.email,
          name: result.user.displayName,
          role: 'tenant', // Default role for new users
          emailVerified: result.user.emailVerified,
          provider: 'google',
          avatar_url: result.user.photoURL,
          created_at: timestamp,
          updated_at: timestamp,
          last_login: timestamp
        } as User;

        await retryOperation(() =>
          setDoc(doc(db, 'users', result.user.uid), userData)
        );
        
        // Track successful new user creation
        await securityService.trackLoginAttempt(true, ipAddress, {
          timestamp,
          deviceInfo,
          provider: 'google'
        });
        
        return { user: { id: result.user.uid, ...userData }, token };
      } else {
        // Update existing user with latest Google info
        const updates = {
          avatar_url: result.user.photoURL,
          emailVerified: result.user.emailVerified,
          updated_at: timestamp,
          last_login: timestamp
        };
        
        await retryOperation(() =>
          updateDoc(doc(db, 'users', result.user.uid), updates)
        );
        
        // Track successful login for existing user
        await securityService.trackLoginAttempt(true, ipAddress, {
          timestamp,
          deviceInfo,
          provider: 'google'
        });
        
        return {
          user: {
            id: result.user.uid,
            ...userDoc.data(),
            ...updates
          } as User,
          token
        };
      }
    } catch (error) {
      const appError = handleFirebaseError(error);
      
      // Skip tracking for user-initiated cancellations
      const skipTracking = [
        'auth/popup-closed-by-user',
        'auth/cancelled-popup-request',
        'auth/popup-blocked'
      ].includes(appError.code as string);
      
      if (!skipTracking) {
        try {
          await securityService.trackLoginAttempt(false, await getClientIp(), {
            timestamp: new Date().toISOString(),
            deviceInfo,
            provider: 'google'
          });
        } catch (trackingError) {
          console.warn('Failed to track login attempt:', trackingError);
        }
      }
      
      // Show user-friendly error for cancellations
      if (skipTracking) {
        throw new Error('Sign-in cancelled. Please try again.');
      }
      throw appError;
    }
  },

  async linkGoogleAccount() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const provider = new GoogleAuthProvider();
      
      const result = await linkWithPopup(user, provider);
      const additionalInfo = getAdditionalUserInfo(result);

      await updateDoc(doc(db, 'users', user.uid), {
        provider: additionalInfo?.providerId || 'google',
        avatar_url: result.user.photoURL,
        updated_at: new Date().toISOString()
      });

      return true;
    } catch (error) {
      throw handleFirebaseError(error);
    }
  }
};