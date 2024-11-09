import { Expose, Type } from 'class-transformer';

export class LikePostResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => String)
  userId: string;

  @Expose()
  @Type(() => String)
  username: string;

  @Expose()
  updatedAt: Date;
}
