import { auth } from '@/lib/firebase/config';
import { User as FirebaseUser } from 'firebase/auth';

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export const tokenService = {
  async getToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;

    const existingToken = localStorage.getItem(TOKEN_KEY);
    const tokenExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (existingToken && tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry);
      if (Date.now() < expiryTime - REFRESH_THRESHOLD) {
        return existingToken;
      }
    }

    return this.refreshToken(user);
  },

  async refreshToken(user: FirebaseUser): Promise<string> {
    const token = await user.getIdToken(true);
    const decodedToken = await user.getIdTokenResult();
    const expiryTime = new Date(decodedToken.expirationTime).getTime();

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

    return token;
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  async validateToken(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch {
      return false;
    }
  }
};