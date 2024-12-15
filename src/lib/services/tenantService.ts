import type { Tenant } from '../../types';
import { tenantService as firebaseTenantService } from '../firebase/services/tenantService';

export const tenantService = {
  async getTenants(): Promise<Tenant[]> {
    return firebaseTenantService.getTenants();
  },

  async getTenant(id: string): Promise<Tenant | null> {
    return firebaseTenantService.getTenant(id);
  },

  async createTenant(data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>): Promise<Tenant> {
    return firebaseTenantService.createTenant(data);
  },

  async updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant | null> {
    return firebaseTenantService.updateTenant(id, data);
  },

  async deleteTenant(id: string): Promise<boolean> {
    return firebaseTenantService.deleteTenant(id);
  }
};
