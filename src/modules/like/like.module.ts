import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '@/entities/like.entity';
import { Post } from '@/entities/post.entity';
import { User } from '@/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Post, User])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
