import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@/entities/user.entity';
import { Message } from '@/entities/message.entity';
import { UserService } from '@/modules/user/user.service';
import { Conversation } from '@/entities/conversation.entity';
import { MessageService } from '@/modules/message/message.service';

import { CreateConversationParams } from './types/create-conversation-params';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}

  async getConversations(id: string): Promise<Conversation[]> {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .leftJoinAndSelect('conversation.recipient', 'recipient')
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .where('creator.id = :id', { id })
      .orWhere('recipient.id = :id', { id })
      .orderBy('conversation.id', 'DESC')
      .getMany();
  }

  async findConversationById(id: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['creator', 'recipient', 'lastMessageSent'],
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    return conversation;
  }

  async createConversation(
    user: User,
    createConversationParams: CreateConversationParams,
  ): Promise<Conversation> {
    const { email, message } = createConversationParams;
    if (user.email === email)
      throw new BadRequestException(
        'You cannot create a conversation with yourself',
      );

    const { id: recipientId } = await this.userService.findUser({ email });
    if (!recipientId) throw new BadRequestException('Recipient not found');

    const existedConversation = await this.conversationRepository.findOne({
      where: [
        { creator: { id: user.id }, recipient: { id: recipientId } },
        { creator: { id: recipientId }, recipient: { id: user.id } },
      ],
    });
    if (existedConversation) {
      throw new ConflictException('Conversation already exists');
    }

    const existedRecipient = await this.userService.findUser({
      id: recipientId,
    });
    if (!existedRecipient) {
      throw new BadRequestException('Recipient not found');
    }

    const conversation = this.conversationRepository.create({
      creator: user,
      recipient: existedRecipient,
    });

    const conversationSaved =
      await this.conversationRepository.save(conversation);
    const lastMessageSent = await this.messageService.createMessage({
      content: message,
      conversationId: conversationSaved.id,
      user,
    });
    conversationSaved.lastMessageSent = lastMessageSent;

    return this.conversationRepository.save(conversationSaved);
  }

  async updateLastMessageSent(
    conversationId: string,
    message: Message,
  ): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.lastMessageSent = message;
    return this.conversationRepository.save(conversation);
  }
}
