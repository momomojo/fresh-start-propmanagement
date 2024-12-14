import { propertyService as firebasePropertyService } from '../firebase/services/propertyService';
import type { Property } from '../../types';

export const propertyService = {
  async getProperties(): Promise<Property[]> {
    return firebasePropertyService.getProperties();
  },

  async getProperty(id: string): Promise<Property | null> {
    return firebasePropertyService.getProperty(id);
  },

  async createProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    return firebasePropertyService.createProperty(data);
  },

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    return firebasePropertyService.updateProperty(id, data);
  },

  async deleteProperty(id: string): Promise<boolean> {
    return firebasePropertyService.deleteProperty(id);
  }
};