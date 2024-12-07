import { SocialPlatform } from '@/shared/types/social-link';
import { Expose, Type } from 'class-transformer';
import { BasicProfileDto, UserBasicInfoDto } from './user-basic-info.dto';

export class SocialLinkDto {
  @Expose()
  platform: SocialPlatform;

  @Expose()
  url: string;
}

export class ProfileDto extends BasicProfileDto {
  @Expose()
  coverPhoto: string;

  @Expose()
  bio: string;

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

export class UserProfileResponseDto extends UserBasicInfoDto {
  @Expose()
  @Type(() => ProfileDto)
  profile: ProfileDto;
}
