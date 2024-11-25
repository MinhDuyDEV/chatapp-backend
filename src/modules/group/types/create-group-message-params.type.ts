import { User } from '@/entities/user.entity';
import { AttachmentDto } from '@/modules/message/dto/create-message.dto';

export type CreateGroupMessageParams = {
  author: User;
  attachments?: AttachmentDto[];
  content: string;
  groupId: string;
};
