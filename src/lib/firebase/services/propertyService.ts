import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config';
import { COLLECTIONS } from '../collections';
import { BaseFirestoreService } from './baseService';
import { auth } from '../config';
import type { Property } from '../../../types';

class PropertyService extends BaseFirestoreService {
  constructor() {
    super(COLLECTIONS.PROPERTIES);
  }

  async getProperties(): Promise<Property[]> {
    try {
      // Verify authentication
      await this.verifyAuth();

      // Get user profile to check role
      await this.verifyUserProfile();

      return await this.list<Property>();
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  private async getUserProfile(userId: string) {
    const userDoc = await this.get(userId);
    return userDoc;
  }

  async getProperty(id: string): Promise<Property | null> {
    try {
      await this.verifyAuth();

      return await this.get<Property>(id);
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  }

  async getPropertyByUnitId(unitId: string): Promise<Property | null> {
    try {
      // First get the unit to find its property_id
      const unitRef = doc(db, COLLECTIONS.UNITS, unitId);
      const unitSnap = await getDoc(unitRef);
      
      if (!unitSnap.exists()) return null;
      
      const propertyId = unitSnap.data().property_id;
      if (!propertyId) return null;

      // Then get the property using the property_id
      return this.getProperty(propertyId);
    } catch (error) {
      console.error('Error getting property by unit ID:', error);
      return null;
    }
  }

  async createProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    const propertiesRef = collection(db, COLLECTIONS.PROPERTIES);
    const docRef = await addDoc(propertiesRef, {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    const newDoc = await getDoc(docRef);
    return {
      id: newDoc.id,
      ...newDoc.data()
    } as Property;
  }

  async updateProperty(id: string, data: Partial<Property>): Promise<Property | null> {
    const propertyRef = doc(db, COLLECTIONS.PROPERTIES, id);
    await updateDoc(propertyRef, {
      ...data,
      updated_at: serverTimestamp()
    });

    const updatedDoc = await getDoc(propertyRef);
    if (!updatedDoc.exists()) return null;
    
    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    } as Property;
  }

  async deleteProperty(id: string): Promise<void> {
    const propertyRef = doc(db, COLLECTIONS.PROPERTIES, id);
    await deleteDoc(propertyRef);
  }
}

export const propertyService = new PropertyService();