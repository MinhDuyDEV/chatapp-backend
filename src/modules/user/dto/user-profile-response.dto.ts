import { SocialPlatform } from '@/shared/types/social-link';
import { Expose, Type } from 'class-transformer';

// Create a class for SocialLink instead of using type
export class SocialLinkDto {
  @Expose()
  platform: SocialPlatform;

  @Expose()
  url: string;
}

export class UserProfileResponseDto {
  @Expose()
  username: string;

  @Expose()
  avatar: string;

  @Expose()
  coverPhoto: string;

  @Expose()
  bio: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  birthday: string;

  @Expose()
  gender: string;

  @Expose()
  address: string;

  @Expose()
  @Type(() => SocialLinkDto)
  socialLinks: SocialLinkDto[];
}
