import { Middleware } from '@reduxjs/toolkit';
import { setError } from '../slices/uiSlice';
import { auth } from '../../firebase/config';

export const firestoreMiddleware: Middleware = (store) => (next) => async (action) => {
  // Check for Firebase auth state before Firestore operations
  if (action.type.startsWith('properties/') || 
      action.type.startsWith('tenants/') || 
      action.type.startsWith('maintenance/')) {
    if (!auth.currentUser) {
      store.dispatch(setError('Authentication required'));
      return;
    }
  }

  try {
    const result = await next(action);
    return result;
  } catch (error) {
    console.error('Firestore Error:', error);
    store.dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    return error;
  }
};