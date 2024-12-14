import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS } from '../firebase/collections';
import type { Property } from '../../types';
import { FirebaseError } from 'firebase/app';

const handleFirebaseError = (error: unknown): never => {
  if (error instanceof FirebaseError) {
    throw new Error(`Firebase error (${error.code}): ${error.message}`);
  }
  throw error;
};

export const propertyService = {
  async getProperties(): Promise<Property[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.PROPERTIES),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
    } catch (error) {
      console.error('Error fetching properties:', error);
      handleFirebaseError(error);
    }
  },

  async getProperty(id: string): Promise<Property | null> {
    try {
      const docRef = doc(db, COLLECTIONS.PROPERTIES, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Property;
      }
      return null;
    } catch (error) {
      console.error('Error fetching property:', error);
      handleFirebaseError(error);
    }
  },

  async createProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
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
      handleFirebaseError(error);
    }
  },

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
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
      
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as Property;
    } catch (error) {
      console.error('Error updating property:', error);
      handleFirebaseError(error);
    }
  },

  async deleteProperty(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PROPERTIES, id));
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      handleFirebaseError(error);
    }
  },

  subscribeToProperties(callback: (properties: Property[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.PROPERTIES),
      orderBy('created_at', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const properties = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
      callback(properties);
    }, (error) => {
      console.error('Error in property subscription:', error);
      handleFirebaseError(error);
    });
  }
};