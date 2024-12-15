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
import type { Property } from '../../../types';

class PropertyService {
  async getProperties(): Promise<Property[]> {
    const propertiesRef = collection(db, COLLECTIONS.PROPERTIES);
    const snapshot = await getDocs(propertiesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Property));
  }

  async getProperty(id: string): Promise<Property | null> {
    const propertyRef = doc(db, COLLECTIONS.PROPERTIES, id);
    const snapshot = await getDoc(propertyRef);
    if (!snapshot.exists()) return null;
    return {
      id: snapshot.id,
      ...snapshot.data()
    } as Property;
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
