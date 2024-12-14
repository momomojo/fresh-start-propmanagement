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
import type { Tenant } from '../../../types';

export const tenantService = {
  // Get all tenants
  async getTenants() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.TENANTS));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tenant[];
    } catch (error) {
      console.error('Error fetching tenants:', error);
      throw error;
    }
  },

  // Get a single tenant by ID
  async getTenant(id: string) {
    try {
      const docRef = doc(db, COLLECTIONS.TENANTS, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Tenant;
      }
      return null;
    } catch (error) {
      console.error('Error fetching tenant:', error);
      throw error;
    }
  },

  // Create a new tenant
  async createTenant(data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.TENANTS), {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      return {
        id: docRef.id,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Tenant;
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  },

  // Update an existing tenant
  async updateTenant(id: string, data: Partial<Tenant>) {
    try {
      const docRef = doc(db, COLLECTIONS.TENANTS, id);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString()
      });
      
      return {
        id,
        ...data,
        updated_at: new Date().toISOString()
      } as Tenant;
    } catch (error) {
      console.error('Error updating tenant:', error);
      throw error;
    }
  },

  // Delete a tenant
  async deleteTenant(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.TENANTS, id));
      return true;
    } catch (error) {
      console.error('Error deleting tenant:', error);
      throw error;
    }
  },

  // Subscribe to real-time updates
  subscribeToTenants(callback: (tenants: Tenant[]) => void) {
    return onSnapshot(
      collection(db, COLLECTIONS.TENANTS),
      (snapshot) => {
        const tenants = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tenant[];
        callback(tenants);
      },
      (error) => {
        console.error('Error in tenant subscription:', error);
      }
    );
  }
};