import { BaseFileResponseDto } from '@/modules/file/dto/base-file-response.dto';
import { LikePostResponseDto } from '@/modules/like/dto/like-post-response.dto';
import { UserBasicInfoDto } from '@/modules/user/dto/user-basic-info.dto';
import { Expose, Type } from 'class-transformer';

export class PostResponseDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  visibility: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => UserBasicInfoDto)
  author: UserBasicInfoDto;

  @Expose()
  @Type(() => BaseFileResponseDto)
  attachments: BaseFileResponseDto[];

  @Expose()
  @Type(() => LikePostResponseDto)
  likes: LikePostResponseDto[];
  remainingLikeCount: number;
  isLikedByCurrentUser: boolean;

  @Expose()
  commentCount: number;
}
