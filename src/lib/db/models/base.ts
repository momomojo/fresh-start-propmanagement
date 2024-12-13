import db from '../index';
import type { ResultSet } from '@libsql/client';
import { generateUUID } from '../../utils/uuid';

export abstract class BaseModel {
  protected static tableName: string;

  protected static generateId(): string {
    return generateUUID();
  }

  protected static async execute(sql: string, args?: any[]): Promise<ResultSet> {
    try {
      return await db.execute({ sql, args });
    } catch (error) {
      console.error(`Database error in ${this.tableName}:`, error);
      throw new Error(`Database operation failed: ${(error as Error).message}`);
    }
  }

  protected static buildUpdateQuery(data: Record<string, any>) {
    const sets: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        sets.push(`${key} = ?`);
        values.push(value);
      }
    });

    return { sets, values };
  }
}