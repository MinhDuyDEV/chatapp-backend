import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { Services } from '@/shared/constants/services.enum';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from '@/entities/friend-request.entity';
import { User } from '@/entities/user.entity';
import { FollowModule } from '../follow/follow.module';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest, User]), FollowModule],
  controllers: [FriendController],
  providers: [
    {
      provide: Services.FRIENDS_SERVICE,
      useClass: FriendService,
    },
  ],
  exports: [
    {
      provide: Services.FRIENDS_SERVICE,
      useClass: FriendService,
    },
  ],
})
export class FriendModule {}
