import { User } from '@/entities/user.entity';

export type AuthResponse = {
  user: Omit<User, 'password' | 'refreshToken' | 'messages'>;
};
