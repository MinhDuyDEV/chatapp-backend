import { IGroupRecipientService } from '@/modules/group/interfaces/group-recipient';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Services } from '@/shared/constants/services.enum';
import { IUserService } from '@/modules/user/users';
import { IGroupService } from '@/modules/group/interfaces/groups';
import { AddGroupRecipientParams } from '@/modules/group/types/add-group-recipient-params.type';
import { AddGroupUserResponse } from '@/modules/group/types/add-group-user-res.type';
import { CheckUserGroupParams } from '@/modules/group/types/check-user-group-params.type';
import { Group } from '@/entities/group.entity';
import { LeaveGroupParams } from '@/modules/group/types/leave-group-params.type';
import { RemoveGroupRecipientParams } from '@/modules/group/types/remove-group-recipient-params.type';
import { RemoveGroupUserResponse } from '@/modules/group/types/remove-group-user-res.type';

@Injectable()
export class GroupRecipientService implements IGroupRecipientService {
  constructor(
    @Inject(Services.USERS) private userService: IUserService,
    @Inject(Services.GROUPS) private groupService: IGroupService,
  ) {}

  async addGroupRecipient({
    groupId,
    userId,
    username,
  }: AddGroupRecipientParams): Promise<AddGroupUserResponse> {
    const group = await this.groupService.findGroupById(groupId);
    if (!group) throw new NotFoundException('Group not found');
    if (group.owner.id !== userId)
      throw new ForbiddenException('Insufficient Permissions');

    const recipient = await this.userService.findUser({
      username: username,
    });
    if (!recipient) throw new BadRequestException('User not found');

    const inGroup = group.users.find((user) => user.id === recipient.id);
    if (inGroup) throw new BadRequestException('User already in group');

    group.users = [...group.users, recipient];
    const savedGroup = await this.groupService.saveGroup(group);

    return { group: savedGroup, user: recipient };
  }

  async isUserInGroup({
    groupId,
    userId,
  }: CheckUserGroupParams): Promise<Group> {
    const group = await this.groupService.findGroupById(groupId);
    if (!group) throw new NotFoundException('Group not found');

    const user = group.users.find((user) => user.id === userId);
    if (!user) throw new NotFoundException('User not found in group');

    return group;
  }

  async leaveGroup({ groupId, userId }: LeaveGroupParams) {
    const group = await this.isUserInGroup({ groupId, userId });
    if (group.owner.id === userId)
      throw new BadRequestException('Owner cannot leave group');

    group.users = group.users.filter((user) => user.id !== userId);

    return this.groupService.saveGroup(group);
  }

  async removeGroupRecipient({
    groupId,
    removeUserId,
    issuerId,
  }: RemoveGroupRecipientParams): Promise<RemoveGroupUserResponse> {
    const userToBeRemoved = await this.userService.findUser({
      id: removeUserId,
    });
    if (!userToBeRemoved)
      throw new BadRequestException('User cannot be removed');

    const group = await this.groupService.findGroupById(groupId);
    if (!group) throw new NotFoundException('Group not found');
    if (group.owner.id !== issuerId)
      throw new ForbiddenException('Insufficient Permissions');
    if (group.owner.id === removeUserId)
      throw new BadRequestException('Owner cannot be removed');

    group.users = group.users.filter((user) => user.id !== removeUserId);
    const savedGroup = await this.groupService.saveGroup(group);

    return { group: savedGroup, user: userToBeRemoved };
  }
}
