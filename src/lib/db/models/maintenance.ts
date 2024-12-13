import { z } from 'zod';
import { BaseModel } from './base';
import type { MaintenanceRequest } from '../../../types';

export const maintenanceSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  property_id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'emergency']),
  status: z.enum(['pending', 'in_progress', 'completed']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export class MaintenanceModel extends BaseModel {
  protected static tableName = 'maintenance_requests';

  static async findAll(): Promise<MaintenanceRequest[]> {
    const result = await MaintenanceModel.execute(
      'SELECT * FROM maintenance_requests ORDER BY created_at DESC'
    );
    return result.rows as MaintenanceRequest[];
  }

  static async findById(id: string): Promise<MaintenanceRequest | null> {
    const result = await MaintenanceModel.execute(
      'SELECT * FROM maintenance_requests WHERE id = ?',
      [id]
    );
    return result.rows[0] as MaintenanceRequest || null;
  }

  static async findByProperty(propertyId: string): Promise<MaintenanceRequest[]> {
    const result = await MaintenanceModel.execute(
      'SELECT * FROM maintenance_requests WHERE property_id = ? ORDER BY created_at DESC',
      [propertyId]
    );
    return result.rows as MaintenanceRequest[];
  }

  static async create(data: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at'>): Promise<MaintenanceRequest> {
    const result = await MaintenanceModel.execute(
      `INSERT INTO maintenance_requests (tenant_id, property_id, title, 
       description, priority, status)
       VALUES (?, ?, ?, ?, ?, ?)
       RETURNING *`,
      [
        data.tenant_id,
        data.property_id,
        data.title,
        data.description,
        data.priority,
        data.status
      ]
    );
    return result.rows[0] as MaintenanceRequest;
  }

  static async update(id: string, data: Partial<MaintenanceRequest>): Promise<MaintenanceRequest | null> {
    const { sets, values } = MaintenanceModel.buildUpdateQuery(data);
    if (values.length === 0) return null;

    values.push(id);
    const result = await MaintenanceModel.execute(
      `UPDATE maintenance_requests SET ${sets.join(', ')} WHERE id = ? RETURNING *`,
      values
    );
    return result.rows[0] as MaintenanceRequest || null;
  }
}
