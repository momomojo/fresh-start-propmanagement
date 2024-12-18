import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
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
  provider?: string;
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
        loginNotifications: userDoc.data()?.login_notifications || false,
        suspiciousLoginAlerts: userDoc.data()?.suspicious_login_alerts || false,
        twoFactorEnabled: userDoc.data()?.two_factor_enabled || false
      };
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async trackLoginAttempt(
    success: boolean,
    ipAddress: string,
    context?: {
      timestamp?: string;
      deviceInfo?: {
        browser: string;
        os: string;
      };
      provider?: string;
    }
  ): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const deviceInfo: DeviceInfo = {
        deviceId: crypto.randomUUID(),
        browser: context?.deviceInfo?.browser || navigator.userAgent,
        os: context?.deviceInfo?.os || navigator.platform,
        lastLogin: context?.timestamp || new Date().toISOString(),
        ipAddress
      };

      const loginHistoryItem: LoginHistoryItem = {
        timestamp: context?.timestamp || new Date().toISOString(),
        success,
        ipAddress,
        deviceInfo,
        provider: context?.provider
      };

      await retryOperation(() =>
        updateDoc(doc(db, 'users', user.uid), {
          devices: arrayUnion(deviceInfo),
          login_history: arrayUnion(loginHistoryItem)
        })
      );

      // If it's a suspicious login, trigger alerts
      if (!success && user.email) {
        const settings = await this.getSecuritySettings();
        if (settings.suspiciousLoginAlerts) {
          // TODO: Implement suspicious login notification
          console.warn('Suspicious login detected:', loginHistoryItem);
        }
      }
    } catch (error) {
      console.error('Error tracking login attempt:', error);
      // Don't throw here to prevent blocking the auth flow
    }
  },

  async removeDevice(deviceId: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const userDoc = await retryOperation(() =>
        getDoc(doc(db, 'users', user.uid))
      );
      
      const devices = userDoc.data()?.devices || [];
      const deviceToRemove = devices.find((d: DeviceInfo) => d.deviceId === deviceId);

      if (deviceToRemove) {
        await retryOperation(() =>
          updateDoc(doc(db, 'users', user.uid), {
            devices: arrayRemove(deviceToRemove)
          })
        );
      }
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async updateSecuritySettings(settings: {
    loginNotifications?: boolean;
    suspiciousLoginAlerts?: boolean;
    twoFactorEnabled?: boolean;
  }): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      await retryOperation(() =>
        updateDoc(doc(db, 'users', user.uid), {
          ...settings,
          updated_at: new Date().toISOString()
        })
      );
    } catch (error) {
      throw handleFirebaseError(error);
    }
  }
};