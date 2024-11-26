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
import { CreateMessageParams } from './types/create-message-params.type';
import { User } from '@/entities/user.entity';
import { DeleteMessageParam } from '@/modules/message/types/delete-message-param.type';
import { Conversation } from '@/entities/conversation.entity';
import { EditMessageParams } from '@/modules/message/types/edit-message-params.type';
import { IMessageService } from '@/modules/message/messages';
import { Services } from '@/shared/constants/services.enum';
import { IConversationsService } from '@/modules/conversation/conversations';
import { MessageAttachment } from '@/entities/message-attachment.entity';
import { AttachmentDto } from '@/modules/message/dto/create-message.dto';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(MessageAttachment)
    private readonly messageAttachmentRepository: Repository<MessageAttachment>,
    @Inject(forwardRef(() => Services.CONVERSATIONS))
    private readonly conversationService: IConversationsService,
  ) {}

  async createMessage({
    content,
    conversationId,
    user,
    attachments,
  }: CreateMessageParams): Promise<any> {
    const existedConversation =
      await this.conversationService.findConversationById(conversationId);
    if (!existedConversation)
      throw new ConflictException('Conversation not found');

    const { creator, recipient } = existedConversation;
    if (creator.id !== user.id && recipient.id !== user.id)
      throw new ForbiddenException('Cannot Create Message');

    const messages = [];

    if (content) {
      const contentMessage = await this.createContentMessage(
        content,
        existedConversation,
        user,
      );
      messages.push(contentMessage);
    }

    if (attachments && attachments.length > 0) {
      const attachmentMessages = await this.createAttachmentMessages(
        attachments,
        existedConversation,
        user,
      );
      messages.push(...attachmentMessages);
    }

    const savedConversation =
      await this.conversationService.updateLastMessageSent(
        conversationId,
        messages[messages.length - 1],
      );

    return { messages, conversation: savedConversation };
  }

  private async createContentMessage(
    content: string,
    conversation: Conversation,
    user: User,
  ): Promise<Message> {
    const newMessage = this.messageRepository.create({
      content,
      conversation,
      author: user,
      attachments: [],
    });
    return await this.messageRepository.save(newMessage);
  }

  private async createAttachmentMessages(
    attachments: AttachmentDto[],
    conversation: Conversation,
    user: User,
  ): Promise<Message[]> {
    const messages = [];
    const imageAttachments = [];

    for (const attachment of attachments) {
      const existingAttachment = await this.messageAttachmentRepository.findOne(
        { where: { id: attachment.id } },
      );
      if (!existingAttachment)
        throw new ConflictException(
          `Attachment with id ${attachment.id} not found`,
        );

      if (existingAttachment.mimetype.includes('image')) {
        imageAttachments.push(existingAttachment);
      } else if (
        existingAttachment.mimetype.includes('video') ||
        existingAttachment.mimetype.includes('application')
      ) {
        const newMessage = this.messageRepository.create({
          content: '',
          conversation,
          author: user,
          attachments: [existingAttachment],
        });
        const savedMessage = await this.messageRepository.save(newMessage);
        messages.push(savedMessage);
      }
    }

    if (imageAttachments.length > 0) {
      const newMessage = this.messageRepository.create({
        content: '',
        conversation,
        author: user,
        attachments: imageAttachments,
      });
      const savedMessage = await this.messageRepository.save(newMessage);
      messages.push(savedMessage);
    }

    return messages;
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

  async getMessages(user: User, conversationId: string): Promise<Message[]> {
    const existedConversation =
      await this.conversationService.findConversationById(conversationId);
    if (!existedConversation)
      throw new ConflictException('Conversation not found');

    const { id, creator, recipient } = existedConversation;
    if (creator.id !== user.id && recipient.id !== user.id)
      throw new ForbiddenException('Cannot Get Messages');

    return await this.messageRepository.find({
      relations: ['author', 'attachments'],
      where: { conversation: { id } },
      order: { createdAt: 'ASC' },
    });
  }

  async deleteMessage(param: DeleteMessageParam): Promise<any> {
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

  async deleteLastMessage(
    conversation: Conversation,
    message: Message,
  ): Promise<any> {
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
