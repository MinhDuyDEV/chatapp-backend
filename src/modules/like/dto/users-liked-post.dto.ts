import { UserRelationshipDto } from '@/modules/friend/dto/user-relationship.dto';
import { UserBasicInfoDto } from '@/modules/user/dto/user-basic-info.dto';
import { Expose, Type } from 'class-transformer';

export class UsersLikedPostDto {
  @Expose()
  @Type(() => UserBasicInfoDto)
  user: UserBasicInfoDto;

  @Expose()
  @Type(() => UserRelationshipDto)
  relationship: UserRelationshipDto;
}
