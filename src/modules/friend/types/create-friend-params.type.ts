import { User } from '@/entities/user.entity';

export type CreateFriendParams = {
  user: User;
  username: string;
};
