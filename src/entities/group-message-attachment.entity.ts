import { Column, Entity, ManyToOne } from 'typeorm';
import { GroupMessage } from '@/entities/group-message.entity';
import { BaseEntity } from '@/entities/base.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'group_message_attachments' })
export class GroupMessageAttachment extends BaseEntity {
  @Column()
  @Exclude()
  key: string;

  @Column()
  mimetype: string;

  @Column()
  url: string;

  @Column()
  name: string;

  @ManyToOne(() => GroupMessage, (message) => message.attachments, {
    onDelete: 'CASCADE',
  })
  message: GroupMessage;
}
