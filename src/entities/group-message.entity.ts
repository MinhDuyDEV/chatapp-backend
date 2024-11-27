import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseMessage } from '@/entities/base-message.entity';
import { Group } from '@/entities/group.entity';
import { GroupMessageAttachment } from '@/entities/group-message-attachment.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'group_messages' })
export class GroupMessage extends BaseMessage {
  @ManyToOne(() => Group, (group) => group.messages)
  group: Group;

  @OneToMany(() => GroupMessageAttachment, (attachment) => attachment.message, {
    cascade: true,
  })
  @JoinColumn()
  attachments?: GroupMessageAttachment[];

  @ManyToOne(() => GroupMessage, (message) => message.replies, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentMessageId' })
  parentMessage: GroupMessage;

  @OneToMany(() => GroupMessage, (message) => message.parentMessage)
  @Exclude()
  replies: GroupMessage[];
}
