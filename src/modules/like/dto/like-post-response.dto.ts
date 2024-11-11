import { Expose } from 'class-transformer';

export class LikePostResponseDto {
  @Expose()
  username: string;
}
