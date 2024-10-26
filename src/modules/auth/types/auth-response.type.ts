import { User } from '@/entities/user.entity';

export type AuthResponse = {
  user: Pick<User, 'id' | 'email' | 'username' | 'avatar'>;
};
