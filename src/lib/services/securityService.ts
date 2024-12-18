import { getDoc } from 'firebase/firestore';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { handleFirebaseError } from './errorHandling';
import { retryOperation } from './networkUtils';

interface DeviceInfo {
  deviceId: string;
  browser: string;
  os: string;
  lastLogin: string;
  ipAddress: string;
}

interface LoginHistoryItem {
  timestamp: string;
  success: boolean;
  ipAddress: string;
  deviceInfo: DeviceInfo;
}

export const securityService = {
  async getDevices(): Promise<DeviceInfo[]> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const userDoc = await retryOperation(() =>
        getDoc(doc(db, 'users', user.uid))
      );
      
      return userDoc.data()?.devices || [];
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async getLoginHistory(): Promise<LoginHistoryItem[]> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const userDoc = await retryOperation(() =>
        getDoc(doc(db, 'users', user.uid))
      );
      
      return userDoc.data()?.login_history || [];
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async getSecuritySettings() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const userDoc = await retryOperation(() =>
        getDoc(doc(db, 'users', user.uid))
      );
      
      return {
        loginNotifications: userDoc.data()?.login_notifications || false
      };
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async trackLoginAttempt(success: boolean, ipAddress: string) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const deviceInfo: DeviceInfo = {
        deviceId: crypto.randomUUID(),
        browser: navigator.userAgent,
        os: navigator.platform,
        lastLogin: new Date().toISOString(),
        ipAddress
      };

      // Get existing login history
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const loginHistory = userDoc.data()?.login_history || [];

      // Add new login attempt
      await updateDoc(doc(db, 'users', user.uid), {
        login_history: [...loginHistory, {
          timestamp: new Date().toISOString(),
          success,
          ipAddress,
          deviceInfo
        }].slice(-50) // Keep only last 50 entries
      });
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async removeDevice(deviceId: string) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      await updateDoc(doc(db, 'users', user.uid), {
        devices: devices.filter((d: DeviceInfo) => d.deviceId !== deviceId)
      });
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async enableLoginNotifications(enabled: boolean) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      await updateDoc(doc(db, 'users', user.uid), {
        login_notifications: enabled,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      throw handleFirebaseError(error);
    }
  }
};