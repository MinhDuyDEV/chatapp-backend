import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from '@/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '@/entities/like.entity';
import { Comment } from '@/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like, Comment])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
