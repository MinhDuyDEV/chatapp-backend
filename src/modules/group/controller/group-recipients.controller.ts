import { Body, Controller, Delete, Inject, Param, Post } from '@nestjs/common';
import { ROUTES } from '@/shared/constants/routes.enum';
import { Services } from '@/shared/constants/services.enum';
import { IGroupRecipientService } from '@/modules/group/interfaces/group-recipient';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { User } from '@/entities/user.entity';
import { AddGroupRecipientDto } from '@/modules/group/dto/add-group-recipient.dto';

@Controller(ROUTES.GROUP_RECIPIENTS)
export class GroupRecipientsController {
  constructor(
    @Inject(Services.GROUP_RECIPIENTS)
    private readonly groupRecipientService: IGroupRecipientService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async addGroupRecipient(
    @AuthUser() { id: userId }: User,
    @Param('groupId') groupId: string,
    @Body() { username }: AddGroupRecipientDto,
  ) {
    const params = { groupId, userId, username };
    const response = await this.groupRecipientService.addGroupRecipient(params);
    this.eventEmitter.emit('group.user.add', response);
    return response;
  }

  @Delete('leave')
  async leaveGroup(@AuthUser() user: User, @Param('groupId') groupId: string) {
    const group = await this.groupRecipientService.leaveGroup({
      groupId,
      userId: user.id,
    });
    this.eventEmitter.emit('group.user.leave', { group, userId: user.id });
    return group;
  }

  @Delete(':userId')
  async removeGroupRecipient(
    @AuthUser() { id: issuerId }: User,
    @Param('groupId') groupId: string,
    @Param('userId') removeUserId: string,
  ) {
    const params = { issuerId, groupId, removeUserId };
    const response =
      await this.groupRecipientService.removeGroupRecipient(params);
    this.eventEmitter.emit('group.user.remove', response);
    return response.group;
  }
}
