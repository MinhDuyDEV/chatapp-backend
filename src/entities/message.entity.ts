import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Conversation } from '@/entities/conversation.entity';
import { BaseMessage } from '@/entities/base-message.entity';
import { MessageAttachment } from '@/entities/message-attachment.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'messages' })
export class Message extends BaseMessage {
  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;

  @OneToMany(() => MessageAttachment, (attachment) => attachment.message, {
    cascade: true,
  })
  @JoinColumn()
  attachments: MessageAttachment[];

  @ManyToOne(() => Message, (message) => message.replies)
  @JoinColumn({ name: 'parentMessageId' })
  parentMessage: Message;

  @OneToMany(() => Message, (message) => message.parentMessage)
  @Exclude()
  replies: Message[];
}
