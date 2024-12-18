import { FirebaseError } from 'firebase/app';

export interface AppError extends Error {
  code?: string;
  context?: Record<string, unknown>;
  originalError?: unknown;
}

export const AUTH_ERROR_MESSAGES = {
  'auth/session-expired': 'Your session has expired. Please sign in again.',
  'auth/timeout': 'Session timed out due to inactivity. Please sign in again.',
  'auth/unauthorized-continue-uri': 'Invalid verification URL configuration',
  'auth/unauthorized-domain': 'This domain is not authorized for authentication operations',
  'auth/requires-recent-login': 'Please log in again to continue',
  'auth/popup-closed-by-user': 'Authentication popup was closed',
  'auth/cancelled-popup-request': 'Authentication popup request was cancelled',
  'auth/invalid-credential': 'Invalid email or password',
  'auth/user-disabled': 'This account has been disabled',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Invalid email or password',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later',
  'auth/email-already-in-use': 'Email address is already in use',
  'auth/weak-password': 'Password should be at least 6 characters',
  'auth/invalid-email': 'Invalid email address format',
  'auth/operation-not-allowed': 'Operation not allowed',
  'permission-denied': 'You do not have permission to perform this action',
  'not-found': 'The requested resource was not found',
  'already-exists': 'This resource already exists',
  'auth/network-request-failed': 'Network error. Please check your connection',
  'invalid-argument': 'Invalid query parameters',
  'resource-exhausted': 'Too many requests. Please try again later',
  'auth/popup-blocked': 'Please enable popups for this site to use social login',
  'auth/account-exists-with-different-credential': 'An account already exists with this email. Please try a different login method.',
  'failed-precondition': 'Operation cannot be completed in current state',
  'out-of-range': 'Operation parameters out of valid range',
  'unauthenticated': 'Authentication required',
  'unavailable': 'Service temporarily unavailable',
} as const;

export function handleFirebaseError(error: unknown): AppError {
  // Only log in development
  if (import.meta.env.DEV) {
    console.error('Original error:', error);
  }

  if (error instanceof FirebaseError) {
    const message = AUTH_ERROR_MESSAGES[error.code as keyof typeof AUTH_ERROR_MESSAGES] 
      || 'An unexpected error occurred';
    
    return {
      name: 'AuthError',
      message,
      code: error.code,
      originalError: error,
      context: {
        timestamp: new Date().toISOString(),
        environment: import.meta.env.MODE
      }
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      originalError: error,
      context: {
        timestamp: new Date().toISOString()
      }
    };
  }

  return {
    name: 'UnknownError',
    message: 'An unexpected error occurred',
    originalError: error,
    context: {
      timestamp: new Date().toISOString()
    }
  };
}