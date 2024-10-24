import { User } from '@/entities/user.entity';

export type CreateMessageParams = {
  content: string;
  conversationId: string;
  user: User;
};
