import { auth } from '@/lib/firebase/config';
import { tokenService } from './tokenService';
import { logout } from '@/lib/store/slices/authSlice';
import { store } from '@/lib/store';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
const ACTIVITY_KEY = 'last_activity';

class SessionService {
  private lastActivity: number;
  private timeoutId: NodeJS.Timeout | null;
  private refreshIntervalId: NodeJS.Timeout | null;

  constructor() {
    this.lastActivity = Date.now();
    this.timeoutId = null;
    this.refreshIntervalId = null;
  }

  initializeSession(): void {
    this.resetActivityTimer();
    this.startTokenRefresh();
    window.addEventListener('mousemove', () => this.resetActivityTimer());
    window.addEventListener('keypress', () => this.resetActivityTimer());
    
    // Check session status periodically
    setInterval(() => this.checkSession(), 60000);
  }

  private startTokenRefresh(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }

    this.refreshIntervalId = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          await tokenService.refreshToken(user);
        } catch (error) {
          console.error('Token refresh failed:', error);
          await this.handleInactivity();
        }
      }
    }, TOKEN_REFRESH_INTERVAL);
  }

  private resetActivityTimer(): void {
    this.lastActivity = Date.now();
    localStorage.setItem(ACTIVITY_KEY, this.lastActivity.toString());
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => this.handleInactivity(), SESSION_TIMEOUT);
  }

  async checkSession(): Promise<boolean> {
    const lastActivity = parseInt(localStorage.getItem(ACTIVITY_KEY) || '0');
    const isTokenValid = await tokenService.validateToken();
    
    if (!isTokenValid || Date.now() - lastActivity > SESSION_TIMEOUT) {
      await this.handleInactivity();
      return false;
    }
    
    return true;
  }

  private async handleInactivity(): Promise<void> {
    try {
      if (auth.currentUser) {
        // Clear all auth state before redirect
        await auth.signOut();
        store.dispatch(logout());
      }
      tokenService.clearToken();
      localStorage.removeItem('auth_state');
      localStorage.removeItem(ACTIVITY_KEY);
      
      // Use replaceState to prevent back navigation to expired session
      window.history.replaceState(null, '', '/login?timeout=true');
      window.location.href = '/login?timeout=true';
    } catch (error) {
      console.error('Error handling inactivity:', error);
    }
  }

  clearSession(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    }
    localStorage.removeItem(ACTIVITY_KEY);
    localStorage.removeItem('auth_state');
    tokenService.clearToken();
  }

  async validateSession(): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      const lastActivity = parseInt(localStorage.getItem(ACTIVITY_KEY) || '0');
      const isTokenValid = await tokenService.validateToken();
      
      if (!isTokenValid || Date.now() - lastActivity > SESSION_TIMEOUT) {
        await this.handleInactivity();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      await this.handleInactivity();
      return false;
    }
  }
}

export const sessionService = new SessionService();