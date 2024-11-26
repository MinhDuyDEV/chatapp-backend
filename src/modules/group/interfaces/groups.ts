import { Group } from '@/entities/group.entity';
import { User } from '@/entities/user.entity';
import { CreateGroupParamsType } from '@/modules/group/types/create-group-params.type';
import { FetchGroupsParams } from '@/modules/group/types/fetch-groups-params.type';
import { AccessParams } from '@/modules/group/types/access-params.type';
import { TransferOwnerParams } from '@/modules/group/types/transfer-owner-params.type';
import { UpdateGroupDetailsParams } from '@/modules/group/types/update-group-details-params.type';

export interface IGroupService {
  createGroup(params: CreateGroupParamsType): Promise<Group>;
  getGroups(params: FetchGroupsParams): Promise<Group[]>;
  findGroupById(id: string): Promise<Group>;
  saveGroup(group: Group): Promise<Group>;
  hasAccess(params: AccessParams): Promise<User | undefined>;
  transferGroupOwner(params: TransferOwnerParams): Promise<Group>;
  updateDetails(params: UpdateGroupDetailsParams): Promise<Group>;
}
