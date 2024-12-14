import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../config';
import { COLLECTIONS } from '../collections';
import type { Property } from '../../../types';

export const propertyService = {
  // Get all properties
  async getProperties() {
    try {
      const q = query(
        collection(db, COLLECTIONS.PROPERTIES),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const properties = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          address: data.address,
          type: data.type,
          units: data.units,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as Property;
      });
      return properties;
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
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name,
          address: data.address,
          type: data.type,
          units: data.units,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as Property;
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
      const timestamp = new Date().toISOString();
      const docRef = await addDoc(collection(db, COLLECTIONS.PROPERTIES), {
        ...data,
        created_at: timestamp,
        updated_at: timestamp
      });
      
      return {
        id: docRef.id,
        ...data,
        created_at: timestamp,
        updated_at: timestamp
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
      const timestamp = new Date().toISOString();
      await updateDoc(docRef, {
        ...data,
        updated_at: timestamp
      });
      
      const updatedDoc = await getDoc(docRef);
      if (!updatedDoc.exists()) {
        throw new Error('Property not found after update');
      }
      
      const updatedData = updatedDoc.data();
      return {
        id: updatedDoc.id,
        name: updatedData.name,
        address: updatedData.address,
        type: updatedData.type,
        units: updatedData.units,
        status: updatedData.status,
        created_at: updatedData.created_at,
        updated_at: updatedData.updated_at
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
      query(
        collection(db, COLLECTIONS.PROPERTIES),
        orderBy('created_at', 'desc')
      ),
      (snapshot) => {
        const properties = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Property[];
        callback(properties);
      }, (error) => {
        console.error('Error in property subscription:', error);
        throw error;
      }
    );
  }
};