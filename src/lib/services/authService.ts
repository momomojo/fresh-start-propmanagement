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
  },

  async updateProfile(data: { name: string; email: string; avatar_url?: string }) {
    try {
      return await firebaseAuthService.updateProfile(data);
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  },

  async updatePassword(currentPassword: string, newPassword: string) {
    try {
      return await firebaseAuthService.updatePassword(currentPassword, newPassword);
    } catch (error) {
      console.error('Password update error:', error);
      throw new Error('Failed to update password');
    }
  },

  async getAllUsers() {
    try {
      return await firebaseAuthService.getAllUsers();
    } catch (error) {
      console.error('Get users error:', error);
      throw new Error('Failed to fetch users');
    }
  },

  async updateUserRole(userId: string, role: User['role']) {
    try {
      return await firebaseAuthService.updateUserRole(userId, role);
    } catch (error) {
      console.error('Role update error:', error);
      throw new Error('Failed to update user role');
    }
  }
};