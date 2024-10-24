import { Expose } from 'class-transformer';

import { UserResponse } from '@/modules/user/dto/user-response.dto';

export class ConversationResponse {
  @Expose()
  id: string;

  @Expose()
  creator: UserResponse;

  @Expose()
  recipient: UserResponse;

  @Expose()
  createdAt: Date;

  @Expose()
  lastMessageSent: string;
}
