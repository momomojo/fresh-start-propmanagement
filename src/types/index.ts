// User Types
export type UserRole = 'admin' | 'property_manager' | 'tenant';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Property Types
export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'commercial';
  units: number;
  status: 'available' | 'occupied' | 'maintenance';
  created_at: string;
  updated_at: string;
}

// Lease Types
export interface Lease {
  id: string;
  unit_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  deposit_amount: number;
  status: 'active' | 'pending' | 'past';
  created_at: string;
  updated_at: string;
}

// Maintenance Types
export interface MaintenanceRequest {
  id: string;
  tenant_id: string;
  property_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

// Payment Types
export interface Payment {
  id: string;
  lease_id: string;
  type: 'rent' | 'deposit' | 'maintenance' | 'other';
  amount: number;
  status: 'pending' | 'completed' | 'failed';