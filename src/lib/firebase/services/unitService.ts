import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../config';
import { COLLECTIONS } from '../collections';
import type { PropertyUnit } from '../../../types';

class UnitService {
  async getUnits(): Promise<PropertyUnit[]> {
    const unitsRef = collection(db, COLLECTIONS.UNITS);
    const snapshot = await getDocs(unitsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PropertyUnit));
  }

  async getUnit(id: string): Promise<PropertyUnit | null> {
    const unitRef = doc(db, COLLECTIONS.UNITS, id);
    const snapshot = await getDoc(unitRef);
    if (!snapshot.exists()) return null;
    return {
      id: snapshot.id,
      ...snapshot.data()
    } as PropertyUnit;
  }

  async getUnitsByPropertyId(propertyId: string): Promise<PropertyUnit[]> {
    const unitsRef = collection(db, COLLECTIONS.UNITS);
    const q = query(unitsRef, where('property_id', '==', propertyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PropertyUnit));
  }

  async createUnit(data: Omit<PropertyUnit, 'id' | 'created_at' | 'updated_at'>): Promise<PropertyUnit> {
    const unitsRef = collection(db, COLLECTIONS.UNITS);
    const docRef = await addDoc(unitsRef, {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    const newDoc = await getDoc(docRef);
    return {
      id: newDoc.id,
      ...newDoc.data()
    } as PropertyUnit;
  }

  async updateUnit(id: string, data: Partial<PropertyUnit>): Promise<PropertyUnit | null> {
    const unitRef = doc(db, COLLECTIONS.UNITS, id);
    await updateDoc(unitRef, {
      ...data,
      updated_at: serverTimestamp()
    });

    const updatedDoc = await getDoc(unitRef);
    if (!updatedDoc.exists()) return null;
    
    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    } as PropertyUnit;
  }

  async deleteUnit(id: string): Promise<void> {
    const unitRef = doc(db, COLLECTIONS.UNITS, id);
    await deleteDoc(unitRef);
  }
}

export const unitService = new UnitService();
