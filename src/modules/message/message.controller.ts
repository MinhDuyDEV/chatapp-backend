import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import {
  transformCreateMessageResponse,
  transformGetMessagesResponse,
} from '@/shared/utils/format';
import { User } from '@/entities/user.entity';
import { ROUTES } from '@/shared/constants/routes.enum';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';

import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateMessageResponse } from './dto/message-response.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(ROUTES.MESSAGES)
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @AuthUser() user: User,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<CreateMessageResponse> {
    const response = transformCreateMessageResponse(
      await this.messageService.createMessage({ user, ...createMessageDto }),
    );
    this.eventEmitter.emit('message.create', response);
    return;
  }

  @Get(':conversationId')
  async getMessages(
    @AuthUser() user: User,
    @Param('conversationId') conversationId: string,
  ): Promise<any> {
    return {
      conversationId,
      messages: transformGetMessagesResponse(
        await this.messageService.getMessages(user, conversationId),
      ),
    };
  }
}
