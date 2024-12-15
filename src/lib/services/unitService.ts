import { unitService as firebaseUnitService } from '../firebase/services/unitService';
import type { PropertyUnit } from '../../types';

export const unitService = {
  async getUnits(): Promise<PropertyUnit[]> {
    return firebaseUnitService.getUnits();
  },

  async getPropertyUnits(propertyId: string): Promise<PropertyUnit[]> {
    return firebaseUnitService.getPropertyUnits(propertyId);
  },

  async getUnit(id: string): Promise<PropertyUnit | null> {
    return firebaseUnitService.getUnit(id);
  },

  async createUnit(data: Omit<PropertyUnit, 'id' | 'created_at' | 'updated_at'>): Promise<PropertyUnit> {
    return firebaseUnitService.createUnit(data);
  },

  async updateUnit(id: string, data: Partial<PropertyUnit>): Promise<PropertyUnit> {
    return firebaseUnitService.updateUnit(id, data);
  },

  async deleteUnit(id: string): Promise<boolean> {
    return firebaseUnitService.deleteUnit(id);
  },

  async createUnitsForProperty(propertyId: string, numberOfUnits: number): Promise<boolean> {
    return firebaseUnitService.createUnitsForProperty(propertyId, numberOfUnits);
  }
};
