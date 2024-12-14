import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { setError } from '../slices/uiSlice';

export const errorMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  // Handle rejected actions
  if (action.type.endsWith('/rejected')) {
    console.error('Action Error:', action.error);
    store.dispatch(setError(action.error?.message || 'An error occurred'));
    
    // Clear error after 5 seconds
    setTimeout(() => {
      store.dispatch(setError(null));
    }, 5000);
  }
  
  return next(action);
};