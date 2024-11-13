import { GroupMessage } from '@/entities/group-message.entity';
import { DeleteGroupMessageParams } from '@/modules/group/types/delete-group-message-params.type';
import { CreateGroupMessageParams } from '@/modules/group/types/create-group-message-params.type';
import { EditGroupMessageParams } from '@/modules/group/types/edit-group-message-params.type';
import { Group } from '@/entities/group.entity';

export interface IGroupMessageService {
  createGroupMessage(
    params: CreateGroupMessageParams,
  ): Promise<{ message: GroupMessage; group: Group }>;
  getGroupMessages(id: string): Promise<GroupMessage[]>;
  deleteGroupMessage(params: DeleteGroupMessageParams): Promise<any>;
  editGroupMessage(params: EditGroupMessageParams): Promise<GroupMessage>;
}
