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
import { GroupMessageAttachment } from '@/entities/group-message-attachment.entity';
import { User } from '@/entities/user.entity';
import { AttachmentDto } from '@/modules/message/dto/create-message.dto';

@Injectable()
export class GroupMessageService implements IGroupMessageService {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @InjectRepository(GroupMessageAttachment)
    private readonly groupMessageAttachmentRepository: Repository<GroupMessageAttachment>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(Services.GROUPS)
    private readonly groupService: IGroupService,
  ) {}

  // async createGroupMessage({ groupId, ...params }: CreateGroupMessageParams) {
  //   const { content, author, attachments } = params;
  //   const group = await this.groupService.findGroupById(groupId);
  //   if (!group) throw new BadRequestException('Group not found');
  //   const findUser = group.users.find((u) => u.id === author.id);
  //   if (!findUser)
  //     throw new BadRequestException('User is not a member of this group');
  //   const groupMessage = this.groupMessageRepository.create({
  //     content,
  //     group,
  //     author,
  //     attachments: attachments
  //       ? await this.messageAttachmentsService.createGroupAttachments(
  //           attachments,
  //         )
  //       : [],
  //   });
  //   const savedMessage = await this.groupMessageRepository.save(groupMessage);
  //   group.lastMessageSent = savedMessage;
  //   const updatedGroup = await this.groupService.saveGroup(group);
  //   return { message: savedMessage, group: updatedGroup };
  // }

  async createGroupMessage({
    groupId,
    content,
    author,
    attachments,
  }: CreateGroupMessageParams): Promise<any> {
    const group = await this.groupService.findGroupById(groupId);
    if (!group) throw new BadRequestException('Group not found');
    const findUser = group.users.find((u) => u.id === author.id);
    if (!findUser)
      throw new BadRequestException('User is not a member of this group');

    const messages = [];

    if (content) {
      const contentMessage = await this.createContentMessage(
        content,
        group,
        author,
      );
      messages.push(contentMessage);
    }

    if (attachments && attachments.length > 0) {
      const attachmentMessages = await this.createAttachmentMessages(
        attachments,
        group,
        author,
      );
      messages.push(...attachmentMessages);
    }

    group.lastMessageSent = messages[messages.length - 1];
    const updatedGroup = await this.groupService.saveGroup(group);

    return { messages, group: updatedGroup };
  }

  private async createContentMessage(
    content: string,
    group: Group,
    author: User,
  ): Promise<GroupMessage> {
    const newMessage = this.groupMessageRepository.create({
      content,
      group,
      author,
      attachments: [],
    });
    return await this.groupMessageRepository.save(newMessage);
  }

  private async createAttachmentMessages(
    attachments: AttachmentDto[],
    group: Group,
    author: User,
  ): Promise<GroupMessage[]> {
    const messages = [];
    const imageAttachments = [];

    for (const attachment of attachments) {
      const existingAttachment =
        await this.groupMessageAttachmentRepository.findOne({
          where: { id: attachment.id },
        });
      if (!existingAttachment)
        throw new BadRequestException(
          `Attachment with id ${attachment.id} not found`,
        );

      if (existingAttachment.mimetype.includes('image')) {
        imageAttachments.push(existingAttachment);
      } else if (
        existingAttachment.mimetype.includes('video') ||
        existingAttachment.mimetype.includes('application')
      ) {
        const newMessage = this.groupMessageRepository.create({
          content: '',
          group,
          author,
          attachments: [existingAttachment],
        });
        const savedMessage = await this.groupMessageRepository.save(newMessage);
        messages.push(savedMessage);
      }
    }

    if (imageAttachments.length > 0) {
      const newMessage = this.groupMessageRepository.create({
        content: '',
        group,
        author,
        attachments: imageAttachments,
      });
      const savedMessage = await this.groupMessageRepository.save(newMessage);
      messages.push(savedMessage);
    }

    return messages;
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
    console.log('editGroupMessage', params);
    return Promise.resolve(undefined);
  }
}
