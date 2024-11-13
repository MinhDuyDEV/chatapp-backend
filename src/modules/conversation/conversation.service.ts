import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@/entities/user.entity';
import { Message } from '@/entities/message.entity';
import { Conversation } from '@/entities/conversation.entity';
import { CreateConversationParams } from './types/create-conversation-params';
import { UpdateConversationParams } from '@/modules/conversation/types/update-conversation-params';
import { Services } from '@/shared/constants/services.enum';
import { IMessageService } from '@/modules/message/messages';
import { IConversationsService } from '@/modules/conversation/conversations';
import { IUserService } from '@/modules/user/users';

@Injectable()
export class ConversationService implements IConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @Inject(Services.USERS) private readonly userService: IUserService,
    @Inject(Services.MESSAGES)
    private readonly messageService: IMessageService,
  ) {}

  async getConversations(id: string): Promise<Conversation[]> {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .leftJoinAndSelect('conversation.recipient', 'recipient')
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .where('creator.id = :id', { id })
      .orWhere('recipient.id = :id', { id })
      .orderBy('lastMessageSent.createdAt', 'DESC')
      .getMany();
  }

  async findConversationById(id: string): Promise<Conversation> {
    return await this.conversationRepository.findOne({
      where: { id },
      relations: ['creator', 'recipient', 'lastMessageSent'],
    });
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

    const existedRecipient = await this.userService.findUser({ email });
    if (!existedRecipient) throw new BadRequestException('Recipient not found');

    const existedConversation = await this.conversationRepository.findOne({
      where: [
        { creator: { id: user.id }, recipient: { id: existedRecipient.id } },
        { creator: { id: existedRecipient.id }, recipient: { id: user.id } },
      ],
    });
    if (existedConversation) {
      throw new ConflictException('Conversation already exists');
    }

    const conversation = this.conversationRepository.create({
      creator: user,
      recipient: existedRecipient,
    });

    const conversationSaved =
      await this.conversationRepository.save(conversation);
    conversationSaved.lastMessageSent =
      await this.messageService.createLastMessage(
        conversationSaved.id,
        message,
        user,
      );

    return this.conversationRepository.save(conversationSaved);
  }

  async updateLastMessageSent(
    conversationId: string,
    message: Message,
  ): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['creator', 'recipient', 'lastMessageSent'],
    });
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.lastMessageSent = message;
    return this.conversationRepository.save(conversation);
  }

  update({ id, lastMessageSent }: UpdateConversationParams): Promise<any> {
    return this.conversationRepository.update(id, { lastMessageSent });
  }
}
