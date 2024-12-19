import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { store } from '../store';
import { setProperties } from '../store/slices/propertySlice';
import { setTenants } from '../store/slices/tenantSlice';
import { setUnits } from '../store/slices/unitSlice';
import { COLLECTIONS } from '../firebase/collections';
import type { Property, PropertyUnit, Tenant } from '@/types';

class SyncService {
  private unsubscribers: (() => void)[] = [];

  startSync(userId: string) {
    // Sync properties
    const propertiesUnsubscribe = onSnapshot(
      query(collection(db, COLLECTIONS.PROPERTIES)),
      (snapshot) => {
        const properties = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Property[];
        store.dispatch(setProperties(properties));
      }
    );

    // Sync units
    const unitsUnsubscribe = onSnapshot(
      query(collection(db, COLLECTIONS.UNITS)),
      (snapshot) => {
        const units = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PropertyUnit[];
        store.dispatch(setUnits(units));
      }
    );

    // Sync tenants
    const tenantsUnsubscribe = onSnapshot(
      query(collection(db, COLLECTIONS.TENANTS)),
      (snapshot) => {
        const tenants = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tenant[];
        store.dispatch(setTenants(tenants));
      }
    );

    this.unsubscribers.push(
      propertiesUnsubscribe,
      unitsUnsubscribe,
      tenantsUnsubscribe
    );
  }

  stopSync() {
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
    this.unsubscribers = [];
  }
}

export const syncService = new SyncService();