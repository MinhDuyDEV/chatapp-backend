import { UserResponse } from '@/modules/user/dto/user-response.dto';
import { Expose } from 'class-transformer';

export class PostResponse {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  visibility: string;

  @Expose()
  createdAt: Date;

  @Expose()
  author: UserResponse;
}
