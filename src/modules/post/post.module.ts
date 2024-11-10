import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/entities/post.entity';
import { File } from '@/entities/file.entity';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, File]), CacheModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
