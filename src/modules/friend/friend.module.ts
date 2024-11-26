import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from '@/entities/friend.entity';
import { FriendRequest } from '@/entities/friend-request.entity';
import { Services } from '@/shared/constants/services.enum';
import { FriendRequestService } from '@/modules/friend/services/friend-request.service';
import { FriendController } from '@/modules/friend/controllers/friend.controller';
import { FriendService } from '@/modules/friend/services/friend.service';
import { FriendRequestController } from '@/modules/friend/controllers/friend-request.controller';
import { UserModule } from '@/modules/user/user.module';
import { Follow } from '@/entities/follow.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friend, FriendRequest, Follow]),
    UserModule,
  ],
  controllers: [FriendController, FriendRequestController],
  providers: [
    {
      provide: Services.FRIENDS_SERVICE,
      useClass: FriendService,
    },
    {
      provide: Services.FRIENDS_REQUESTS_SERVICE,
      useClass: FriendRequestService,
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
