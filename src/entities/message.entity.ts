import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Conversation } from '@/entities/conversation.entity';
import { BaseMessage } from '@/entities/base-message.entity';
import { MessageAttachment } from '@/entities/message-attachment.entity';

@Entity({ name: 'messages' })
export class Message extends BaseMessage {
  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;

  @OneToMany(() => MessageAttachment, (attachment) => attachment.message)
  @JoinColumn()
  attachments: MessageAttachment[];
}
