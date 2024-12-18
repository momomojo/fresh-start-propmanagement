import { 
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  updateEmail,
  updatePhoneNumber
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { handleFirebaseError } from './errorHandling';

export const accountRecoveryService = {
  async initiatePasswordReset(email: string) {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true
      });
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async verifyResetCode(code: string) {
    try {
      await verifyPasswordResetCode(auth, code);
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async completePasswordReset(code: string, newPassword: string) {
    try {
      await confirmPasswordReset(auth, code, newPassword);
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async updateRecoveryEmail(newEmail: string) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      await updateEmail(user, newEmail);
      await updateDoc(doc(db, 'users', user.uid), {
        recovery_email: newEmail,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async updateRecoveryPhone(newPhone: string) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      await updateDoc(doc(db, 'users', user.uid), {
        recovery_phone: newPhone,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      throw handleFirebaseError(error);
    }
  }
};