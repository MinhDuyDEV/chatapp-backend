import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '@/entities/user.entity';
import { ROUTES } from '@/shared/constants/routes.enum';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';

import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

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
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<void> {
    const response = await this.messageService.createMessage({
      user,
      ...createMessageDto,
    });
    console.log('response', response);
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
      messages: await this.messageService.getMessages(user, conversationId),
    };
  }
}
