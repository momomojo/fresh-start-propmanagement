import { sign, verify } from '@tsndr/cloudflare-worker-jwt';
import type { User } from '../../types';

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export async function generateToken(user: User): Promise<string> {
  return await sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export async function verifyToken(token: string) {
  try {
    const isValid = await verify(token, JWT_SECRET);
    if (!isValid) {
      throw new Error('Invalid token');
    }
    return true;
  } catch (error) {
    throw new Error('Invalid token');
  }
}