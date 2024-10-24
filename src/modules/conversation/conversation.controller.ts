import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { User } from '@/entities/user.entity';
import { ROUTES } from '@/shared/constants/routes.enum';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { transformConversationResponse } from '@/shared/utils/format';

import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ConversationResponse } from './dto/conversation-response.dto';

@Controller(ROUTES.CONVERSATIONS)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async createConversation(
    @AuthUser() user: User,
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<ConversationResponse> {
    return await this.conversationService.createConversation(
      user,
      createConversationDto,
    );
  }

  @Get()
  async getConversations(
    @AuthUser() user: User,
  ): Promise<ConversationResponse[]> {
    return (await this.conversationService.getConversations(user.id)).map(
      transformConversationResponse,
    );
  }

  @Get(':id')
  async getConversation(
    @Param('id') id: string,
  ): Promise<ConversationResponse> {
    return transformConversationResponse(
      await this.conversationService.findConversationById(id),
    );
  }
}
