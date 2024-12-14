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
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { db } from '../config';
import { COLLECTIONS } from '../collections';
import type { MaintenanceRequest } from '../../../types';

export const maintenanceService = {
  // Get all maintenance requests
  async getRequests() {
    try {
      const q = query(
        collection(db, COLLECTIONS.MAINTENANCE),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MaintenanceRequest[];
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      throw error;
    }
  },

  // Get requests for a specific property
  async getPropertyRequests(propertyId: string) {
    try {
      const q = query(
        collection(db, COLLECTIONS.MAINTENANCE),
        where('property_id', '==', propertyId),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MaintenanceRequest[];
    } catch (error) {
      console.error('Error fetching property maintenance requests:', error);
      throw error;
    }
  },

  // Get requests for a specific tenant
  async getTenantRequests(tenantId: string) {
    try {
      const q = query(
        collection(db, COLLECTIONS.MAINTENANCE),
        where('tenant_id', '==', tenantId),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MaintenanceRequest[];
    } catch (error) {
      console.error('Error fetching tenant maintenance requests:', error);
      throw error;
    }
  },

  // Create a new maintenance request
  async createRequest(data: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.MAINTENANCE), {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      return {
        id: docRef.id,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as MaintenanceRequest;
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      throw error;
    }
  },

  // Update a maintenance request
  async updateRequest(id: string, data: Partial<MaintenanceRequest>) {
    try {
      const docRef = doc(db, COLLECTIONS.MAINTENANCE, id);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString()
      });
      
      const updatedDoc = await getDoc(docRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as MaintenanceRequest;
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      throw error;
    }
  },

  // Delete a maintenance request
  async deleteRequest(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.MAINTENANCE, id));
      return true;
    } catch (error) {
      console.error('Error deleting maintenance request:', error);
      throw error;
    }
  },

  // Subscribe to real-time updates for all maintenance requests
  subscribeToRequests(callback: (requests: MaintenanceRequest[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.MAINTENANCE),
      orderBy('created_at', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MaintenanceRequest[];
      callback(requests);
    }, (error) => {
      console.error('Error in maintenance request subscription:', error);
    });
  },

  // Subscribe to real-time updates for a specific property's requests
  subscribeToPropertyRequests(propertyId: string, callback: (requests: MaintenanceRequest[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.MAINTENANCE),
      where('property_id', '==', propertyId),
      orderBy('created_at', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MaintenanceRequest[];
      callback(requests);
    }, (error) => {
      console.error('Error in property maintenance request subscription:', error);
    });
  }
};