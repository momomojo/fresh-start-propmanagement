import { 
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { handleFirebaseError } from './errorHandling';

export const mfaService = {
  async enrollPhoneMfa(phoneNumber: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const multiFactorSession = await multiFactor(user).getSession();
      
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneNumber,
        multiFactorSession
      );

      localStorage.setItem('mfa_verification_id', verificationId);
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async verifyPhoneMfa(verificationCode: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const verificationId = localStorage.getItem('mfa_verification_id');
      if (!verificationId) throw new Error('No verification ID found');

      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      
      await multiFactor(user).enroll(multiFactorAssertion, 'Phone Number');
      localStorage.removeItem('mfa_verification_id');
    } catch (error) {
      throw handleFirebaseError(error);
    }
  }
};