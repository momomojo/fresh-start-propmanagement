import { auth } from '../firebase/config';

export const checkConnection = async () => {
  try {
    // Try to refresh the auth token as a connectivity test
    const user = auth.currentUser;
    if (user) {
      await user.getIdToken(true);
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const waitForConnection = async (timeout = 30000): Promise<boolean> => {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    if (await checkConnection()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return false;
};

export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        const isOnline = await checkConnection();
        if (!isOnline) {
          throw new Error('No network connection');
        }
      }
      
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Operation failed');
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }
  
  throw lastError!;
}

export async function getClientIp(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Failed to get client IP:', error);
    return 'unknown';
  }
}