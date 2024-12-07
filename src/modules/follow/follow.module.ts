import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from '@/entities/follow.entity';
import { User } from '@/entities/user.entity';
import { FollowService } from './follow.service';
import { Services } from '@/shared/constants/services.enum';
import { FollowController } from './follow.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User])],
  controllers: [FollowController],
  providers: [
    {
      provide: Services.FOLLOW_SERVICE,
      useClass: FollowService,
    },
  ],
  exports: [
    {
      provide: Services.FOLLOW_SERVICE,
      useClass: FollowService,
    },
  ],
})
export class FollowModule {}
