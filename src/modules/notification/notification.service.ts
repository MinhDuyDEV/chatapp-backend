import { Injectable } from '@nestjs/common';
import { INotificationService } from '@/modules/notification/notifications';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/entities/user.entity';
import { Notification } from '@/entities/notification.entity';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(user: User, content: string): Promise<Notification> {
    const notification = this.notificationRepository.create({ content, user });
    return await this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { user: { id: userId } },
    });
  }

  markAsRead(notificationId: string): void {
    this.notificationRepository.update(notificationId, { read: true });
  }
}
