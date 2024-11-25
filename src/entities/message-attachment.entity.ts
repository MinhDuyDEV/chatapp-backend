import { Column, Entity, ManyToOne } from 'typeorm';
import { Message } from '@/entities/message.entity';
import { BaseEntity } from '@/entities/base.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'message_attachments' })
export class MessageAttachment extends BaseEntity {
  @Column()
  @Exclude()
  key: string;

  @Column()
  mimetype: string;

  @Column()
  url: string;

  @Column()
  name: string;

  @ManyToOne(() => Message, (message) => message.attachments)
  message: Message;
}
