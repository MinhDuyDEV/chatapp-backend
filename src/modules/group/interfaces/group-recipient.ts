import { AddGroupRecipientParams } from '@/modules/group/types/add-group-recipient-params.type';
import { AddGroupUserResponse } from '@/modules/group/types/add-group-user-res.type';
import { RemoveGroupRecipientParams } from '@/modules/group/types/remove-group-recipient-params.type';
import { RemoveGroupUserResponse } from '@/modules/group/types/remove-group-user-res.type';
import { LeaveGroupParams } from '@/modules/group/types/leave-group-params.type';
import { Group } from '@/entities/group.entity';
import { CheckUserGroupParams } from '@/modules/group/types/check-user-group-params.type';

export interface IGroupRecipientService {
  addGroupRecipient(
    params: AddGroupRecipientParams,
  ): Promise<AddGroupUserResponse>;
  removeGroupRecipient(
    params: RemoveGroupRecipientParams,
  ): Promise<RemoveGroupUserResponse>;
  leaveGroup(params: LeaveGroupParams);
  isUserInGroup(params: CheckUserGroupParams): Promise<Group>;
}
