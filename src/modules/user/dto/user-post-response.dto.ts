import { Expose } from 'class-transformer';
export class UserPostResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  avatar: string;
}
