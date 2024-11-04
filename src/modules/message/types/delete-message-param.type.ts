import { User } from '@/entities/user.entity';

export type DeleteMessageParam = {
  user: User;
  messageId: string;
  conversationId: string;
};
