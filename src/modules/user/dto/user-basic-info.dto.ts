import { Expose, Type } from 'class-transformer';

export class BasicProfileDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
}

export class UserBasicInfoDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  avatar: string;

  @Expose()
  @Type(() => BasicProfileDto)
  profile: BasicProfileDto;
}
