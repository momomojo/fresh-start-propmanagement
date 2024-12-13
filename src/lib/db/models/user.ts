import db from '../index';
import { generateUUID } from '../../utils/uuid';
import type { User } from '../../../types';

export class UserModel {
  static async findById(id: string): Promise<User | null> {
    return db.users.get(id) || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    return Array.from(db.users.values()).find(user => user.email === email) || null;
  }

  static async create(data: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const id = generateUUID();
    const now = new Date().toISOString();
    
    const user = {
      id,
      ...data,
      created_at: now,
      updated_at: now
    };

    db.users.set(id, user);
    return user;
  }

  static async update(id: string, data: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...data,
      updated_at: new Date().toISOString()
    };

    db.users.set(id, updatedUser);
    return updatedUser;
  }
}