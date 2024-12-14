import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/entities/post.entity';
import { Follow } from '@/entities/follow.entity';
import { TimelineService } from './timeline.service';
import { TimelineController } from './timeline.controller';
import { CacheModule } from '@/modules/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Follow]), CacheModule],
  providers: [TimelineService],
  controllers: [TimelineController],
  exports: [TimelineService],
})
export class TimelineModule {}
