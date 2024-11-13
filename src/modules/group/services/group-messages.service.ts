import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IGroupMessageService } from '@/modules/group/interfaces/group-messages';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMessage } from '@/entities/group-message.entity';
import { Group } from '@/entities/group.entity';
import { Repository } from 'typeorm';
import { Services } from '@/shared/constants/services.enum';
import { IGroupService } from '@/modules/group/interfaces/groups';
import { CreateGroupMessageParams } from '@/modules/group/types/create-group-message-params.type';
import { DeleteGroupMessageParams } from '@/modules/group/types/delete-group-message-params.type';
import { EditGroupMessageParams } from '@/modules/group/types/edit-group-message-params.type';

@Injectable()
export class GroupMessageService implements IGroupMessageService {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(Services.GROUPS)
    private readonly groupService: IGroupService,
  ) {}

  async createGroupMessage({ groupId, ...params }: CreateGroupMessageParams) {
    const { content, author } = params;
    const group = await this.groupService.findGroupById(groupId);
    if (!group) throw new BadRequestException('Group not found');
    const findUser = group.users.find((u) => u.id === author.id);
    if (!findUser)
      throw new BadRequestException('User is not a member of this group');
    const groupMessage = this.groupMessageRepository.create({
      content,
      group,
      author,
      attachments: [],
    });
    const savedMessage = await this.groupMessageRepository.save(groupMessage);
    group.lastMessageSent = savedMessage;
    const updatedGroup = await this.groupService.saveGroup(group);
    return { message: savedMessage, group: updatedGroup };
  }

  getGroupMessages(id: string): Promise<GroupMessage[]> {
    return this.groupMessageRepository.find({
      where: { group: { id } },
      relations: ['author', 'attachments'],
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async deleteGroupMessage(params: DeleteGroupMessageParams) {
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .where('group.id = :groupId', { groupId: params.groupId })
      .leftJoinAndSelect('group.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('group.messages', 'messages')
      .orderBy('messages.createdAt', 'DESC')
      .limit(5)
      .getOne();
    if (!group) throw new BadRequestException('Group not found');

    const message = await this.groupMessageRepository.findOne({
      where: {
        id: params.messageId,
        author: { id: params.userId },
        group: { id: params.groupId },
      },
    });
    if (!message) throw new BadRequestException('Cannot delete message');
    if (group.lastMessageSent.id !== message.id) {
      return this.groupMessageRepository.delete({ id: message.id });
    }

    const size = group.messages.length;
    const SECOND_MESSAGE_INDEX = 1;
    if (size <= SECOND_MESSAGE_INDEX) {
      await this.groupRepository.update(
        { id: params.groupId },
        { lastMessageSent: null },
      );
      return this.groupMessageRepository.delete({ id: message.id });
    } else {
      const newLastMessage = group.messages[SECOND_MESSAGE_INDEX];
      await this.groupRepository.update(
        { id: params.groupId },
        { lastMessageSent: newLastMessage },
      );
      return this.groupMessageRepository.delete({ id: message.id });
    }
  }

  editGroupMessage(params: EditGroupMessageParams): Promise<GroupMessage> {
    return Promise.resolve(undefined);
  }
}
