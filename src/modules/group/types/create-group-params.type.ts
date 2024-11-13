import { User } from '@/entities/user.entity';

export type CreateGroupParamsType = {
  creator: User;
  title?: string;
  users: string[];
};
