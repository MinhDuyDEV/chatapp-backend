import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
} from '@nestjs/common';

import { User } from '@/entities/user.entity';
import { ROUTES } from '@/shared/constants/routes.enum';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from '@/entities/conversation.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Services } from '@/shared/constants/services.enum';
import { IConversationsService } from '@/modules/conversation/conversations';

@UseInterceptors(ClassSerializerInterceptor)
@Controller(ROUTES.CONVERSATIONS)
export class ConversationController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createConversation(
    @AuthUser() user: User,
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const response = await this.conversationService.createConversation(
      user,
      createConversationDto,
    );
    this.eventEmitter.emit('conversation.create', response);
    return response;
  }

  @Get()
  async getConversations(@AuthUser() user: User): Promise<Conversation[]> {
    return await this.conversationService.getConversations(user.id);
  }

  @Get(':id')
  async getConversation(@Param('id') id: string): Promise<Conversation> {
    return await this.conversationService.findConversationById(id);
  }
}
