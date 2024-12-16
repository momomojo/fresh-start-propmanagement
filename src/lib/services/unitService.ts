import { unitService as firebaseService } from '../firebase/services/unitService';
import type { PropertyUnit } from '../../types';

class UnitService {
  async getUnits(): Promise<PropertyUnit[]> {
    return firebaseService.getUnits();
  }

  async getUnit(id: string): Promise<PropertyUnit | null> {
    return firebaseService.getUnit(id);
  }

  async getPropertyUnits(propertyId: string): Promise<PropertyUnit[]> {
    return firebaseService.getUnitsByPropertyId(propertyId);
  }

  async createUnit(data: Omit<PropertyUnit, 'id' | 'created_at' | 'updated_at'>): Promise<PropertyUnit> {
    return firebaseService.createUnit(data);
  }

  async updateUnit(id: string, data: Partial<PropertyUnit>): Promise<PropertyUnit | null> {
    return firebaseService.updateUnit(id, data);
  }

  async deleteUnit(id: string): Promise<void> {
    await firebaseService.deleteUnit(id);
  }

  async createUnitsForProperty(propertyId: string, count: number): Promise<PropertyUnit[]> {
    const units: PropertyUnit[] = [];
    for (let i = 0; i < count; i++) {
      const unitNumber = `${i + 1}`.padStart(3, '0');
      const unit = await this.createUnit({
        property_id: propertyId,
        unit_number: unitNumber,
        floor_plan: null,
        status: 'available'
      });
      units.push(unit);
    }
    return units;
  }
}

export const unitService = new UnitService();
