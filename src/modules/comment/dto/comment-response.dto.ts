import { BaseEntity } from '@/entities/base.entity';
import { UserBasicInfoDto } from '@/modules/user/dto/user-basic-info.dto';
import { Expose, Type } from 'class-transformer';

export class CommentResponseDto extends BaseEntity {
  @Expose()
  id: string;

  @Expose()
  postId: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => UserBasicInfoDto)
  user: UserBasicInfoDto;

  @Expose()
  parentCommentId: string | null;

  @Expose()
  updatedAt: Date;
}
