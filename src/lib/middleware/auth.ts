import { verifyToken } from '../utils/jwt';
import { userModel } from '../db/models/user';
import type { User } from '../../types';

export async function authenticateUser(token: string): Promise<User> {
  await verifyToken(token);
  const payload = JSON.parse(atob(token.split('.')[1]));
  const user = await userModel.findById(payload.sub);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}

export function authorizeRoles(roles: string[]) {
  return (user: User) => {
    if (!roles.includes(user.role)) {
      throw new Error('Unauthorized');
    }
  };
}