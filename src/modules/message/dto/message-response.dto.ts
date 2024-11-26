import { Expose } from 'class-transformer';

import { UserResponseDto } from '@/modules/user/dto/user-response.dto';
import { Conversation } from '@/entities/conversation.entity';

export class MessageResponse {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  author: UserResponseDto;

  @Expose()
  createdAt: Date;
}

export class CreateMessageResponse {
  @Expose()
  messages: MessageResponse[];

  @Expose()
  conversation: Conversation;
}
