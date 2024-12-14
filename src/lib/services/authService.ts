import { auth } from '../firebase/config';
import { authService as firebaseAuthService } from '../firebase/services/authService';
import type { User } from '../../types';

export const authService = {
  async login(email: string, password: string) {
    try {
      return await firebaseAuthService.login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  },

  async register(data: { email: string; password: string; name: string; role: User['role'] }) {
    try {
      return await firebaseAuthService.register(data);
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Email already registered');
    }
  },

  async logout() {
    try {
      await firebaseAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};