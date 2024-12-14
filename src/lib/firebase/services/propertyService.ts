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
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config';
import { COLLECTIONS } from '../collections';
import type { Property } from '../../../types';

export const propertyService = {
  // Get all properties
  async getProperties() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.PROPERTIES));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  // Get a single property by ID
  async getProperty(id: string) {
    try {
      const docRef = doc(db, COLLECTIONS.PROPERTIES, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Property;
      }
      return null;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  },

  // Create a new property
  async createProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PROPERTIES), {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      return {
        id: docRef.id,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Property;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  // Update an existing property
  async updateProperty(id: string, data: Partial<Property>) {
    try {
      const docRef = doc(db, COLLECTIONS.PROPERTIES, id);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString()
      });
      
      return {
        id,
        ...data,
        updated_at: new Date().toISOString()
      } as Property;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  // Delete a property
  async deleteProperty(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PROPERTIES, id));
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  },

  // Subscribe to real-time updates
  subscribeToProperties(callback: (properties: Property[]) => void) {
    return onSnapshot(
      collection(db, COLLECTIONS.PROPERTIES),
      (snapshot) => {
        const properties = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Property[];
        callback(properties);
      },
      (error) => {
        console.error('Error in property subscription:', error);
      }
    );
  }
};