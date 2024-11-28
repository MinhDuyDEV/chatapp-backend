import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ROUTES } from '@/shared/constants/routes.enum';
import { Services } from '@/shared/constants/services.enum';
import { IGroupMessageService } from '@/modules/group/interfaces/group-messages';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { User } from '@/entities/user.entity';
import { CreateMessageDto } from '@/modules/message/dto/create-message.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller(ROUTES.GROUP_MESSAGES)
export class GroupMessageController {
  constructor(
    @Inject(Services.GROUP_MESSAGES)
    private readonly groupMessageService: IGroupMessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createGroupMessage(
    @AuthUser() user: User,
    @Param('groupId') groupId: string,
    @Body() { content, attachments, parentMessageId }: CreateMessageDto,
  ) {
    const params = {
      groupId,
      author: user,
      content,
      attachments,
      parentMessageId,
    };
    const response = await this.groupMessageService.createGroupMessage(params);
    this.eventEmitter.emit('group.message.create', response);
    return;
  }

  @Get()
  async getGroupMessages(
    @AuthUser() user: User,
    @Param('groupId') groupId: string,
  ) {
    const messages = await this.groupMessageService.getGroupMessages(groupId);
    return { groupId, messages };
  }

  @Delete(':messageId')
  async deleteGroupMessage(
    @AuthUser() user: User,
    @Param('groupId') groupId: string,
    @Param('messageId') messageId: string,
  ) {
    await this.groupMessageService.deleteGroupMessage({
      userId: user.id,
      messageId,
      groupId,
    });
    this.eventEmitter.emit('group.message.delete', {
      userId: user.id,
      messageId,
      groupId,
    });
    return { groupId, messageId };
  }
}
