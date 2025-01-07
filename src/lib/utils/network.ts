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