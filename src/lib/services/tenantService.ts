import type { Tenant } from '../../types';
import { generateUUID } from '../utils/uuid';

// Temporary in-memory store for development
const tenants: Tenant[] = [
  {
    id: generateUUID(),
    email: 'john.doe@example.com',
    password_hash: '',
    name: 'John Doe',
    role: 'tenant',
    status: 'active',
    balance: 0,
    lastPaymentDate: '2024-02-15',
    nextPaymentDue: '2024-03-15',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    documents: [],
    lease: {
      id: generateUUID(),
      unit_id: generateUUID(),
      tenant_id: generateUUID(),
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      rent_amount: 1200,
      deposit_amount: 1200,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
];

export const tenantService = {
  async getTenants(): Promise<Tenant[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...tenants];
  },

  async getTenant(id: string): Promise<Tenant | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return tenants.find(t => t.id === id) || null;
  },

  async createTenant(data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>): Promise<Tenant> {
    const newTenant: Tenant = {
      id: generateUUID(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    tenants.push(newTenant);
    return newTenant;
  },

  async updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant | null> {
    const index = tenants.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    tenants[index] = {
      ...tenants[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    return tenants[index];
  },

  async deleteTenant(id: string): Promise<boolean> {
    const index = tenants.findIndex(t => t.id === id);
    if (index === -1) return false;
    tenants.splice(index, 1);
    return true;
  }
};