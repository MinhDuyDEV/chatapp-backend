import { GroupMessage } from '@/entities/group-message.entity';
import { Group } from '@/entities/group.entity';

export type CreateGroupMessageResponse = {
  message: GroupMessage;
  group: Group;
};
