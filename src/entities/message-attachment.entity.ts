import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from '@/entities/message.entity';

@Entity({ name: 'message_attachments' })
export class MessageAttachment {
  @PrimaryGeneratedColumn('uuid')
  key: string;

  @ManyToOne(() => Message, (message) => message.attachments, {
    onDelete: 'CASCADE',
  })
  message: Message;
}
