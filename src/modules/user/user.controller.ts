import { Controller, Get } from '@nestjs/common';

import { ROUTES } from '@/shared/constants/routes.enum';

import { UserService } from './user.service';
import { transformUserResponse } from '@/shared/utils/format';
import { UserResponse } from './dto/user-response.dto';

@Controller(ROUTES.USERS)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<UserResponse[]> {
    return (await this.userService.findAllUsers()).map(transformUserResponse);
  }
}
