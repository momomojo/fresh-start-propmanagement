import { createClient } from '@libsql/client/web';

// Database configuration
const config = {
  url: import.meta.env.VITE_DB_URL || 'file:local.db',
  authToken: import.meta.env.VITE_DB_AUTH_TOKEN || undefined,
};

// Create database client
export const db = createClient(config);

// Export database configuration
export default config;