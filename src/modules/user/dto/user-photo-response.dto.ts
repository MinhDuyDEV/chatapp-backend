import { Expose } from 'class-transformer';

export class UserAvatarResponseDto {
  @Expose()
  avatar: string;
}

export class UserCoverPhotoResponseDto {
  @Expose()
  coverPhoto: string;
}
