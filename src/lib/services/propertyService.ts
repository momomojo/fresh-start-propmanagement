import { propertyService as firebaseService } from '../firebase/services/propertyService';
import type { Property } from '../../types';

class PropertyService {
  async getProperties(): Promise<Property[]> {
    return firebaseService.getProperties();
  }

  async getProperty(id: string): Promise<Property | null> {
    return firebaseService.getProperty(id);
  }

  async getPropertyByUnitId(unitId: string): Promise<Property | null> {
    return firebaseService.getPropertyByUnitId(unitId);
  }

  async createProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    return firebaseService.createProperty(data);
  }

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    const result = await firebaseService.updateProperty(id, data);
    if (!result) {
      throw new Error('Property not found');
    }
    return result;
  }

  async deleteProperty(id: string): Promise<boolean> {
    try {
      await firebaseService.deleteProperty(id);
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      return false;
    }
  }
}

export const propertyService = new PropertyService();
