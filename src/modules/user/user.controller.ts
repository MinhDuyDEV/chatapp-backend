import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';

import { ROUTES } from '@/shared/constants/routes.enum';

import { UserService } from './user.service';
import { User } from '@/entities/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller(ROUTES.USERS)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }
}
