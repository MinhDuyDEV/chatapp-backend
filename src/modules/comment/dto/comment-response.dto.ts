import { BaseEntity } from '@/entities/base.entity';
import { UserBasicInfoDto } from '@/modules/user/dto/user-basic-info.dto';
import { Expose } from 'class-transformer';

export class CommentResponseDto extends BaseEntity {
  @Expose()
  id: string;

  @Expose()
  postId: string;

  @Expose()
  content: string;

  @Expose()
  user: UserBasicInfoDto;

  @Expose()
  parentCommentId: string | null;

  @Expose()
  updatedAt: Date;
}
