import { UserModel } from '../db/models/user';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import type { User } from '../../types';

export const authService = {
  async login(email: string, password: string) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = await generateToken(user);
    return { user, token };
  },

  async register(data: { email: string; password: string; name: string; role: User['role'] }) {
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const password_hash = await hashPassword(data.password);
    const user = await UserModel.create({
      ...data,
      password_hash
    });

    const token = await generateToken(user);
    return { user, token };
  }
};