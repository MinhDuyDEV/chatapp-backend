import { UserBasicInfoDto } from '@/modules/user/dto/user-basic-info.dto';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class FriendRequestDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => UserBasicInfoDto)
  sender?: UserBasicInfoDto;

  @Expose()
  @Type(() => UserBasicInfoDto)
  receiver?: UserBasicInfoDto;

  @Expose()
  message: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class SendFriendRequestDto {
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsOptional()
  message?: string;
}

export class SendFriendRequestResponseDto {
  @Expose()
  id: string;

  @Expose()
  status: string;

  @Expose()
  message: string;

  @Expose()
  updatedAt: Date;

  @Expose()
  sender: UserBasicInfoDto;
}

export class RejectFriendRequestDto {
  @IsString()
  @IsOptional()
  reason?: string;
}

export class AcceptFriendRequestResponseDto {
  @Expose()
  id: string;

  @Expose()
  status: string;

  @Expose()
  respondedAt: Date;
}

export class RejectFriendRequestResponseDto extends AcceptFriendRequestResponseDto {
  @Expose()
  reason: string;
}
