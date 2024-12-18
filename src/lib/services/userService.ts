import { doc, updateDoc } from 'firebase/firestore';
import { updateEmail, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { handleFirebaseError } from './errorHandling';
import { retryOperation } from './networkUtils';

export const userService = {
  async updateProfile(data: { name?: string; email?: string }) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const updates: Record<string, any> = {
        updated_at: new Date().toISOString()
      };

      if (data.name) {
        updates.name = data.name;
        await updateProfile(user, { displayName: data.name });
      }

      if (data.email && data.email !== user.email) {
        updates.email = data.email;
        await updateEmail(user, data.email);
      }

      await retryOperation(() =>
        updateDoc(doc(db, 'users', user.uid), updates)
      );

      return true;
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async updatePassword(currentPassword: string, newPassword: string) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');
      if (!user.email) throw new Error('No email associated with user');

      // Re-authenticate user before password change
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      // Update user document
      await retryOperation(() =>
        updateDoc(doc(db, 'users', user.uid), {
          updated_at: new Date().toISOString()
        })
      );

      return true;
    } catch (error) {
      throw handleFirebaseError(error);
    }
  }
};