import { Expose } from 'class-transformer';

import { UserResponse } from '@/modules/user/dto/user-response.dto';
import { ConversationResponse } from '@/modules/conversation/dto/conversation-response.dto';

export class MessageResponse {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  author: UserResponse;

  @Expose()
  conversation: ConversationResponse;

  @Expose()
  createdAt: Date;
}
