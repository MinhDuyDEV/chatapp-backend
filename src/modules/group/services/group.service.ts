import { Inject, Injectable } from '@nestjs/common';
import { CreateGroupParamsType } from '@/modules/group/types/create-group-params.type';
import { IUserService } from '@/modules/user/users';
import { Services } from '@/shared/constants/services.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from '@/entities/group.entity';
import { Repository } from 'typeorm';
import { IGroupService } from '@/modules/group/interfaces/groups';
import { FetchGroupsParams } from '@/modules/group/types/fetch-groups-params.type';

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
}
