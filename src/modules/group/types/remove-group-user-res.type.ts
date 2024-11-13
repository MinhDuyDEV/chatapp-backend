import { Group } from '@/entities/group.entity';
import { User } from '@/entities/user.entity';

export type RemoveGroupUserResponse = {
  group: Group;
  user: User;
};
