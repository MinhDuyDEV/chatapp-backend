import { Expose, Type } from 'class-transformer';
import { UserBasicInfoDto } from '@/modules/user/dto/user-basic-info.dto';
import { BaseFileResponseDto } from '@/modules/file/dto/base-file-response.dto';

export class TimelinePostDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  visibility: string;

  @Expose()
  @Type(() => BaseFileResponseDto)
  attachments: BaseFileResponseDto[];

  @Expose()
  @Type(() => UserBasicInfoDto)
  author: UserBasicInfoDto;

  @Expose()
  likesCount: number;

  @Expose()
  isLikedByMe: boolean;

  @Expose()
  commentsCount: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
