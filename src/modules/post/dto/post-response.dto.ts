import { BaseFileResponseDto } from '@/modules/file/dto/base-file-response.dto';
import { LikePostResponseDto } from '@/modules/like/dto/like-post-response.dto';
import { UserPostResponseDto } from '@/modules/user/dto/user-post-response.dto';
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
  @Type(() => UserPostResponseDto)
  author: UserPostResponseDto;

  @Expose()
  @Type(() => BaseFileResponseDto)
  files: BaseFileResponseDto[];

  @Expose()
  @Type(() => LikePostResponseDto)
  likes: LikePostResponseDto[];
  remainingLikeCount: number;
  isLikedByCurrentUser: boolean;
}
