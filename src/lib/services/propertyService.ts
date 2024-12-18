import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import type { Property } from '../../types';

class PropertyService {
  async getProperties(): Promise<Property[]> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const propertiesRef = collection(db, 'properties');
      let q = propertiesRef;

      // If user is a property manager, only fetch their properties
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (userData?.role === 'property_manager') {
        q = query(propertiesRef, where('manager_id', '==', user.uid));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  async getProperty(id: string): Promise<Property | null> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated');
    }

    return firebaseService.getProperty(id);
  }

  async getPropertyByUnitId(unitId: string): Promise<Property | null> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated');
    }

    return firebaseService.getPropertyByUnitId(unitId);
  }

  async createProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    return firebaseService.createProperty(data);
  }

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    const result = await firebaseService.updateProperty(id, data);
    if (!result) {
      throw new Error('Property not found');
    }
    return result;
  }

  async deleteProperty(id: string): Promise<boolean> {
    try {
      await firebaseService.deleteProperty(id);
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      return false;
    }
  }
}

export const propertyService = new PropertyService();