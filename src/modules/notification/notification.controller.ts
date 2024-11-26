import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from '@/entities/user.entity';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { INotificationService } from './notifications';
import { Services } from '@/shared/constants/services.enum';

@Controller('notification')
export class NotificationController {
  constructor(
    @Inject(Services.NOTIFICATIONS)
    private readonly notificationService: INotificationService,
  ) {}

  @Post()
  async createNotification(
    @AuthUser() user: User,
    @Body('content') content: string,
  ) {
    return this.notificationService.createNotification(user, content);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Get()
  async getUserNotifications(@AuthUser() user: User) {
    return this.notificationService.getUserNotifications(user.id);
  }
}
