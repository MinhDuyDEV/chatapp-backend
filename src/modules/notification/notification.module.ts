import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from '@/entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '@/shared/constants/services.enum';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [
    {
      provide: Services.NOTIFICATIONS,
      useClass: NotificationService,
    },
  ],
})
export class NotificationModule {}
