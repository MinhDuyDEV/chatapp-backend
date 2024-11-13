import { Attachment } from '@/modules/group/types/update-group-details-params.type';
import { User } from '@/entities/user.entity';

export type CreateGroupMessageParams = {
  author: User;
  attachments?: Attachment[];
  content: string;
  groupId: string;
};
