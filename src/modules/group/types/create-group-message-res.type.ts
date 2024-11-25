import { GroupMessage } from '@/entities/group-message.entity';
import { Group } from '@/entities/group.entity';

export type CreateGroupMessageResponse = {
  messages: GroupMessage[];
  group: Group;
};
