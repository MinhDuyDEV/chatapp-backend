import { Message } from '@/entities/message.entity';

export type UpdateConversationParams = Partial<{
  id: string;
  lastMessageSent: Message;
}>;
