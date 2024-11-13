import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  UseInterceptors,
} from '@nestjs/common';

import { ROUTES } from '@/shared/constants/routes.enum';

import { User } from '@/entities/user.entity';
import { Services } from '@/shared/constants/services.enum';
import { IUserService } from '@/modules/user/users';

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
}
