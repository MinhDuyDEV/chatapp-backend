import { BaseEntity } from '@/entities/base.entity';
import { UserPostResponseDto } from '@/modules/user/dto/user-post-response.dto';
import { Expose } from 'class-transformer';

export class CommentResponseDto extends BaseEntity {
  @Expose()
  id: string;

  @Expose()
  postId: string;

  @Expose()
  content: string;

  @Expose()
  user: UserPostResponseDto;

  @Expose()
  parentCommentId: string | null;

  @Expose()
  updatedAt: Date;
}
