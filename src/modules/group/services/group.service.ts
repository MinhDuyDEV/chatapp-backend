import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupParamsType } from '@/modules/group/types/create-group-params.type';
import { IUserService } from '@/modules/user/users';
import { Services } from '@/shared/constants/services.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from '@/entities/group.entity';
import { Repository } from 'typeorm';
import { IGroupService } from '@/modules/group/interfaces/groups';
import { FetchGroupsParams } from '@/modules/group/types/fetch-groups-params.type';
import { User } from '@/entities/user.entity';
import { AccessParams } from '@/modules/group/types/access-params.type';
import { TransferOwnerParams } from '@/modules/group/types/transfer-owner-params.type';
import { UpdateGroupDetailsParams } from '@/modules/group/types/update-group-details-params.type';

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
  ) {}

  async createGroup(params: CreateGroupParamsType): Promise<Group> {
    const { creator, title } = params;
    const usersPromise = params.users.map((username) =>
      this.userService.findUser({ username }),
    );
    const users = (await Promise.all(usersPromise)).filter((user) => user);
    users.push(creator);
    const groupParams = { owner: creator, users, creator, title };
    const group = this.groupRepository.create(groupParams);
    return this.groupRepository.save(group);
  }

  getGroups(params: FetchGroupsParams): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .where('user.id IN (:users)', { users: [params.userId] })
      .leftJoinAndSelect('group.users', 'users')
      .leftJoinAndSelect('group.creator', 'creator')
      .leftJoinAndSelect('group.owner', 'owner')
      .leftJoinAndSelect('group.lastMessageSent', 'lastMessageSent')
      .orderBy('group.lastMessageSentAt', 'DESC')
      .getMany();
  }

  findGroupById(id: string): Promise<Group> {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['creator', 'users', 'lastMessageSent', 'owner'],
    });
  }

  saveGroup(group: Group): Promise<Group> {
    return this.groupRepository.save(group);
  }

  async hasAccess({
    groupId,
    userId,
  }: AccessParams): Promise<User | undefined> {
    const group = await this.findGroupById(groupId);
    if (group) throw new NotFoundException('Group not found');
    return group.users.find((user) => user.id === userId);
  }

  async transferGroupOwner({
    groupId,
    userId,
    newOwnerId,
  }: TransferOwnerParams): Promise<Group> {
    const group = await this.findGroupById(groupId);
    if (!group) throw new NotFoundException('Group not found');
    if (group.owner.id !== userId)
      throw new BadRequestException('Insufficient Permissions');
    if (group.owner.id === newOwnerId)
      throw new BadRequestException('Cannot Transfer Owner to yourself');

    const newOwner = await this.userService.findUser({ id: newOwnerId });
    if (!newOwner) throw new NotFoundException('User not found');

    group.owner = newOwner;

    return this.groupRepository.save(group);
  }

  async updateDetails({
    groupId,
    title,
    avatar,
  }: UpdateGroupDetailsParams): Promise<Group> {
    const group = await this.findGroupById(groupId);
    if (!group) throw new NotFoundException('Group not found');
    if (avatar) {
      //   update avatar
    }
    group.title = title || group.title;

    return this.groupRepository.save(group);
  }
}
