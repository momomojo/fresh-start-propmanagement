import { PropertyModel } from '../db/models/property';
import type { Property } from '../../types';

export const propertyService = {
  async getProperties(): Promise<Property[]> {
    return PropertyModel.findAll();
  },

  async getProperty(id: string): Promise<Property | null> {
    return PropertyModel.findById(id);
  },

  async createProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    return PropertyModel.create(data);
  },

  async updateProperty(id: string, data: Partial<Property>): Promise<Property | null> {
    return PropertyModel.update(id, data);
  },

  async deleteProperty(id: string): Promise<boolean> {
    return PropertyModel.delete(id);
  }
};