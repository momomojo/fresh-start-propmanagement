import { z } from 'zod';
import { BaseModel } from './base';
import type { Lease } from '../../../types';

export const leaseSchema = z.object({
  id: z.string().uuid(),
  unit_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  start_date: z.string(),
  end_date: z.string(),
  rent_amount: z.number().positive(),
  deposit_amount: z.number().positive(),
  status: z.enum(['active', 'pending', 'ended']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export class LeaseModel extends BaseModel {
  protected static tableName = 'leases';

  static async findAll(): Promise<Lease[]> {
    const result = await LeaseModel.execute(
      'SELECT * FROM leases ORDER BY created_at DESC'
    );
    return result.rows as Lease[];
  }

  static async findById(id: string): Promise<Lease | null> {
    const result = await LeaseModel.execute(
      'SELECT * FROM leases WHERE id = ?',
      [id]
    );
    return result.rows[0] as Lease || null;
  }

  static async findByTenant(tenantId: string): Promise<Lease[]> {
    const result = await LeaseModel.execute(
      'SELECT * FROM leases WHERE tenant_id = ? ORDER BY created_at DESC',
      [tenantId]
    );
    return result.rows as Lease[];
  }

  static async create(data: Omit<Lease, 'id' | 'created_at' | 'updated_at'>): Promise<Lease> {
    const result = await LeaseModel.execute(
      `INSERT INTO leases (unit_id, tenant_id, start_date, end_date, 
       rent_amount, deposit_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       RETURNING *`,
      [
        data.unit_id,
        data.tenant_id,
        data.start_date,
        data.end_date,
        data.rent_amount,
        data.deposit_amount,
        data.status
      ]
    );
    return result.rows[0] as Lease;
  }

  static async update(id: string, data: Partial<Lease>): Promise<Lease | null> {
    const { sets, values } = LeaseModel.buildUpdateQuery(data);
    if (values.length === 0) return null;

    values.push(id);
    const result = await LeaseModel.execute(
      `UPDATE leases SET ${sets.join(', ')} WHERE id = ? RETURNING *`,
      values
    );
    return result.rows[0] as Lease || null;
  }
}
