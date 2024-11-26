import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseMessage } from '@/entities/base-message.entity';
import { Group } from '@/entities/group.entity';
import { GroupMessageAttachment } from '@/entities/group-message-attachment.entity';

@Entity({ name: 'group_messages' })
export class GroupMessage extends BaseMessage {
  @ManyToOne(() => Group, (group) => group.messages)
  group: Group;

  @OneToMany(() => GroupMessageAttachment, (attachment) => attachment.message, {
    cascade: true,
  })
  @JoinColumn()
  attachments?: GroupMessageAttachment[];
}
