import { Group } from '@/entities/group.entity';
import { User } from '@/entities/user.entity';

export type AddGroupUserResponse = {
  group: Group;
  user: User;
};
