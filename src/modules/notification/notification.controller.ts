import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { User } from '@/entities/user.entity';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

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
