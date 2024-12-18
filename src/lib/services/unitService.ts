import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { unitService as firebaseService } from '../firebase/services/unitService';
import type { PropertyUnit } from '../../types';
import { handleFirebaseError } from './errorHandling';
import { retryOperation } from './networkUtils';

class UnitService {
  async getUnits(): Promise<PropertyUnit[]> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated');
      }
      
      const userDoc = await retryOperation(() => 
        getDoc(doc(db, 'users', user.uid))
      );
      
      const userData = userDoc.data();

      if (!userData) {
        throw new Error('User profile not found');
      }

      let q = query(collection(db, 'units'));
      
      if (userData.role === 'property_manager') {
        const propertyQuery = query(
          collection(db, 'properties'),
          where('manager_id', '==', user.uid)
        );
        const propertySnap = await retryOperation(() => getDocs(propertyQuery));
        const propertyIds = propertySnap.docs.map(doc => doc.id);
        
        // Handle empty propertyIds array
        if (propertyIds.length === 0) {
          return [];
        }
        
        // Firebase doesn't support empty 'in' arrays, so we handle each property separately
        const unitSnapshots = await Promise.all(
          propertyIds.map(propertyId =>
            getDocs(query(
              collection(db, 'units'),
              where('property_id', '==', propertyId)
            ))
          )
        );
        
        return unitSnapshots.flatMap(snapshot =>
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        ) as PropertyUnit[];
      } else if (userData.role === 'tenant') {
        const leaseQuery = query(
          collection(db, 'leases'),
          where('tenant_id', '==', user.uid)
        );
        const leaseSnap = await retryOperation(() => getDocs(leaseQuery));
        const unitIds = leaseSnap.docs.map(doc => doc.data().unit_id);
        
        // Handle empty unitIds array
        if (unitIds.length === 0) {
          return [];
        }
        
        // Firebase doesn't support empty 'in' arrays, so we handle each unit separately
        const unitSnapshots = await Promise.all(
          unitIds.map(unitId =>
            getDoc(doc(db, 'units', unitId))
          )
        );
        
        return unitSnapshots
          .filter(doc => doc.exists())
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as PropertyUnit[];
      }

      const snapshot = await retryOperation(() => getDocs(q));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PropertyUnit[];
    } catch (error) {
      const appError = handleFirebaseError(error);
      if (import.meta.env.DEV) {
        console.error('Error fetching units:', appError);
      }
      throw appError;
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