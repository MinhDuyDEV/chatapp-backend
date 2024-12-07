import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ROUTES } from '@/shared/constants/routes.enum';
import { User } from '@/entities/user.entity';
import { Services } from '@/shared/constants/services.enum';
import { IUserService } from '@/modules/user/users';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import {
  UserAvatarResponseDto,
  UserCoverPhotoResponseDto,
} from './dto/user-photo-response.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller(ROUTES.USERS)
export class UserController {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @AuthUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserAvatarResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return await this.userService.uploadAvatar(user.id, file);
  }

  @Post('upload-coverPhoto')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverPhoto(
    @AuthUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserCoverPhotoResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return await this.userService.uploadCoverPhoto(user.id, file);
  }

  @Get('profile/:username')
  async getUserProfile(
    @Param('username') username: string,
  ): Promise<UserProfileResponseDto> {
    return await this.userService.getUserProfile(username);
  }
}
