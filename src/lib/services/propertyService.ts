import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import type { Property } from '../../types';

class PropertyService {
  async getProperties(): Promise<Property[]> {
    try {
      const user = auth.currentUser;
      const userDoc = await getDoc(doc(db, 'users', user?.uid || ''));
      const userData = userDoc.data();

      if (!user || !userData) {
        throw new Error('User must be authenticated');
      }

      const propertiesRef = collection(db, 'properties');
      let q = query(propertiesRef);
      
      if (userData?.role === 'property_manager') {
        q = query(propertiesRef, where('manager_id', '==', user.uid));
      } else if (userData?.role === 'tenant') {
        // For tenants, fetch only properties they're associated with
        const leaseRef = collection(db, 'leases');
        const leaseQuery = query(leaseRef, where('tenant_id', '==', user.uid));
        const leaseSnap = await getDocs(leaseQuery);
        const propertyIds = leaseSnap.docs.map(doc => doc.data().property_id);
        q = query(propertiesRef, where('id', 'in', propertyIds));
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
    try {
      const docRef = doc(db, 'properties', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as Property;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  }

  async getPropertyByUnitId(unitId: string): Promise<Property | null> {
    try {
      const unitRef = doc(db, 'units', unitId);
      const unitSnap = await getDoc(unitRef);
      if (!unitSnap.exists()) return null;
      
      const propertyId = unitSnap.data().property_id;
      if (!propertyId) return null;
      
      return this.getProperty(propertyId);
    } catch (error) {
      console.error('Error getting property by unit ID:', error);
      throw error;
    }
  }

  async createProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    try {
      const timestamp = new Date().toISOString();
      const docRef = await addDoc(collection(db, 'properties'), {
        ...data,
        created_at: timestamp,
        updated_at: timestamp
      });
      
      return {
        id: docRef.id,
        ...data,
        created_at: timestamp,
        updated_at: timestamp
      };
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    try {
      const timestamp = new Date().toISOString();
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, {
        ...data,
        updated_at: timestamp
      });
      
      const updatedDoc = await getDoc(docRef);
      if (!updatedDoc.exists()) {
        throw new Error('Property not found');
      }
      
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as Property;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  async deleteProperty(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'properties', id));
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      return false;
    }
  }
}

export const propertyService = new PropertyService();