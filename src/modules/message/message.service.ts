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
import { CreateMessageResponse } from '@/modules/message/dto/message-response.dto';

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
}
