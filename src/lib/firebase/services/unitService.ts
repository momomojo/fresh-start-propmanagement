import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
  DocumentReference,
  limit,
  startAfter
} from 'firebase/firestore';
import { db } from '../config';
import { COLLECTIONS } from '../collections';
import type { PropertyUnit } from '../../../types';

export const unitService = {
  // Get all units with pagination
  async getUnits(pageSize = 10, startAfterId?: string) {
    try {
      let q = query(
        collection(db, COLLECTIONS.UNITS),
        orderBy('created_at', 'desc'),
        limit(pageSize)
      );

      if (startAfterId) {
        const lastDoc = await getDoc(doc(db, COLLECTIONS.UNITS, startAfterId));
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PropertyUnit[];
    } catch (error) {
      console.error('Error fetching units:', error);
      throw new Error('Failed to fetch units');
    }
  },

  // Get units for a specific property with filtering
  async getPropertyUnits(propertyId: string, filters?: { status?: PropertyUnit['status'] }) {
    try {
      let q = query(
        collection(db, COLLECTIONS.UNITS),
        where('property_id', '==', propertyId),
        orderBy('unit_number', 'asc')
      );

      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PropertyUnit[];
    } catch (error) {
      console.error('Error fetching property units:', error);
      throw new Error('Failed to fetch property units');
    }
  },

  // Get a specific unit with error handling
  async getUnit(id: string) {
    try {
      const docRef = doc(db, COLLECTIONS.UNITS, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as PropertyUnit;
    } catch (error) {
      console.error('Error fetching unit:', error);
      throw new Error('Failed to fetch unit');
    }
  },

  // Create a new unit with validation
  async createUnit(data: Omit<PropertyUnit, 'id' | 'created_at' | 'updated_at'>) {
    try {
      if (!data.property_id || !data.unit_number) {
        throw new Error('Missing required fields');
      }

      const timestamp = new Date().toISOString();
      const docRef = await addDoc(collection(db, COLLECTIONS.UNITS), {
        ...data,
        created_at: timestamp,
        updated_at: timestamp
      });
      
      return {
        id: docRef.id,
        ...data,
        created_at: timestamp,
        updated_at: timestamp
      } as PropertyUnit;
    } catch (error) {
      console.error('Error creating unit:', error);
      throw new Error('Failed to create unit');
    }
  },

  // Update a unit with optimistic updates
  async updateUnit(id: string, data: Partial<PropertyUnit>) {
    try {
      const docRef = doc(db, COLLECTIONS.UNITS, id);
      const timestamp = new Date().toISOString();
      
      await updateDoc(docRef, {
        ...data,
        updated_at: timestamp
      });
      
      const updatedDoc = await getDoc(docRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as PropertyUnit;
    } catch (error) {
      console.error('Error updating unit:', error);
      throw new Error('Failed to update unit');
    }
  },

  // Delete a unit with cascade protection
  async deleteUnit(id: string) {
    try {
      const unitDoc = await getDoc(doc(db, COLLECTIONS.UNITS, id));
      if (!unitDoc.exists()) {
        throw new Error('Unit not found');
      }
      
      const unitData = unitDoc.data() as PropertyUnit;
      if (unitData.status === 'occupied') {
        throw new Error('Cannot delete occupied unit');
      }

      await deleteDoc(doc(db, COLLECTIONS.UNITS, id));
      return true;
    } catch (error) {
      console.error('Error deleting unit:', error);
      throw error;
    }
  },

  // Batch create units with validation
  async createUnitsForProperty(propertyId: string, numberOfUnits: number, baseUnitNumber?: string) {
    try {
      if (numberOfUnits <= 0 || numberOfUnits > 100) {
        throw new Error('Invalid number of units (1-100)');
      }

      const batch = writeBatch(db);
      const timestamp = new Date().toISOString();

      for (let i = 0; i < numberOfUnits; i++) {
        const unitNumber = baseUnitNumber 
          ? `${baseUnitNumber}-${i + 1}` 
          : `${i + 1}`;

        const unitRef = doc(collection(db, COLLECTIONS.UNITS));
        batch.set(unitRef, {
          property_id: propertyId,
          unit_number: unitNumber,
          status: 'available',
          floor_plan: null,
          created_at: timestamp,
          updated_at: timestamp
        });
      }

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error creating units for property:', error);
      throw new Error('Failed to create units');
    }
  },

  // Batch update units status
  async updateUnitsStatus(unitIds: string[], status: PropertyUnit['status']) {
    try {
      const batch = writeBatch(db);
      const timestamp = new Date().toISOString();

      unitIds.forEach(id => {
        const unitRef = doc(db, COLLECTIONS.UNITS, id);
        batch.update(unitRef, { 
          status, 
          updated_at: timestamp 
        });
      });

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error updating units status:', error);
      throw new Error('Failed to update units status');
    }
  }
};
