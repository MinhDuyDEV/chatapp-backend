import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '@/entities/user.entity';
import { ROUTES } from '@/shared/constants/routes.enum';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';

import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EditMessageDto } from '@/modules/message/dto/edit-message.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller(ROUTES.MESSAGES)
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @AuthUser() user: User,
    @Param('conversationId') conversationId: string,
    @Body() { content }: CreateMessageDto,
  ): Promise<void> {
    const response = await this.messageService.createMessage({
      user,
      content,
      conversationId,
    });
    this.eventEmitter.emit('message.create', response);
    return;
  }

  @Get()
  async getMessages(
    @AuthUser() user: User,
    @Param('conversationId') conversationId: string,
  ): Promise<any> {
    return {
      conversationId,
      messages: await this.messageService.getMessages(user, conversationId),
    };
  }

  @Patch(':messageId')
  async editMessage(
    @AuthUser() { id: userId }: User,
    @Param('id') conversationId: string,
    @Param('messageId') messageId: string,
    @Body() { content }: EditMessageDto,
  ) {
    const params = { userId, content, conversationId, messageId };
    const message = await this.messageService.editMessage(params);
    this.eventEmitter.emit('message.update', message);
    return message;
  }

  @Delete(':conversationId')
  async deleteMessage(
    @AuthUser() user: User,
    @Param('conversationId') conversationId: string,
    @Param('messageId') messageId: string,
  ): Promise<any> {
    return await this.messageService.deleteMessage({
      user,
      conversationId,
      messageId,
    });
  }
}
