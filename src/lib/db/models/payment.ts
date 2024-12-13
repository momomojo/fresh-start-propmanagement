import { z } from 'zod';
import { BaseModel } from './base';
import type { Payment } from '../../../types';

export const paymentSchema = z.object({
  id: z.string().uuid(),
  lease_id: z.string().uuid(),
  amount: z.number().positive(),
  type: z.enum(['rent', 'deposit', 'maintenance', 'other']),
  status: z.enum(['pending', 'completed', 'failed']),
  due_date: z.string(),
  paid_date: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export class PaymentModel extends BaseModel {
  protected static tableName = 'payments';

  static async findAll(): Promise<Payment[]> {
    const result = await PaymentModel.execute(
      'SELECT * FROM payments ORDER BY due_date DESC'
    );
    return result.rows as Payment[];
  }

  static async findById(id: string): Promise<Payment | null> {
    const result = await PaymentModel.execute(
      'SELECT * FROM payments WHERE id = ?',
      [id]
    );
    return result.rows[0] as Payment || null;
  }

  static async findByLease(leaseId: string): Promise<Payment[]> {
    const result = await PaymentModel.execute(
      'SELECT * FROM payments WHERE lease_id = ? ORDER BY due_date DESC',
      [leaseId]
    );
    return result.rows as Payment[];
  }

  static async create(data: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
    const result = await PaymentModel.execute(
      `INSERT INTO payments (lease_id, amount, type, status, due_date, paid_date)
       VALUES (?, ?, ?, ?, ?, ?)
       RETURNING *`,
      [
        data.lease_id,
        data.amount,
        data.type,
        data.status,
        data.due_date,
        data.paid_date
      ]
    );
    return result.rows[0] as Payment;
  }

  static async update(id: string, data: Partial<Payment>): Promise<Payment | null> {
    const { sets, values } = PaymentModel.buildUpdateQuery(data);
    if (values.length === 0) return null;

    values.push(id);
    const result = await PaymentModel.execute(
      `UPDATE payments SET ${sets.join(', ')} WHERE id = ? RETURNING *`,
      values
    );
    return result.rows[0] as Payment || null;
  }
}
