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
import { transformConversationResponse } from '@/shared/utils/format';

import { ConversationResponse } from './dto/conversation-response.dto';
import { CreateConversationParams } from './types/create-conversation-params';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly userService: UserService,
  ) {}

  async getConversations(id: string): Promise<Conversation[]> {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .leftJoinAndSelect('conversation.recipient', 'recipient')
      .where('creator.id = :id', { id })
      .orWhere('recipient.id = :id', { id })
      .orderBy('conversation.id', 'DESC')
      .getMany();
  }

  async findConversationById(id: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['creator', 'recipient'],
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    return conversation;
  }

  async createConversation(
    user: User,
    createConversationParams: CreateConversationParams,
  ): Promise<ConversationResponse> {
    const { recipientId } = createConversationParams;
    if (user.id === recipientId) {
      throw new BadRequestException(
        'You cannot create a conversation with yourself',
      );
    }

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

    return transformConversationResponse(
      await this.conversationRepository.save(conversation),
    );
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
