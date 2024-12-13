import db from '../index';
import { generateUUID } from '../../utils/uuid';
import type { Property } from '../../../types';

export class PropertyModel {
  static async findAll(): Promise<Property[]> {
    return Array.from(db.properties.values());
  }

  static async findById(id: string): Promise<Property | null> {
    return db.properties.get(id) || null;
  }

  static async create(data: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    const id = generateUUID();
    const now = new Date().toISOString();
    
    const property = {
      id,
      ...data,
      created_at: now,
      updated_at: now
    };

    db.properties.set(id, property);
    return property;
  }

  static async update(id: string, data: Partial<Property>): Promise<Property | null> {
    const property = await this.findById(id);
    if (!property) return null;

    const updatedProperty = {
      ...property,
      ...data,
      updated_at: new Date().toISOString()
    };

    db.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  static async delete(id: string): Promise<boolean> {
    return db.properties.delete(id);
  }
}