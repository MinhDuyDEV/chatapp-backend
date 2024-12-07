import { User } from '@/entities/user.entity';
import { FindUserParams } from '@/modules/user/types/find-user-params.type';
import { CreateUserParams } from '@/modules/user/types/create-user.type';
import {
  UserAvatarResponseDto,
  UserCoverPhotoResponseDto,
} from './dto/user-photo-response.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';

export interface IUserService {
  findAllUsers(): Promise<User[]>;
  findUser(params: FindUserParams): Promise<User>;
  saveRefreshToken(token: string, userId: string): Promise<any>;
  createUser(params: CreateUserParams): Promise<User>;
  deleteRefreshToken(userId: string): Promise<any>;
  uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UserAvatarResponseDto>;
  uploadCoverPhoto(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UserCoverPhotoResponseDto>;
  getUserProfile(username: string): Promise<UserProfileResponseDto>;
}
