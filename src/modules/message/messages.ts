import { CreateMessageParams } from '@/modules/message/types/create-message-params.type';
import { User } from '@/entities/user.entity';
import { Message } from '@/entities/message.entity';
import { DeleteMessageParam } from '@/modules/message/types/delete-message-param.type';
import { Conversation } from '@/entities/conversation.entity';
import { EditMessageParams } from '@/modules/message/types/edit-message-params.type';

export interface IMessageService {
  createMessage({
    content,
    conversationId,
    user,
    attachments,
  }: CreateMessageParams): Promise<any>;
  createLastMessage(
    conversationId: string,
    message: string,
    user: User,
  ): Promise<any>;
  getMessages(user: User, conversationId: string): Promise<Message[]>;
  deleteMessage(param: DeleteMessageParam): Promise<any>;
  deleteLastMessage(conversation: Conversation, message: Message): Promise<any>;
  editMessage(params: EditMessageParams): Promise<Message>;
}
