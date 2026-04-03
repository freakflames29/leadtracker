import type { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * MOCKED AUTH SERVICE
 * Replace with actual Supabase client once project is setup.
 */

export const mockLogin = async (email: string, password: string):Promise<{ user: User, token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password.length >= 6) {
        resolve({
          user: {
            id: 'mock-user-id-' + uuidv4(),
            email: email,
            name: email.split('@')[0],
            createdAt: new Date().toISOString()
          },
          token: 'mock-jwt-token-' + Date.now()
        });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 800);
  });
};
