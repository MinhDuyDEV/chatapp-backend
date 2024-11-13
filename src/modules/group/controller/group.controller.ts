import {
  Controller,
  Post,
  Body,
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
} from '@nestjs/common';

import { ROUTES } from '@/shared/constants/routes.enum';
import { Services } from '@/shared/constants/services.enum';
import { IGroupService } from '@/modules/group/interfaces/groups';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { User } from '@/entities/user.entity';
import { CreateGroupDto } from '@/modules/group/dto/create-group.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller(ROUTES.GROUPS)
export class GroupController {
  constructor(
    @Inject(Services.GROUPS)
    private readonly groupService: IGroupService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createGroup(@AuthUser() user: User, @Body() payload: CreateGroupDto) {
    const group = await this.groupService.createGroup({
      ...payload,
      creator: user,
    });
    this.eventEmitter.emit('group.create', group);
    return group;
  }

  @Get()
  getGroups(@AuthUser() user: User) {
    return this.groupService.getGroups({ userId: user.id });
  }
}
