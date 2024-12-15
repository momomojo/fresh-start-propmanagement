import { Middleware } from '@reduxjs/toolkit';
import { setError } from '../slices/uiSlice';

export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (typeof action === 'object' && action !== null && 'type' in action && typeof action.type === 'string') {
    if (action.type.endsWith('/rejected')) {
      console.error('Action Error:', (action as any).error);
      store.dispatch(setError((action as any).error?.message || 'An error occurred'));
    }
  }

  return result;
};
