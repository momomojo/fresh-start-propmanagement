export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'property_manager' | 'tenant';
  password_hash: string;
  provider?: 'password' | 'google';
  google_id?: string;
  google_access_token?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'commercial';
  units: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface PropertyUnit {
  id: string;
  property_id: string;
  unit_number: string;
  floor_plan: string;
  status: 'vacant' | 'occupied' | 'maintenance';
  rent_amount: number;
  square_feet: number;
  bedrooms: number;
  bathrooms: number;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit_id: string;
  lease_start: string;
  lease_end: string;
  rent_amount: number;
  security_deposit: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

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

export interface Payment {
  id: string;
  tenant_id: string;
  amount: number;
  type: 'rent' | 'deposit' | 'fee';
  status: 'pending' | 'completed' | 'failed';
  due_date: string;
  paid_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'lease' | 'invoice' | 'maintenance' | 'other';
  url: string;
  tenant_id?: string;
  property_id?: string;
  created_at: string;
  updated_at: string;
}
