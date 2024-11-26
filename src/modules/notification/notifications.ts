import { User } from '@/entities/user.entity';
import { Notification } from '@/entities/notification.entity';

export interface INotificationService {
  createNotification(user: User, content: string): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: string): void;
}
