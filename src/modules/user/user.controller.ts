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

  @Post(':id/upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Param('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return await this.userService.uploadAvatar(userId, file);
  }
}
