import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/entities/post.entity';
import { Media } from '@/entities/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Media])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
