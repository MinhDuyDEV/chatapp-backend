import { Conversation } from '@/entities/conversation.entity';
import { User } from '@/entities/user.entity';
import { CreateConversationParams } from '@/modules/conversation/types/create-conversation-params';
import { Message } from '@/entities/message.entity';
import { UpdateConversationParams } from '@/modules/conversation/types/update-conversation-params';

export interface IConversationsService {
  getConversations(id: string): Promise<Conversation[]>;
  findConversationById(id: string): Promise<Conversation>;
  createConversation(
    user: User,
    createConversationParams: CreateConversationParams,
  ): Promise<Conversation>;
  updateLastMessageSent(
    conversationId: string,
    message: Message,
  ): Promise<Conversation>;
  update({ id, lastMessageSent }: UpdateConversationParams): Promise<any>;
}
