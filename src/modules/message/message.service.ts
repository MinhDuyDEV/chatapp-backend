import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Message } from '@/entities/message.entity';
import { ConversationService } from '@/modules/conversation/conversation.service';

import { CreateMessageParams } from './types/create-message-params.type';
import { User } from '@/entities/user.entity';
import { DeleteMessageParam } from '@/modules/message/types/delete-message-param.type';
import { Conversation } from '@/entities/conversation.entity';
import { EditMessageParams } from '@/modules/message/types/edit-message-params.type';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
  ) {}

  async createMessage({
    content,
    conversationId,
    user,
  }: CreateMessageParams): Promise<any> {
    const existedConversation =
      await this.conversationService.findConversationById(conversationId);
    if (!existedConversation)
      throw new ConflictException('Conversation not found');

    const { creator, recipient } = existedConversation;
    if (creator.id !== user.id && recipient.id !== user.id)
      throw new ForbiddenException('Cannot Create Message');

    const newMessage = this.messageRepository.create({
      content,
      conversation: existedConversation,
      author: user,
    });
    const savedMessage = await this.messageRepository.save(newMessage);
    const savedConversation =
      await this.conversationService.updateLastMessageSent(
        conversationId,
        savedMessage,
      );
    return { message: savedMessage, conversation: savedConversation };
  }

  async createLastMessage(
    conversationId: string,
    message: string,
    user: User,
  ): Promise<any> {
    const lastMessage = this.messageRepository.create({
      content: message,
      conversation: { id: conversationId },
      author: user,
    });
    const savedLastMessage = await this.messageRepository.save(lastMessage);
    return {
      id: savedLastMessage.id,
      content: savedLastMessage.content,
      createdAt: savedLastMessage.createdAt,
    };
  }

  async getMessages(user, conversationId: string): Promise<Message[]> {
    const existedConversation =
      await this.conversationService.findConversationById(conversationId);
    if (!existedConversation)
      throw new ConflictException('Conversation not found');

    const { id, creator, recipient } = existedConversation;
    if (creator.id !== user.id && recipient.id !== user.id)
      throw new ForbiddenException('Cannot Get Messages');

    return await this.messageRepository.find({
      relations: ['author'],
      where: { conversation: { id } },
      order: { createdAt: 'ASC' },
    });
  }

  async deleteMessage(param: DeleteMessageParam) {
    const { userId, conversationId, messageId } = param;
    console.log('deleteMessage', param);
    const existedConversation =
      await this.conversationService.findConversationById(conversationId);
    if (!existedConversation)
      throw new ConflictException('Conversation not found');

    const { creator, recipient } = existedConversation;
    if (creator.id !== userId && recipient.id !== userId)
      throw new ForbiddenException('Cannot Delete Message');

    const message = await this.messageRepository.findOne({
      where: { id: messageId, conversation: { id: conversationId } },
    });
    if (!message) throw new ConflictException('Message not found');
    if (existedConversation.lastMessageSent.id !== message.id)
      return this.messageRepository.delete({ id: message.id });

    return this.deleteLastMessage(existedConversation, message);
  }

  async deleteLastMessage(conversation: Conversation, message: Message) {
    const size = conversation.messages.length;
    const SECOND_MESSAGE_INDEX = 1;
    if (size <= SECOND_MESSAGE_INDEX) {
      await this.conversationService.update({
        id: conversation.id,
        lastMessageSent: null,
      });

      return this.messageRepository.delete({ id: message.id });
    } else {
      const newLastMessage = conversation.messages[SECOND_MESSAGE_INDEX];
      await this.conversationService.update({
        id: conversation.id,
        lastMessageSent: newLastMessage,
      });

      return this.messageRepository.delete({ id: message.id });
    }
  }

  async editMessage(params: EditMessageParams): Promise<Message> {
    const { userId, conversationId, messageId, content } = params;
    const message = await this.messageRepository.findOne({
      where: {
        id: messageId,
        conversation: { id: conversationId },
        author: { id: userId },
      },
      relations: [
        'conversation',
        'conversation.creator',
        'conversation.recipient',
        'author',
      ],
    });
    if (!message) throw new ConflictException('Message not found');

    message.content = content;
    return this.messageRepository.save(message);
  }
}
