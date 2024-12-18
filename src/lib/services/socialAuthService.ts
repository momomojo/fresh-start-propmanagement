import { 
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
  OAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { handleFirebaseError } from './errorHandling';

export const socialAuthService = {
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      
      const userDoc = await retryOperation(() => 
        getDoc(doc(db, 'users', result.user.uid))
      );
      
      if (!userDoc.exists()) {
        const userData = {
          email: result.user.email,
          name: result.user.displayName,
          role: 'tenant',
          emailVerified: result.user.emailVerified,
          provider: 'google',
          google_id: result.user.providerData[0]?.uid,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await retryOperation(() =>
          setDoc(doc(db, 'users', result.user.uid), userData)
        );
      }
      
      return result.user;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw handleFirebaseError(error);
    }
  },

  async linkGoogleAccount() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const provider = new GoogleAuthProvider();
      await linkWithPopup(user, provider);
    } catch (error) {
      throw handleFirebaseError(error);
    }
  }
};