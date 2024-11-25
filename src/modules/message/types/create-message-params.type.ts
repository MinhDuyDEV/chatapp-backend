import { User } from '@/entities/user.entity';
import { AttachmentDto } from '@/modules/message/dto/create-message.dto';

export type CreateMessageParams = {
  content: string;
  conversationId: string;
  user: User;
  attachments?: AttachmentDto[];
};
