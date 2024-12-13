import db from './index';
import { hashPassword } from '../utils/password';
import { generateUUID } from '../utils/uuid';

export async function initializeDatabase() {
  try {
    // Create default admin user if none exists
    const adminExists = Array.from(db.users.values()).find(
      user => user.email === 'admin@propertypro.com'
    );

    if (!adminExists) {
      const adminUser = {
        id: generateUUID(),
        email: 'admin@propertypro.com',
        password_hash: await hashPassword('admin123'),
        name: 'System Admin',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      db.users.set(adminUser.id, adminUser);
    }

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}