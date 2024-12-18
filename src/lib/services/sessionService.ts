import { auth } from '@/lib/firebase/config';
import { tokenService } from './tokenService';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_KEY = 'last_activity';

class SessionService {
  private lastActivity: number;
  private timeoutId: NodeJS.Timeout | null;

  constructor() {
    this.lastActivity = Date.now();
    this.timeoutId = null;
  }

  initializeSession(): void {
    this.resetActivityTimer();
    window.addEventListener('mousemove', () => this.resetActivityTimer());
    window.addEventListener('keypress', () => this.resetActivityTimer());
    
    // Check session status periodically
    setInterval(() => this.checkSession(), 60000);
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
        await auth.signOut();
      }
      tokenService.clearToken();
      localStorage.removeItem('auth_state');
      localStorage.removeItem(ACTIVITY_KEY);
      window.location.href = '/login?timeout=true';
    } catch (error) {
      console.error('Error handling inactivity:', error);
    }
  }

  clearSession(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    localStorage.removeItem(ACTIVITY_KEY);
    localStorage.removeItem('auth_state');
    tokenService.clearToken();
  }
}

export const sessionService = new SessionService();