import { auth } from '@/lib/firebase/config';
import { User as FirebaseUser } from 'firebase/auth';

const TOKEN_KEY = 'auth_token_secure';
const TOKEN_EXPIRY_KEY = 'token_expiry_secure';
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

// Helper functions outside the service object
function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error reading token:', error);
    return null;
  }
}

function getStoredExpiry(): string | null {
  try {
    return localStorage.getItem(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error('Error reading token expiry:', error);
    return null;
  }
}

function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function storeExpiry(expiry: number): void {
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
}

export const tokenService = {
  async getToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;

    const existingToken = getStoredToken();
    const tokenExpiry = getStoredExpiry();

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

    storeToken(token);
    storeExpiry(expiryTime);

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