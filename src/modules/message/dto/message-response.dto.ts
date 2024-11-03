import { Expose } from 'class-transformer';

import { UserResponse } from '@/modules/user/dto/user-response.dto';
import { Conversation } from '@/entities/conversation.entity';

export class MessageResponse {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  author: UserResponse;

  @Expose()
  createdAt: Date;
}

export class CreateMessageResponse {
  @Expose()
  message: MessageResponse;

  @Expose()
  conversation: Conversation;
}
