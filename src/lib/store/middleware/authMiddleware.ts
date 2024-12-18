import { Middleware } from '@reduxjs/toolkit';
import { tokenService } from '@/lib/services/tokenService';
import { sessionService } from '@/lib/services/sessionService';
import { logout } from '../slices/authSlice';

export const authMiddleware: Middleware = (store) => (next) => async (action) => {
  // Handle auth-related actions
  if (action.type === 'auth/logout') {
    sessionService.clearSession();
  }

  // Validate token before certain actions
  if (action.type.startsWith('properties/') || 
      action.type.startsWith('tenants/') || 
      action.type.startsWith('maintenance/')) {
    const isValid = await tokenService.validateToken();
    if (!isValid) {
      store.dispatch(logout());
      return;
    }
  }

  return next(action);
};