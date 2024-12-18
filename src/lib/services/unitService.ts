import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { unitService as firebaseService } from '../firebase/services/unitService';
import type { PropertyUnit } from '../../types';

class UnitService {
  async getUnits(): Promise<PropertyUnit[]> {
    try {
      const user = auth.currentUser;
      const userDoc = await getDoc(doc(db, 'users', user?.uid || ''));
      const userData = userDoc.data();

      if (!user || !userData) {
        throw new Error('User must be authenticated');
      }

      let q = query(collection(db, 'units'));
      
      if (userData.role === 'property_manager') {
        // Get properties managed by this user
        const propertyQuery = query(
          collection(db, 'properties'),
          where('manager_id', '==', user.uid)
        );
        const propertySnap = await getDocs(propertyQuery);
        const propertyIds = propertySnap.docs.map(doc => doc.id);
        
        q = query(collection(db, 'units'), where('property_id', 'in', propertyIds));
      } else if (userData.role === 'tenant') {
        // Get units associated with tenant's leases
        const leaseQuery = query(
          collection(db, 'leases'),
          where('tenant_id', '==', user.uid)
        );
        const leaseSnap = await getDocs(leaseQuery);
        const unitIds = leaseSnap.docs.map(doc => doc.data().unit_id);
        
        q = query(collection(db, 'units'), where('id', 'in', unitIds));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PropertyUnit[];
    } catch (error) {
      console.error('Error fetching units:', error);
      throw error;
    }
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